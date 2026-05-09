<?php

namespace App\Http\Controllers;

use App\Models\WasteReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function data(Request $request): JsonResponse
    {
        $pins = WasteReport::select('id', 'title', 'lat', 'lng', 'severity', 'status', 'category', 'upvotes_count', 'district')
            ->where('status', '!=', 'ditolak')
            ->get();

        $stats = [
            'total_reports'    => WasteReport::count(),
            'active_reports'   => WasteReport::whereIn('status', ['dilaporkan', 'diproses'])->count(),
            'resolved_reports' => WasteReport::where('status', 'selesai')->count(),
            'districts'        => WasteReport::select('district')
                                     ->distinct()->pluck('district'),
        ];

        return response()->json(['pins' => $pins, 'stats' => $stats]);
    }

    public function joinCommunity(Request $request): JsonResponse
    {
        $request->validate([
            'community_name' => 'required|string|max:200',
            'district'       => 'nullable|string|max:100',
        ]);

        return response()->json([
            'message' => 'Berhasil bergabung dengan komunitas!',
            'community_name' => $request->community_name,
        ]);
    }
}
