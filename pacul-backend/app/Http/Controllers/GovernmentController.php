<?php

namespace App\Http\Controllers;

use App\Models\{WasteReport, User};
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class GovernmentController extends Controller
{
    private const ALLOWED_SORT_COLUMNS = [
        'created_at', 'upvotes_count', 'severity', 'status', 'title', 'district',
    ];

    private const ALLOWED_SORT_DIRECTIONS = ['asc', 'desc'];

    public function __construct(private XPService $xpService) {}

    public function reports(Request $request): JsonResponse
    {
        $request->validate([
            'status'    => 'nullable|in:dilaporkan,diproses,selesai,ditolak',
            'severity'  => 'nullable|in:rendah,sedang,tinggi,kritis',
            'category'  => 'nullable|in:organic,plastic,b3,electronic,bulk',
            'district'  => 'nullable|string|max:100',
            'search'    => 'nullable|string|max:100',
            'date_from' => 'nullable|date',
            'date_to'   => 'nullable|date|after_or_equal:date_from',
            'sort'      => 'nullable|in:' . implode(',', self::ALLOWED_SORT_COLUMNS),
            'dir'       => 'nullable|in:asc,desc',
            'per_page'  => 'nullable|integer|min:1|max:100',
        ]);

        $query = WasteReport::with('user:id,name,level,city');

        if ($request->filled('status'))    $query->where('status', $request->status);
        if ($request->filled('severity'))  $query->where('severity', $request->severity);
        if ($request->filled('category'))  $query->where('category', $request->category);
        if ($request->filled('district'))  $query->where('district', $request->district);
        if ($request->filled('search')) {
            $search = mb_substr($request->search, 0, 100);
            $query->where(fn($q) =>
                $q->where('title', 'like', '%' . addcslashes($search, '%_') . '%')
                  ->orWhere('address', 'like', '%' . addcslashes($search, '%_') . '%')
            );
        }
        if ($request->filled('date_from')) $query->whereDate('created_at', '>=', $request->date_from);
        if ($request->filled('date_to'))   $query->whereDate('created_at', '<=', $request->date_to);

        $sort = in_array($request->get('sort'), self::ALLOWED_SORT_COLUMNS) ? $request->get('sort') : 'created_at';
        $dir  = in_array($request->get('dir'), self::ALLOWED_SORT_DIRECTIONS) ? $request->get('dir') : 'desc';
        $query->orderBy($sort, $dir);

        return response()->json($query->paginate(min((int) $request->get('per_page', 20), 100)));
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status'               => 'required|in:diproses,selesai,ditolak',
            'assigned_to'          => 'nullable|string|max:200',
            'resolution_notes'     => 'required_if:status,selesai|required_if:status,ditolak|nullable|string|max:2000',
            'estimated_resolution' => 'nullable|date|after_or_equal:today',
        ]);

        $report = WasteReport::findOrFail($id);
        $oldStatus = $report->status;

        // Prevent invalid status transitions
        $validTransitions = [
            'dilaporkan' => ['diproses', 'ditolak'],
            'diproses'   => ['selesai', 'ditolak'],
            'selesai'    => [],
            'ditolak'    => [],
        ];

        if (!in_array($data['status'], $validTransitions[$oldStatus] ?? [])) {
            return response()->json([
                'message' => "Tidak bisa mengubah status dari '{$oldStatus}' ke '{$data['status']}'.",
            ], 422);
        }

        $updateData = [
            'status'               => $data['status'],
            'assigned_to'          => $data['assigned_to'] ?? $report->assigned_to,
            'resolution_notes'     => $data['resolution_notes'] ?? null,
            'estimated_resolution' => $data['estimated_resolution'] ?? null,
        ];

        if ($data['status'] === 'selesai') {
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

        // Clear dashboard stats cache
        Cache::forget('gov_dashboard_stats');

        return response()->json([
            'report'  => $report->fresh()->load('user:id,name'),
            'message' => 'Status laporan berhasil diperbarui.',
        ]);
    }

    public function dashboardStats(Request $request): JsonResponse
    {
        $stats = Cache::remember('gov_dashboard_stats', 300, function () {
            $now     = now();
            $weekAgo = $now->copy()->subDays(7);

            return [
                'total_active'          => WasteReport::whereIn('status', ['dilaporkan', 'diproses'])->count(),
                'today_new'             => WasteReport::whereDate('created_at', $now->toDateString())->count(),
                'resolved_this_week'    => WasteReport::where('status', 'selesai')
                                              ->where('resolved_at', '>=', $weekAgo)->count(),
                'critical_unhandled'    => WasteReport::where('severity', 'kritis')
                                              ->where('status', 'dilaporkan')->count(),
                'avg_resolution_days'   => (float) WasteReport::where('status', 'selesai')
                                              ->whereNotNull('resolved_at')
                                              ->selectRaw("AVG(CAST((julianday(resolved_at) - julianday(created_at)) AS REAL)) as avg_days")
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
        });

        return response()->json($stats);
    }

    public function exportReports(Request $request)
    {
        $request->validate([
            'status'    => 'nullable|in:dilaporkan,diproses,selesai,ditolak',
            'date_from' => 'nullable|date',
            'date_to'   => 'nullable|date|after_or_equal:date_from',
        ]);

        $query = WasteReport::with('user:id,name');

        if ($request->filled('status'))    $query->where('status', $request->status);
        if ($request->filled('date_from')) $query->whereDate('created_at', '>=', $request->date_from);
        if ($request->filled('date_to'))   $query->whereDate('created_at', '<=', $request->date_to);

        $reports = $query->limit(5000)->get();

        $csvLines = ["ID,Judul,Alamat,Kecamatan,Kategori,Severity,Status,Pelapor,Tanggal,Tanggal Selesai,XP Diberikan"];

        foreach ($reports as $r) {
            $csvLines[] = implode(',', [
                $r->report_code,
                $this->escapeCsvField($r->title),
                $this->escapeCsvField($r->address),
                $this->escapeCsvField($r->district),
                $r->category,
                $r->severity,
                $r->status,
                $this->escapeCsvField($r->user?->name ?? '-'),
                $r->created_at->toDateString(),
                $r->resolved_at?->toDateString() ?? '-',
                $r->xp_awarded,
            ]);
        }

        $filename = 'laporan-sampah-' . now()->format('Y-m-d') . '.csv';

        return response(implode("\n", $csvLines), 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Escape CSV field to prevent CSV injection attacks.
     */
    private function escapeCsvField(string $field): string
    {
        // Strip leading characters that could trigger formula injection
        $field = preg_replace('/^[\s]*[=+\-@\t\r]/', '', $field);
        $field = str_replace('"', '""', $field);
        return '"' . $field . '"';
    }
}
