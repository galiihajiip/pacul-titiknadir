<?php

namespace App\Http\Controllers;

use App\Models\{Voucher, UserVoucher};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VoucherController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $vouchers = Voucher::where('is_active', true)
            ->where('valid_until', '>=', now()->toDateString())
            ->where('remaining_quota', '>', 0)
            ->withCount(['userVouchers as is_redeemed' => fn($q) =>
                $q->where('user_id', $userId)
            ])
            ->get()
            ->map(fn($v) => array_merge($v->toArray(), ['is_redeemed' => (bool) $v->is_redeemed]));

        return response()->json($vouchers);
    }

    public function redeem(Request $request, int $id): JsonResponse
    {
        $user    = $request->user();
        $voucher = Voucher::findOrFail($id);

        if (! $voucher->isAvailable()) {
            return response()->json(['message' => 'Voucher tidak tersedia atau sudah habis.'], 422);
        }

        $alreadyRedeemed = UserVoucher::where('user_id', $user->id)
            ->where('voucher_id', $id)->exists();

        if ($alreadyRedeemed) {
            return response()->json(['message' => 'Kamu sudah menukar voucher ini.'], 422);
        }

        if ($user->current_xp < $voucher->xp_cost) {
            return response()->json(['message' => 'XP tidak cukup. Kamu butuh ' . $voucher->xp_cost . ' XP.'], 422);
        }

        $user->decrement('current_xp', $voucher->xp_cost);
        $voucher->decrement('remaining_quota');

        $uniqueCode = strtoupper(Str::random(10));
        $userVoucher = UserVoucher::create([
            'user_id'     => $user->id,
            'voucher_id'  => $id,
            'unique_code' => $uniqueCode,
            'status'      => 'active',
            'redeemed_at' => now(),
            'qr_data'     => json_encode(['code' => $uniqueCode, 'voucher_id' => $id]),
        ]);

        return response()->json([
            'user_voucher' => $userVoucher->load('voucher'),
            'message'      => 'Voucher berhasil ditukar! 🎫',
        ], 201);
    }

    public function myVouchers(Request $request): JsonResponse
    {
        $vouchers = UserVoucher::where('user_id', $request->user()->id)
            ->with('voucher')
            ->orderByDesc('redeemed_at')
            ->get();

        return response()->json($vouchers);
    }

    public function markUsed(Request $request, int $userVoucherId): JsonResponse
    {
        $uv = UserVoucher::where('id', $userVoucherId)
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->firstOrFail();

        $uv->update(['status' => 'used', 'used_at' => now()]);

        return response()->json(['message' => 'Voucher berhasil digunakan.', 'user_voucher' => $uv->fresh()]);
    }
}
