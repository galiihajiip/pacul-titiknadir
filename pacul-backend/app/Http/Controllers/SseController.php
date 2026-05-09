<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SseController extends Controller
{
    public function stream(Request $request): StreamedResponse
    {
        $user = $request->user();

        return response()->stream(function () use ($user) {
            $lastCheck = time();

            while (true) {
                if (connection_aborted()) break;

                // Check for unread notifications
                $notifications = $user->unreadNotifications()
                    ->where('created_at', '>=', now()->subSeconds(15))
                    ->take(5)
                    ->get();

                if ($notifications->isNotEmpty()) {
                    echo "data: " . json_encode([
                        'type' => 'notifications',
                        'data' => $notifications,
                    ]) . "\n\n";
                    ob_flush();
                    flush();
                }

                // Heartbeat every 30s to keep connection alive
                if (time() - $lastCheck >= 30) {
                    echo ": heartbeat\n\n";
                    ob_flush();
                    flush();
                    $lastCheck = time();
                }

                sleep(10);
            }
        }, 200, [
            'Content-Type'     => 'text/event-stream',
            'Cache-Control'    => 'no-cache',
            'X-Accel-Buffering'=> 'no',
            'Connection'       => 'keep-alive',
        ]);
    }
}
