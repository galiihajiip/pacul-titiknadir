<?php

namespace App\Http\Controllers;

use App\Models\{WasteReport, WasteReportUpvote};
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WasteReportController extends Controller
{
    public function __construct(private XPService $xpService) {}

    public function index(Request $request): JsonResponse
    {
        $query = WasteReport::with('user:id,name,level')
            ->withCount(['upvotes as is_upvoted_by_me' => fn($q) =>
                $q->where('user_id', $request->user()->id)
            ]);

        if ($request->filled('status'))   $query->where('status', $request->status);
        if ($request->filled('category')) $query->where('category', $request->category);
        if ($request->filled('severity')) $query->where('severity', $request->severity);
        if ($request->filled('district')) $query->where('district', $request->district);
        if ($request->filled('search'))   $query->where(fn($q) =>
            $q->where('title', 'like', "%{$request->search}%")
              ->orWhere('address', 'like', "%{$request->search}%")
        );

        $sort = $request->get('sort', 'created_at');
        $dir  = $request->get('dir', 'desc');
        $query->orderBy($sort, $dir);

        $reports = $query->paginate($request->get('per_page', 20));

        $reports->getCollection()->transform(function ($r) {
            $r->is_upvoted_by_me = (bool) $r->is_upvoted_by_me;
            return $r;
        });

        return response()->json($reports);
    }

    public function mapPins(Request $request): JsonResponse
    {
        $query = WasteReport::select('id', 'title', 'lat', 'lng', 'severity', 'status', 'category', 'upvotes_count')
            ->where('status', '!=', 'ditolak');

        if ($request->filled('min_lat')) {
            $query->whereBetween('lat', [$request->min_lat, $request->max_lat])
                  ->whereBetween('lng', [$request->min_lng, $request->max_lng]);
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:200',
            'description' => 'required|string|min:20',
            'category'    => 'required|in:organic,plastic,b3,electronic,bulk',
            'severity'    => 'required|in:rendah,sedang,tinggi,kritis',
            'lat'         => 'required|numeric|between:-90,90',
            'lng'         => 'required|numeric|between:-180,180',
            'address'     => 'required|string',
            'district'    => 'required|string',
            'photos.*'    => 'nullable|image|max:5120',
        ]);

        $user = $request->user();

        $photoUrls = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('waste-reports', 'public');
                $photoUrls[] = asset('storage/' . $path);
            }
        }

        $report = WasteReport::create(array_merge($data, [
            'user_id'    => $user->id,
            'photo_urls' => $photoUrls,
        ]));

        $xp = $this->xpService->award($user, 'waste_report');

        return response()->json([
            'report'       => $report->load('user:id,name,level'),
            'xp_earned'    => $xp,
            'message'      => 'Laporan berhasil dikirim! +' . $xp . ' XP 🌿',
        ], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $report = WasteReport::with('user:id,name,level')->findOrFail($id);
        $report->is_upvoted_by_me = $report->isUpvotedBy($request->user()->id);
        return response()->json($report);
    }

    public function upvote(Request $request, int $id): JsonResponse
    {
        $report = WasteReport::findOrFail($id);
        $userId = $request->user()->id;

        $existing = WasteReportUpvote::where('user_id', $userId)
            ->where('waste_report_id', $id)
            ->first();

        if ($existing) {
            $existing->delete();
            $report->decrement('upvotes_count');
            $isUpvoted = false;
        } else {
            WasteReportUpvote::create(['user_id' => $userId, 'waste_report_id' => $id]);
            $report->increment('upvotes_count');
            $isUpvoted = true;
        }

        return response()->json([
            'upvotes'          => $report->fresh()->upvotes_count,
            'is_upvoted_by_me' => $isUpvoted,
        ]);
    }
}
