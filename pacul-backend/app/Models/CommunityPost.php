<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CommunityPost extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'type', 'content', 'image_urls',
        'location', 'likes_count', 'comments_count', 'is_pinned',
    ];

    protected $casts = [
        'image_urls' => 'array',
        'is_pinned'  => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(PostLike::class);
    }

    public function isLikedBy(int $userId): bool
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }
}
