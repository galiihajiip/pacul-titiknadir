<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Accepts comma-separated roles as middleware parameter.
     * Usage: Route::middleware('role:government,admin')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Forbidden. Insufficient role.',
                'required_roles' => $roles,
            ], 403);
        }

        return $next($request);
    }
}
