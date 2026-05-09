<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushNotificationController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint'       => 'required|string|max:500',
            'public_key'     => 'nullable|string',
            'auth_token'     => 'nullable|string',
            'content_encoding' => 'nullable|string',
        ]);

        PushSubscription::updateOrCreate(
            ['endpoint' => $data['endpoint']],
            array_merge($data, ['user_id' => $request->user()->id])
        );

        return response()->json(['message' => 'Push subscription saved.']);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $request->validate(['endpoint' => 'required|string']);

        PushSubscription::where('user_id', $request->user()->id)
            ->where('endpoint', $request->endpoint)
            ->delete();

        return response()->json(['message' => 'Unsubscribed.']);
    }
}
