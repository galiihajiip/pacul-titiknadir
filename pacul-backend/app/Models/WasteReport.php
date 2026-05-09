<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WasteReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_code', 'user_id', 'title', 'description', 'category',
        'severity', 'status', 'lat', 'lng', 'address', 'district',
        'kelurahan', 'upvotes_count', 'assigned_to', 'resolution_notes',
        'resolved_by', 'resolved_at', 'estimated_resolution', 'xp_awarded',
    ];

    protected $casts = [
        'lat' => 'decimal:7',
        'lng' => 'decimal:7',
        'resolved_at' => 'datetime',
        'estimated_resolution' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (WasteReport $report) {
            $report->report_code = 'WR-' . strtoupper(substr(uniqid(), -8));
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function upvotes()
    {
        return $this->hasMany(WasteReportUpvote::class);
    }

    public function photos()
    {
        return $this->hasMany(WasteReportPhoto::class);
    }

    public function isUpvotedBy(int $userId): bool
    {
        return $this->upvotes()->where('user_id', $userId)->exists();
    }
}
