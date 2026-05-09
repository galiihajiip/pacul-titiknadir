<?php

namespace App\Http\Controllers;

use App\Models\{Challenge, UserChallenge, User};
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EcoActionController extends Controller
{
    public function __construct(private XPService $xpService) {}

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $challenges = Challenge::where('is_active', true)
            ->where('end_date', '>=', now()->toDateString())
            ->withCount(['userChallenges as joined' => fn($q) =>
                $q->where('user_id', $userId)
            ])
            ->orderByDesc('participants_count')
            ->get();

        return response()->json($challenges);
    }

    public function join(Request $request, int $id): JsonResponse
    {
        $user      = $request->user();
        $challenge = Challenge::findOrFail($id);

        if (! $challenge->isActive()) {
            return response()->json(['message' => 'Tantangan sudah tidak aktif.'], 422);
        }

        $existing = UserChallenge::where('user_id', $user->id)
            ->where('challenge_id', $id)->first();

        if ($existing) {
            return response()->json(['message' => 'Sudah bergabung dalam tantangan ini.'], 422);
        }

        $userChallenge = UserChallenge::create([
            'user_id'      => $user->id,
            'challenge_id' => $id,
            'status'       => 'joined',
            'joined_at'    => now(),
        ]);

        $challenge->increment('participants_count');

        return response()->json([
            'user_challenge' => $userChallenge,
            'message'        => 'Berhasil bergabung! 🌿',
        ], 201);
    }

    public function uploadProof(Request $request): JsonResponse
    {
        $data = $request->validate([
            'challenge_id' => 'required|exists:challenges,id',
            'proof'        => 'required|image|max:5120',
            'caption'      => 'nullable|string|max:300',
        ]);

        $user = $request->user();
        $userChallenge = UserChallenge::where('user_id', $user->id)
            ->where('challenge_id', $data['challenge_id'])
            ->where('status', 'joined')
            ->firstOrFail();

        $path = $request->file('proof')->store('eco-proofs', 'public');

        $userChallenge->update([
            'status'             => 'proof_uploaded',
            'proof_url'          => asset('storage/' . $path),
            'proof_caption'      => $data['caption'] ?? null,
            'proof_uploaded_at'  => now(),
        ]);

        $xp = $this->xpService->award($user, 'upload_proof');

        return response()->json([
            'user_challenge' => $userChallenge->fresh(),
            'xp_earned'      => $xp,
            'message'        => '+' . $xp . ' XP untuk upload bukti!',
        ]);
    }

    public function claimReward(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $userChallenge = UserChallenge::where('user_id', $user->id)
            ->where('challenge_id', $id)
            ->whereIn('status', ['proof_uploaded', 'completed'])
            ->with('challenge')
            ->firstOrFail();

        $xpReward = $userChallenge->challenge->xp_reward;
        $xp = $this->xpService->award($user, 'claim_challenge', $xpReward);

        $userChallenge->update([
            'status'     => 'claimed',
            'claimed_at' => now(),
        ]);

        return response()->json([
            'xp_earned' => $xp,
            'message'   => '+' . $xp . ' XP berhasil diklaim! 🎉',
        ]);
    }

    public function leaderboard(Request $request): JsonResponse
    {
        $leaders = User::select('id', 'name', 'avatar_url', 'level', 'total_xp', 'city')
            ->orderByDesc('total_xp')
            ->limit(20)
            ->get()
            ->map(fn($u, $i) => array_merge($u->toArray(), ['rank' => $i + 1]));

        return response()->json($leaders);
    }

    public function myChallenges(Request $request): JsonResponse
    {
        $challenges = UserChallenge::where('user_id', $request->user()->id)
            ->with('challenge')
            ->orderByDesc('joined_at')
            ->get();

        return response()->json($challenges);
    }
}
