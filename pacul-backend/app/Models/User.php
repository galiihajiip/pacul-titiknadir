<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'government_unit',
        'avatar_url', 'city', 'district', 'level', 'current_xp',
        'total_xp', 'streak_days', 'last_active_date', 'push_subscription',
        'notifications_enabled',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_active_date'  => 'date',
        'notifications_enabled' => 'boolean',
        'password' => 'hashed',
    ];

    public function householdProfile()
    {
        return $this->hasOne(HouseholdProfile::class);
    }

    public function emissions()
    {
        return $this->hasMany(Emission::class);
    }

    public function userChallenges()
    {
        return $this->hasMany(UserChallenge::class);
    }

    public function stepSessions()
    {
        return $this->hasMany(StepSession::class);
    }

    public function energyReports()
    {
        return $this->hasMany(EnergyReport::class);
    }

    public function userVouchers()
    {
        return $this->hasMany(UserVoucher::class);
    }

    public function wasteReports()
    {
        return $this->hasMany(WasteReport::class);
    }

    public function communityPosts()
    {
        return $this->hasMany(CommunityPost::class);
    }

    public function xpLogs()
    {
        return $this->hasMany(XpLog::class);
    }

    public function pushSubscriptions()
    {
        return $this->hasMany(PushSubscription::class);
    }

    public function isGovernment(): bool
    {
        return in_array($this->role, ['government', 'admin']);
    }

    public function getAvatarInitialsAttribute(): string
    {
        $words = explode(' ', $this->name);
        $initials = '';
        foreach (array_slice($words, 0, 2) as $w) {
            $initials .= strtoupper($w[0] ?? '');
        }
        return $initials;
    }
}
