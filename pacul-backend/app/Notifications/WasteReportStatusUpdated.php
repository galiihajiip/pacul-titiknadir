<?php

namespace App\Notifications;

use App\Models\WasteReport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class WasteReportStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private WasteReport $report) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $messages = [
            'diproses' => 'Laporan kamu sedang diproses! 🔔',
            'selesai'  => 'Laporan kamu telah diselesaikan! +100 XP 🎉',
            'ditolak'  => 'Laporan kamu ditolak. Lihat alasannya.',
        ];

        return [
            'type'       => 'waste_report_status',
            'report_id'  => $this->report->id,
            'report_code'=> $this->report->report_code,
            'title'      => $this->report->title,
            'status'     => $this->report->status,
            'message'    => $messages[$this->report->status] ?? 'Status laporan diperbarui.',
            'url'        => '/dashboard/laporan-sampah?id=' . $this->report->id,
        ];
    }
}
