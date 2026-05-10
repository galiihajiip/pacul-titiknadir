<?php

namespace App\Http\Controllers;

use App\Models\WasteReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MapController extends Controller
{
    public function data(Request $request): JsonResponse
    {
        $request->validate([
            'min_lat' => 'nullable|numeric|between:-90,90',
            'max_lat' => 'nullable|numeric|between:-90,90',
            'min_lng' => 'nullable|numeric|between:-180,180',
            'max_lng' => 'nullable|numeric|between:-180,180',
        ]);

        $query = WasteReport::select('id', 'title', 'lat', 'lng', 'severity', 'status', 'category', 'upvotes_count', 'district')
            ->where('status', '!=', 'ditolak');

        // Apply bounding box filter if provided
        if ($request->filled('min_lat') && $request->filled('max_lat')) {
            $query->whereBetween('lat', [(float) $request->min_lat, (float) $request->max_lat])
                  ->whereBetween('lng', [(float) $request->min_lng, (float) $request->max_lng]);
        }

        $pins = $query->limit(1000)->get();

        $stats = Cache::remember('map_stats', 300, function () {
            return [
                'total_reports'    => WasteReport::count(),
                'active_reports'   => WasteReport::whereIn('status', ['dilaporkan', 'diproses'])->count(),
                'resolved_reports' => WasteReport::where('status', 'selesai')->count(),
                'districts'        => WasteReport::select('district')
                                         ->distinct()->pluck('district'),
            ];
        });

        return response()->json(['pins' => $pins, 'stats' => $stats]);
    }

    public function joinCommunity(Request $request): JsonResponse
    {
        $request->validate([
            'community_name' => 'required|string|max:200',
            'district'       => 'nullable|string|max:100',
        ]);

        // TODO: Implement community persistence when community model is ready
        return response()->json([
            'message' => 'Berhasil bergabung dengan komunitas!',
            'community_name' => $request->community_name,
        ]);
    }
}
