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
            'password' => ['required', Password::min(8)],
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
            'user'  => $user,
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

        $this->xpService->award($user, 'daily_login');

        $token = $user->createToken('pacul_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
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
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        if (! in_array($user->role, ['government', 'admin'])) {
            return response()->json(['message' => 'Akun ini tidak memiliki akses pemerintah.'], 403);
        }

        $token = $user->createToken('pacul_gov_token', ['government'])->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user()->load('householdProfile'));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'      => 'sometimes|string|max:100',
            'city'      => 'sometimes|string|max:100',
            'district'  => 'sometimes|string|max:100',
        ]);

        $request->user()->update($data);

        return response()->json($request->user()->fresh());
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate(['avatar' => 'required|image|max:2048']);

        $path = $request->file('avatar')->store('avatars', 'public');
        $request->user()->update(['avatar_url' => asset('storage/' . $path)]);

        return response()->json(['avatar_url' => $request->user()->fresh()->avatar_url]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => ['required', Password::min(8), 'confirmed'],
        ]);

        if (! Hash::check($request->current_password, $request->user()->password)) {
            return response()->json(['message' => 'Password lama salah.'], 422);
        }

        $request->user()->update(['password' => $request->new_password]);

        return response()->json(['message' => 'Password berhasil diubah.']);
    }

    public function deleteAccount(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();
        $request->user()->delete();
        return response()->json(['message' => 'Akun berhasil dihapus.']);
    }
}
