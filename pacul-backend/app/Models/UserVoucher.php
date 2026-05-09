<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserVoucher extends Model
{
    protected $fillable = [
        'user_id', 'voucher_id', 'unique_code', 'status',
        'redeemed_at', 'used_at', 'qr_data',
    ];

    protected $casts = [
        'redeemed_at' => 'datetime',
        'used_at'     => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
}
