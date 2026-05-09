<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XpLog extends Model
{
    protected $fillable = [
        'user_id', 'action', 'xp_amount', 'total_after',
        'source_type', 'source_id', 'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function source()
    {
        return $this->morphTo();
    }
}
