<?php

namespace App\Http\Controllers;

use App\Models\{WasteReport, User};
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GovernmentController extends Controller
{
    public function __construct(private XPService $xpService) {}

    public function reports(Request $request): JsonResponse
    {
        $query = WasteReport::with('user:id,name,level,city');

        if ($request->filled('status'))    $query->where('status', $request->status);
        if ($request->filled('severity'))  $query->where('severity', $request->severity);
        if ($request->filled('category'))  $query->where('category', $request->category);
        if ($request->filled('district'))  $query->where('district', $request->district);
        if ($request->filled('search'))    $query->where(fn($q) =>
            $q->where('title', 'like', "%{$request->search}%")
              ->orWhere('address', 'like', "%{$request->search}%")
        );
        if ($request->filled('date_from')) $query->whereDate('created_at', '>=', $request->date_from);
        if ($request->filled('date_to'))   $query->whereDate('created_at', '<=', $request->date_to);

        $sort = $request->get('sort', 'created_at');
        $dir  = $request->get('dir', 'desc');
        $query->orderBy($sort, $dir);

        return response()->json($query->paginate($request->get('per_page', 20)));
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status'           => 'required|in:diproses,selesai,ditolak',
            'assigned_to'      => 'nullable|string|max:200',
            'resolution_notes' => 'required_if:status,selesai|required_if:status,ditolak|nullable|string',
            'estimated_resolution' => 'nullable|date',
        ]);

        $report = WasteReport::findOrFail($id);
        $oldStatus = $report->status;

        $updateData = array_filter([
            'status'               => $data['status'],
            'assigned_to'          => $data['assigned_to'] ?? null,
            'resolution_notes'     => $data['resolution_notes'] ?? null,
            'estimated_resolution' => $data['estimated_resolution'] ?? null,
        ], fn($v) => $v !== null);

        if ($data['status'] === 'selesai' && $oldStatus !== 'selesai') {
            $updateData['resolved_at'] = now();
            $updateData['resolved_by'] = $request->user()->id;

            // Award bonus XP to reporter on resolution
            $reporter = $report->user;
            if ($reporter) {
                $this->xpService->award($reporter, 'waste_report_resolved');
            }
        }

        $report->update($updateData);

        // Notify reporter (via database notification)
        if ($report->user) {
            $report->user->notify(new \App\Notifications\WasteReportStatusUpdated($report));
        }

        return response()->json([
            'report'  => $report->fresh()->load('user:id,name'),
            'message' => 'Status laporan berhasil diperbarui.',
        ]);
    }

    public function dashboardStats(Request $request): JsonResponse
    {
        $now     = now();
        $weekAgo = $now->copy()->subDays(7);

        $stats = [
            'total_active'          => WasteReport::whereIn('status', ['dilaporkan', 'diproses'])->count(),
            'today_new'             => WasteReport::whereDate('created_at', $now->toDateString())->count(),
            'resolved_this_week'    => WasteReport::where('status', 'selesai')
                                          ->where('resolved_at', '>=', $weekAgo)->count(),
            'critical_unhandled'    => WasteReport::where('severity', 'kritis')
                                          ->where('status', 'dilaporkan')->count(),
            'avg_resolution_days'   => WasteReport::where('status', 'selesai')
                                          ->whereNotNull('resolved_at')
                                          ->selectRaw('AVG(DATEDIFF(resolved_at, created_at)) as avg_days')
                                          ->value('avg_days'),
            'by_status'             => WasteReport::selectRaw('status, COUNT(*) as count')
                                          ->groupBy('status')->pluck('count', 'status'),
            'by_severity'           => WasteReport::selectRaw('severity, COUNT(*) as count')
                                          ->groupBy('severity')->pluck('count', 'severity'),
            'by_district'           => WasteReport::selectRaw('district, COUNT(*) as count')
                                          ->groupBy('district')
                                          ->orderByDesc('count')
                                          ->limit(10)->pluck('count', 'district'),
            'daily_trend_7d'        => WasteReport::where('created_at', '>=', $weekAgo)
                                          ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                                          ->groupBy('date')
                                          ->orderBy('date')
                                          ->get(),
        ];

        return response()->json($stats);
    }

    public function exportReports(Request $request)
    {
        $query = WasteReport::with('user:id,name');

        if ($request->filled('status'))    $query->where('status', $request->status);
        if ($request->filled('date_from')) $query->whereDate('created_at', '>=', $request->date_from);
        if ($request->filled('date_to'))   $query->whereDate('created_at', '<=', $request->date_to);

        $reports = $query->get();

        $csvLines = ["ID,Judul,Alamat,Kecamatan,Kategori,Severity,Status,Pelapor,Tanggal,Tanggal Selesai,XP Diberikan"];

        foreach ($reports as $r) {
            $csvLines[] = implode(',', [
                $r->report_code,
                '"' . str_replace('"', '""', $r->title) . '"',
                '"' . str_replace('"', '""', $r->address) . '"',
                $r->district,
                $r->category,
                $r->severity,
                $r->status,
                '"' . ($r->user?->name ?? '-') . '"',
                $r->created_at->toDateString(),
                $r->resolved_at?->toDateString() ?? '-',
                $r->xp_awarded,
            ]);
        }

        $filename = 'laporan-sampah-' . now()->format('Y-m-d') . '.csv';

        return response(implode("\n", $csvLines), 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
