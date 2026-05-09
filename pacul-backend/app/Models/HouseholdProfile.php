<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseholdProfile extends Model
{
    protected $fillable = [
        'user_id', 'profile_type', 'member_count', 'ac_count',
        'fridge_count', 'washing_machine_count', 'has_water_heater', 'kwh_baseline',
    ];

    protected $casts = [
        'has_water_heater' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
