<?php

namespace App\Http\Controllers;

use App\Models\{CommunityPost, PostLike};
use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollaborationController extends Controller
{
    public function __construct(private XPService $xpService) {}

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $query  = CommunityPost::with('user:id,name,avatar_url,level,city')
            ->withCount(['likes as is_liked_by_me' => fn($q) =>
                $q->where('user_id', $userId)
            ]);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $posts = $query->orderByDesc('is_pinned')
            ->orderByDesc('created_at')
            ->paginate(20);

        $posts->getCollection()->transform(function ($p) {
            $p->is_liked_by_me = (bool) $p->is_liked_by_me;
            return $p;
        });

        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type'       => 'required|in:TIPS,TANYA,GERAKAN,EVENT',
            'content'    => 'required|string|min:10|max:2000',
            'location'   => 'nullable|string|max:200',
            'images.*'   => 'nullable|image|max:5120',
        ]);

        $user = $request->user();
        $imageUrls = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $path = $img->store('posts', 'public');
                $imageUrls[] = asset('storage/' . $path);
            }
        }

        $post = CommunityPost::create([
            'user_id'    => $user->id,
            'type'       => $data['type'],
            'content'    => $data['content'],
            'location'   => $data['location'] ?? null,
            'image_urls' => $imageUrls ?: null,
        ]);

        $xp = $this->xpService->award($user, 'post_collaboration');

        return response()->json([
            'post'      => $post->load('user:id,name,avatar_url,level'),
            'xp_earned' => $xp,
        ], 201);
    }

    public function like(Request $request, int $id): JsonResponse
    {
        $post   = CommunityPost::findOrFail($id);
        $userId = $request->user()->id;

        $existing = PostLike::where('user_id', $userId)
            ->where('community_post_id', $id)->first();

        if ($existing) {
            $existing->delete();
            $post->decrement('likes_count');
            $liked = false;
        } else {
            PostLike::create(['user_id' => $userId, 'community_post_id' => $id]);
            $post->increment('likes_count');
            $liked = true;
        }

        return response()->json([
            'likes_count'    => $post->fresh()->likes_count,
            'is_liked_by_me' => $liked,
        ]);
    }
}
