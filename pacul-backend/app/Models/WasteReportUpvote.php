<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WasteReportUpvote extends Model
{
    protected $fillable = ['user_id', 'waste_report_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wasteReport()
    {
        return $this->belongsTo(WasteReport::class);
    }
}
