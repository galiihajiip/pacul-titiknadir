<?php

namespace App\Http\Controllers;

use App\Models\{EnergyReport, HouseholdProfile};
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnergyController extends Controller
{
    // kWh benchmark per profile type per month
    private const BENCHMARKS = [
        'kos'          => ['sangat_hemat' => 50, 'hemat' => 80,  'normal' => 120, 'boros' => 200],
        'apartemen'    => ['sangat_hemat' => 80, 'hemat' => 130, 'normal' => 200, 'boros' => 300],
        'rumah_kecil'  => ['sangat_hemat' => 100,'hemat' => 160, 'normal' => 250, 'boros' => 400],
        'rumah_sedang' => ['sangat_hemat' => 150,'hemat' => 220, 'normal' => 350, 'boros' => 500],
        'rumah_besar'  => ['sangat_hemat' => 200,'hemat' => 320, 'normal' => 500, 'boros' => 700],
    ];

    public function __construct(private XPService $xpService) {}

    public function index(Request $request): JsonResponse
    {
        $reports = EnergyReport::where('user_id', $request->user()->id)
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get();

        return response()->json($reports);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'year'         => 'required|integer|between:2020,2030',
            'month'        => 'required|integer|between:1,12',
            'kwh_usage'    => 'required|integer|min:0',
            'bill_amount'  => 'nullable|numeric|min:0',
            'source'       => 'nullable|in:manual,ocr_scan',
            'ocr_image_url'=> 'nullable|string',
            'ocr_raw_data' => 'nullable|array',
        ]);

        $user    = $request->user();
        $profile = $user->householdProfile;
        $type    = $profile?->profile_type ?? 'rumah_sedang';
        $bench   = self::BENCHMARKS[$type];
        $kwh     = $data['kwh_usage'];
        $co2     = round($kwh * 0.87, 4);

        $category = match(true) {
            $kwh <= $bench['sangat_hemat'] => 'sangat_hemat',
            $kwh <= $bench['hemat']        => 'hemat',
            $kwh <= $bench['normal']       => 'normal',
            $kwh <= $bench['boros']        => 'boros',
            default                        => 'sangat_boros',
        };

        $xpEarned = match($category) {
            'sangat_hemat' => $this->xpService->award($user, 'electricity_sangat_hemat'),
            'hemat'        => $this->xpService->award($user, 'add_emission', 50),
            default        => 0,
        };

        $report = EnergyReport::updateOrCreate(
            ['user_id' => $user->id, 'year' => $data['year'], 'month' => $data['month']],
            array_merge($data, [
                'user_id'            => $user->id,
                'co2_kg'             => $co2,
                'benchmark_category' => $category,
                'xp_earned'          => $xpEarned,
            ])
        );

        return response()->json([
            'report'             => $report,
            'benchmark_category' => $category,
            'xp_earned'          => $xpEarned,
        ], 201);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'profile_type'           => 'required|in:kos,apartemen,rumah_kecil,rumah_sedang,rumah_besar',
            'member_count'           => 'required|integer|min:1|max:20',
            'ac_count'               => 'nullable|integer|min:0',
            'fridge_count'           => 'nullable|integer|min:0',
            'washing_machine_count'  => 'nullable|integer|min:0',
            'has_water_heater'       => 'nullable|boolean',
            'kwh_baseline'           => 'nullable|integer|min:0',
        ]);

        $profile = HouseholdProfile::updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json($profile);
    }

    public function getProfile(Request $request): JsonResponse
    {
        $profile = $request->user()->householdProfile;
        return response()->json($profile);
    }

    public function getBenchmark(Request $request): JsonResponse
    {
        $profile = $request->user()->householdProfile;
        $type    = $profile?->profile_type ?? 'rumah_sedang';

        return response()->json([
            'profile_type' => $type,
            'benchmarks'   => self::BENCHMARKS[$type],
        ]);
    }
}
