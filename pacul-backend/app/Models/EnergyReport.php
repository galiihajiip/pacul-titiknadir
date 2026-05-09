<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnergyReport extends Model
{
    protected $fillable = [
        'user_id', 'year', 'month', 'kwh_usage', 'bill_amount',
        'cost_per_kwh', 'source', 'ocr_image_url', 'co2_kg',
        'benchmark_category', 'xp_earned', 'ocr_raw_data',
    ];

    protected $casts = [
        'co2_kg'       => 'decimal:4',
        'bill_amount'  => 'decimal:2',
        'cost_per_kwh' => 'decimal:2',
        'ocr_raw_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
