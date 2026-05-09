<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'title', 'description', 'partner_name', 'partner_logo_url',
        'category', 'xp_cost', 'discount_value', 'discount_type',
        'valid_until', 'total_quota', 'remaining_quota', 'terms', 'is_active',
    ];

    protected $casts = [
        'valid_until' => 'date',
        'is_active'   => 'boolean',
    ];

    public function userVouchers()
    {
        return $this->hasMany(UserVoucher::class);
    }

    public function isAvailable(): bool
    {
        return $this->is_active
            && $this->remaining_quota > 0
            && $this->valid_until >= now()->toDateString();
    }
}
