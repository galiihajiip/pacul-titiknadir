<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'category', 'activity', 'value', 'unit',
        'co2_kg', 'emission_factor', 'notes', 'activity_date',
    ];

    protected $casts = [
        'activity_date' => 'date',
        'co2_kg' => 'decimal:4',
        'value'  => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
