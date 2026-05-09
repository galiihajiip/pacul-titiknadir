<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StepSession extends Model
{
    protected $fillable = [
        'user_id', 'session_date', 'steps', 'distance_km',
        'calories_burned', 'co2_saved_kg', 'active_minutes',
        'xp_earned', 'hourly_steps',
    ];

    protected $casts = [
        'session_date'  => 'date',
        'hourly_steps'  => 'array',
        'distance_km'   => 'decimal:3',
        'calories_burned' => 'decimal:2',
        'co2_saved_kg'  => 'decimal:4',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
