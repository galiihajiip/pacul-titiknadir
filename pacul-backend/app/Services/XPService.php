<?php

namespace App\Services;

use App\Models\{User, XpLog};
use Illuminate\Support\Facades\Cache;

class XPService
{
    public const XP_RULES = [
        'add_emission'             => 25,
        'upload_proof'             => 50,
        'step_milestone_1000'      => 10,
        'step_milestone_5000'      => 50,
        'step_milestone_10000'     => 100,
        'electricity_sangat_hemat' => 200,
        'waste_report'             => 50,
        'waste_report_resolved'    => 100,
        'register'                 => 50,
        'daily_login'              => 5,
        'post_collaboration'       => 10,
        'first_scan'               => 30,
        'claim_challenge'          => 0, // Dynamic amount
    ];

    // Actions that can only be awarded once per day per user
    private const DAILY_LIMIT_ACTIONS = [
        'daily_login',
        'step_milestone_1000',
        'step_milestone_5000',
        'step_milestone_10000',
    ];

    public function award(User $user, string $action, int $amount = 0, array $meta = []): int
    {
        $xp = $amount > 0 ? $amount : (self::XP_RULES[$action] ?? 0);
        if ($xp <= 0) return 0;

        // Prevent duplicate daily awards
        if (in_array($action, self::DAILY_LIMIT_ACTIONS)) {
            $cacheKey = "xp_daily_{$user->id}_{$action}_" . now()->toDateString();
            if (Cache::has($cacheKey)) {
                return 0;
            }
            Cache::put($cacheKey, true, now()->endOfDay());
        }

        $user->increment('current_xp', $xp);
        $user->increment('total_xp', $xp);

        $fresh = $user->fresh();

        XpLog::create([
            'user_id'    => $user->id,
            'action'     => $action,
            'xp_amount'  => $xp,
            'total_after'=> $fresh->total_xp,
            'meta'       => $meta ?: null,
        ]);

        $this->checkLevelUp($fresh);

        // Invalidate leaderboard cache when XP changes
        Cache::forget('leaderboard_top20');

        return $xp;
    }

    private function checkLevelUp(User $user): void
    {
        $newLevel = $this->calculateLevel($user->total_xp);
        if ($newLevel > $user->level) {
            $user->update(['level' => $newLevel]);
        }
    }

    public function calculateLevel(int $totalXp): int
    {
        return max(1, (int) floor(sqrt($totalXp / 100)) + 1);
    }
}
