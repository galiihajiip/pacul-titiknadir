<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserChallenge extends Model
{
    protected $fillable = [
        'user_id', 'challenge_id', 'status', 'proof_url', 'proof_caption',
        'joined_at', 'proof_uploaded_at', 'completed_at', 'claimed_at', 'progress_value',
    ];

    protected $casts = [
        'joined_at'          => 'datetime',
        'proof_uploaded_at'  => 'datetime',
        'completed_at'       => 'datetime',
        'claimed_at'         => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }
}
