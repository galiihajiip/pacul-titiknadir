<?php

namespace App\Http\Controllers;

use App\Models\Emission;
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CarbonController extends Controller
{
    public function __construct(private XPService $xpService) {}

    public function index(Request $request): JsonResponse
    {
        $emissions = Emission::where('user_id', $request->user()->id)
            ->orderByDesc('activity_date')
            ->paginate(30);

        return response()->json($emissions);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category'      => 'required|in:transportation,food,electricity,shopping,waste,other',
            'activity'      => 'required|string|max:200',
            'value'         => 'required|numeric|min:0',
            'unit'          => 'required|string|max:20',
            'co2_kg'        => 'required|numeric|min:0',
            'emission_factor' => 'nullable|numeric',
            'notes'         => 'nullable|string|max:500',
            'activity_date' => 'required|date',
        ]);

        $user = $request->user();
        $emission = Emission::create(array_merge($data, ['user_id' => $user->id]));

        $xp = $this->xpService->award($user, 'add_emission');

        return response()->json([
            'emission'  => $emission,
            'xp_earned' => $xp,
        ], 201);
    }

    public function weeklyTrend(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $data = Emission::where('user_id', $userId)
            ->where('activity_date', '>=', now()->subDays(7))
            ->selectRaw('DATE(activity_date) as date, SUM(co2_kg) as total_co2')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($data);
    }

    public function monthlyTrend(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $data = Emission::where('user_id', $userId)
            ->where('activity_date', '>=', now()->subMonths(6))
            ->selectRaw('YEAR(activity_date) as year, MONTH(activity_date) as month, SUM(co2_kg) as total_co2')
            ->groupByRaw('YEAR(activity_date), MONTH(activity_date)')
            ->orderByRaw('year, month')
            ->get();

        return response()->json($data);
    }

    public function breakdown(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $data = Emission::where('user_id', $userId)
            ->where('activity_date', '>=', now()->subDays(30))
            ->selectRaw('category, SUM(co2_kg) as total_co2, COUNT(*) as count')
            ->groupBy('category')
            ->get();

        return response()->json($data);
    }

    public function summary(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $today  = now()->toDateString();
        $weekAgo = now()->subDays(7)->toDateString();
        $monthAgo = now()->subDays(30)->toDateString();

        $todayTotal   = Emission::where('user_id', $userId)->whereDate('activity_date', $today)->sum('co2_kg');
        $weekTotal    = Emission::where('user_id', $userId)->where('activity_date', '>=', $weekAgo)->sum('co2_kg');
        $monthTotal   = Emission::where('user_id', $userId)->where('activity_date', '>=', $monthAgo)->sum('co2_kg');
        $allTimeTotal = Emission::where('user_id', $userId)->sum('co2_kg');

        return response()->json([
            'today'    => round($todayTotal, 3),
            'week'     => round($weekTotal, 3),
            'month'    => round($monthTotal, 3),
            'all_time' => round($allTimeTotal, 3),
        ]);
    }
}
