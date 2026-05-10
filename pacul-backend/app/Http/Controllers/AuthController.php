<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\XPService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function __construct(private XPService $xpService) {}

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'city'     => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'city'     => $data['city'] ?? 'Surabaya',
            'district' => $data['district'] ?? null,
        ]);

        $this->xpService->award($user, 'register');

        $token = $user->createToken('pacul_token')->plainTextToken;

        return response()->json([
            'user'  => $user->makeHidden(['password']),
            'token' => $token,
            'message' => 'Registrasi berhasil! Selamat datang di PACUL 🌿',
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        // Award daily login XP only once per day
        $today = now()->toDateString();
        if ($user->last_active_date?->toDateString() !== $today) {
            $this->xpService->award($user, 'daily_login');
            $user->update([
                'last_active_date' => $today,
                'streak_days'      => $user->last_active_date?->diffInDays(now()) === 1
                    ? $user->streak_days + 1
                    : 1,
            ]);
        }

        // Revoke old tokens to prevent token accumulation
        $user->tokens()->where('name', 'pacul_token')->delete();
        $token = $user->createToken('pacul_token')->plainTextToken;

        return response()->json([
            'user'  => $user->makeHidden(['password']),
            'token' => $token,
        ]);
    }

    public function govLogin(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $allowedDomains = ['surabaya.go.id', 'pacul.gov.id'];
        $domain = substr(strrchr($data['email'], '@'), 1);

        if (! in_array($domain, $allowedDomains)) {
            return response()->json(['message' => 'Gunakan email akun pemerintah (@surabaya.go.id atau @pacul.gov.id).'], 403);
        }

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            // Use same error message to prevent user enumeration
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        if (! in_array($user->role, ['government', 'admin'])) {
            return response()->json(['message' => 'Akun ini tidak memiliki akses pemerintah.'], 403);
        }

        // Revoke old gov tokens
        $user->tokens()->where('name', 'pacul_gov_token')->delete();
        $token = $user->createToken('pacul_gov_token', ['government'])->plainTextToken;

        return response()->json([
            'user'  => $user->makeHidden(['password']),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user()->load('householdProfile')->makeHidden(['password']));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'      => 'sometimes|string|max:100',
            'city'      => 'sometimes|string|max:100',
            'district'  => 'sometimes|string|max:100',
        ]);

        $request->user()->update($data);

        return response()->json($request->user()->fresh()->makeHidden(['password']));
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,webp|max:2048',
        ]);

        // Delete old avatar if exists
        $user = $request->user();
        if ($user->avatar_url) {
            $oldPath = str_replace(asset('storage/'), '', $user->avatar_url);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('avatar')->store('avatars/' . $user->id, 'public');
        $user->update(['avatar_url' => asset('storage/' . $path)]);

        return response()->json(['avatar_url' => $user->fresh()->avatar_url]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        if (! Hash::check($request->current_password, $request->user()->password)) {
            return response()->json(['message' => 'Password lama salah.'], 422);
        }

        $request->user()->update(['password' => $request->new_password]);

        // Revoke all tokens except current
        $request->user()->tokens()
            ->where('id', '!=', $request->user()->currentAccessToken()->id)
            ->delete();

        return response()->json(['message' => 'Password berhasil diubah.']);
    }

    public function deleteAccount(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if (! Hash::check($request->password, $request->user()->password)) {
            return response()->json(['message' => 'Password salah.'], 422);
        }

        $request->user()->tokens()->delete();
        $request->user()->delete();
        return response()->json(['message' => 'Akun berhasil dihapus.']);
    }
}
