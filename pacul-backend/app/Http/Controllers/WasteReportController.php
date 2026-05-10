<?php

namespace App\Http\Controllers;

use App\Models\{WasteReport, WasteReportUpvote};
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WasteReportController extends Controller
{
    private const ALLOWED_SORT_COLUMNS = [
        'created_at', 'upvotes_count', 'severity', 'status', 'title',
    ];

    private const ALLOWED_SORT_DIRECTIONS = ['asc', 'desc'];

    public function __construct(private XPService $xpService) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status'   => 'nullable|in:dilaporkan,diproses,selesai,ditolak',
            'category' => 'nullable|in:organic,plastic,b3,electronic,bulk',
            'severity' => 'nullable|in:rendah,sedang,tinggi,kritis',
            'district' => 'nullable|string|max:100',
            'search'   => 'nullable|string|max:100',
            'sort'     => 'nullable|in:' . implode(',', self::ALLOWED_SORT_COLUMNS),
            'dir'      => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = WasteReport::with('user:id,name,level')
            ->withCount(['upvotes as is_upvoted_by_me' => fn($q) =>
                $q->where('user_id', $request->user()->id)
            ]);

        if ($request->filled('status'))   $query->where('status', $request->status);
        if ($request->filled('category')) $query->where('category', $request->category);
        if ($request->filled('severity')) $query->where('severity', $request->severity);
        if ($request->filled('district')) $query->where('district', $request->district);
        if ($request->filled('search')) {
            $search = mb_substr($request->search, 0, 100);
            $query->where(fn($q) =>
                $q->where('title', 'like', '%' . addcslashes($search, '%_') . '%')
                  ->orWhere('address', 'like', '%' . addcslashes($search, '%_') . '%')
            );
        }

        $sort = in_array($request->get('sort'), self::ALLOWED_SORT_COLUMNS) ? $request->get('sort') : 'created_at';
        $dir  = in_array($request->get('dir'), self::ALLOWED_SORT_DIRECTIONS) ? $request->get('dir') : 'desc';
        $query->orderBy($sort, $dir);

        $reports = $query->paginate(min((int) $request->get('per_page', 20), 100));

        $reports->getCollection()->transform(function ($r) {
            $r->is_upvoted_by_me = (bool) $r->is_upvoted_by_me;
            return $r;
        });

        return response()->json($reports);
    }

    public function mapPins(Request $request): JsonResponse
    {
        $request->validate([
            'min_lat' => 'nullable|numeric|between:-90,90',
            'max_lat' => 'nullable|numeric|between:-90,90',
            'min_lng' => 'nullable|numeric|between:-180,180',
            'max_lng' => 'nullable|numeric|between:-180,180',
        ]);

        $query = WasteReport::select('id', 'title', 'lat', 'lng', 'severity', 'status', 'category', 'upvotes_count')
            ->where('status', '!=', 'ditolak');

        if ($request->filled('min_lat') && $request->filled('max_lat')) {
            $query->whereBetween('lat', [(float) $request->min_lat, (float) $request->max_lat])
                  ->whereBetween('lng', [(float) $request->min_lng, (float) $request->max_lng]);
        }

        // Limit results to prevent memory issues
        return response()->json($query->limit(500)->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:200',
            'description' => 'required|string|min:20|max:2000',
            'category'    => 'required|in:organic,plastic,b3,electronic,bulk',
            'severity'    => 'required|in:rendah,sedang,tinggi,kritis',
            'lat'         => 'required|numeric|between:-90,90',
            'lng'         => 'required|numeric|between:-180,180',
            'address'     => 'required|string|max:500',
            'district'    => 'required|string|max:100',
            'kelurahan'   => 'nullable|string|max:100',
            'photos'      => 'nullable|array|max:5',
            'photos.*'    => 'image|max:5120',
        ]);

        $user = $request->user();

        $report = WasteReport::create([
            'user_id'     => $user->id,
            'title'       => $data['title'],
            'description' => $data['description'],
            'category'    => $data['category'],
            'severity'    => $data['severity'],
            'lat'         => $data['lat'],
            'lng'         => $data['lng'],
            'address'     => $data['address'],
            'district'    => $data['district'],
            'kelurahan'   => $data['kelurahan'] ?? null,
        ]);

        // Store photos using media library if available
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $photo->store('waste-reports/' . $report->id, 'public');
            }
        }

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

        // Prevent self-upvote
        if ($report->user_id === $userId) {
            return response()->json(['message' => 'Tidak bisa upvote laporan sendiri.'], 422);
        }

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
