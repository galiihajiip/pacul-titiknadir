<?php

namespace App\Services;

use App\Models\{User, PushSubscription};
use Minishlink\WebPush\{WebPush, Subscription};
use Illuminate\Support\Facades\Log;

class PushNotificationService
{
    private WebPush $webPush;

    public function __construct()
    {
        $auth = [
            'VAPID' => [
                'subject'    => config('services.vapid.subject'),
                'publicKey'  => config('services.vapid.public_key'),
                'privateKey' => config('services.vapid.private_key'),
            ],
        ];

        $this->webPush = new WebPush($auth);
    }

    /**
     * Send push to a single user.
     */
    public function sendToUser(User $user, string $title, string $body, string $url = '/dashboard', array $extra = []): void
    {
        $subscriptions = PushSubscription::where('user_id', $user->id)->get();

        if ($subscriptions->isEmpty()) return;

        $payload = json_encode(array_merge([
            'title'   => $title,
            'body'    => $body,
            'url'     => $url,
            'icon'    => '/icons/icon-192x192.png',
            'badge'   => '/icons/icon-72x72.png',
            'vibrate' => [200, 100, 200],
        ], $extra));

        foreach ($subscriptions as $sub) {
            try {
                $subscription = Subscription::create([
                    'endpoint'        => $sub->endpoint,
                    'keys'            => [
                        'p256dh' => $sub->public_key,
                        'auth'   => $sub->auth_token,
                    ],
                    'contentEncoding' => $sub->content_encoding ?? 'aesgcm',
                ]);

                $this->webPush->queueNotification($subscription, $payload);
            } catch (\Exception $e) {
                Log::warning("PushNotification queueNotification failed for sub {$sub->id}: " . $e->getMessage());
            }
        }

        foreach ($this->webPush->flush() as $report) {
            if (! $report->isSuccess()) {
                Log::warning("Push failed for endpoint {$report->getEndpoint()}: " . $report->getReason());

                if ($report->isSubscriptionExpired()) {
                    PushSubscription::where('endpoint', $report->getEndpoint())->delete();
                }
            }
        }
    }

    /**
     * Send push to multiple users.
     */
    public function sendToUsers(iterable $users, string $title, string $body, string $url = '/dashboard', array $extra = []): void
    {
        foreach ($users as $user) {
            $this->sendToUser($user, $title, $body, $url, $extra);
        }
    }

    // ── Named notification triggers ──────────────────────────────────────────

    /**
     * Notify reporter when waste report status changes.
     */
    public function notifyWasteReportStatusChanged(User $reporter, string $reportTitle, string $newStatus, int $reportId): void
    {
        $messages = [
            'diproses' => ['Laporan Kamu Diproses! 🔔', "Laporan \"{$reportTitle}\" sedang ditangani petugas."],
            'selesai'  => ['Laporan Selesai! 🎉 +100 XP', "Laporan \"{$reportTitle}\" telah diselesaikan. Kamu dapat bonus 100 XP!"],
            'ditolak'  => ['Laporan Ditolak', "Laporan \"{$reportTitle}\" ditolak. Buka untuk melihat alasan."],
        ];

        [$title, $body] = $messages[$newStatus] ?? ['Status Laporan Diperbarui', "Status laporan \"{$reportTitle}\" berubah menjadi {$newStatus}."];

        $this->sendToUser($reporter, $title, $body, "/dashboard/laporan-sampah?id={$reportId}");
    }

    /**
     * Notify challenge participants when deadline is near (< 3 days).
     */
    public function notifyChallengeDeadlineNear(User $user, string $challengeTitle, int $daysLeft): void
    {
        $this->sendToUser(
            $user,
            "Tantangan Hampir Berakhir! ⏰",
            "\"{$challengeTitle}\" berakhir dalam {$daysLeft} hari. Segera upload buktimu!",
            '/dashboard/eco-action'
        );
    }

    /**
     * Notify user when XP milestone is reached.
     */
    public function notifyXpMilestone(User $user, int $milestone): void
    {
        $this->sendToUser(
            $user,
            "Milestone XP Tercapai! 🏆",
            "Selamat! Kamu telah mengumpulkan {$milestone} XP. Level up menanti!",
            '/dashboard/profile'
        );
    }

    /**
     * Notify nearby users (radius ~2km) when a new waste report is filed.
     */
    public function notifyNearbyUsers(float $lat, float $lng, int $reportId, string $district): void
    {
        // Approximate 2km bounding box (0.018 degrees ≈ 2km)
        $delta = 0.018;

        $nearbyUsers = User::where('role', 'user')
            ->whereNotNull('push_subscription')
            ->get()
            ->filter(fn(User $u) =>
                // Lazy filter — for prod use PostGIS or haversine query
                abs(($u->lat ?? 0) - $lat) < $delta &&
                abs(($u->lng ?? 0) - $lng) < $delta
            );

        foreach ($nearbyUsers as $user) {
            $this->sendToUser(
                $user,
                "Laporan Sampah Baru di {$district} 🗑️",
                "Ada laporan sampah baru di dekat lokasimu. Tap untuk lihat.",
                "/dashboard/laporan-sampah?id={$reportId}"
            );
        }
    }
}
