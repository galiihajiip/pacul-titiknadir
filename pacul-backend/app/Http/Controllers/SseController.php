<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SseController extends Controller
{
    /**
     * SSE stream endpoint.
     * Auth is handled by Sanctum middleware (Bearer token in header).
     * Frontend should NOT pass token in URL query string.
     */
    public function stream(Request $request): StreamedResponse
    {
        $user = $request->user();

        return response()->stream(function () use ($user) {
            $lastCheck = time();
            $maxDuration = 120; // Max 2 minutes per connection to prevent resource exhaustion
            $startTime = time();

            while (true) {
                if (connection_aborted()) break;
                if ((time() - $startTime) >= $maxDuration) break;

                try {
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
                } catch (\Exception $e) {
                    // Log error but don't crash the stream
                    \Illuminate\Support\Facades\Log::warning('SSE stream error: ' . $e->getMessage());
                    break;
                }

                sleep(10);
            }

            // Send close event so client knows to reconnect
            echo "event: close\ndata: {\"reason\":\"timeout\"}\n\n";
            ob_flush();
            flush();
        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache, no-store, must-revalidate',
            'X-Accel-Buffering' => 'no',
            'Connection'        => 'keep-alive',
        ]);
    }
}
