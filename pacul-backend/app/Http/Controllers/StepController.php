<?php

namespace App\Http\Controllers;

use App\Models\StepSession;
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StepController extends Controller
{
    public function __construct(private XPService $xpService) {}

    public function save(Request $request): JsonResponse
    {
        $data = $request->validate([
            'steps'          => 'required|integer|min:0',
            'distance_km'    => 'nullable|numeric|min:0',
            'calories_burned'=> 'nullable|numeric|min:0',
            'active_minutes' => 'nullable|integer|min:0',
            'hourly_steps'   => 'nullable|array',
            'session_date'   => 'nullable|date',
        ]);

        $user = $request->user();
        $date = $data['session_date'] ?? now()->toDateString();

        $session = StepSession::updateOrCreate(
            ['user_id' => $user->id, 'session_date' => $date],
            [
                'steps'           => $data['steps'],
                'distance_km'     => $data['distance_km']     ?? round($data['steps'] * 0.000762, 3),
                'calories_burned' => $data['calories_burned']  ?? round($data['steps'] * 0.04, 2),
                'co2_saved_kg'    => round($data['steps'] * 0.000762 * 0.21, 4),
                'active_minutes'  => $data['active_minutes']   ?? 0,
                'hourly_steps'    => $data['hourly_steps']      ?? null,
            ]
        );

        // Award milestone XP
        $xpEarned = 0;
        $steps = $session->steps;
        if ($steps >= 10000) $xpEarned += $this->xpService->award($user, 'step_milestone_10000');
        elseif ($steps >= 5000) $xpEarned += $this->xpService->award($user, 'step_milestone_5000');
        elseif ($steps >= 1000) $xpEarned += $this->xpService->award($user, 'step_milestone_1000');

        $session->update(['xp_earned' => $xpEarned]);

        return response()->json(['session' => $session, 'xp_earned' => $xpEarned]);
    }

    public function today(Request $request): JsonResponse
    {
        $session = StepSession::where('user_id', $request->user()->id)
            ->whereDate('session_date', now()->toDateString())
            ->first();

        return response()->json($session ?? ['steps' => 0, 'distance_km' => 0, 'calories_burned' => 0]);
    }

    public function weekly(Request $request): JsonResponse
    {
        $sessions = StepSession::where('user_id', $request->user()->id)
            ->where('session_date', '>=', now()->subDays(7)->toDateString())
            ->orderBy('session_date')
            ->get();

        return response()->json($sessions);
    }

    public function history(Request $request): JsonResponse
    {
        $sessions = StepSession::where('user_id', $request->user()->id)
            ->orderByDesc('session_date')
            ->paginate(30);

        return response()->json($sessions);
    }
}
