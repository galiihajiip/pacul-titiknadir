<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'emoji', 'category', 'difficulty',
        'xp_reward', 'target_value', 'target_unit', 'duration_days',
        'start_date', 'end_date', 'participants_count', 'is_active',
        'requires_proof', 'proof_type', 'tips',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'is_active'  => 'boolean',
        'requires_proof' => 'boolean',
        'tips' => 'array',
    ];

    public function userChallenges()
    {
        return $this->hasMany(UserChallenge::class);
    }

    public function isActive(): bool
    {
        return $this->is_active && $this->end_date >= now()->toDateString();
    }
}
