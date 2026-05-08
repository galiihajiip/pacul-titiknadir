"use client";

import { useState } from "react";
import PostComposer, { type NewPost } from "@/components/features/collaboration-wall/PostComposer";

type PostType = "Ide" | "Gerakan" | "Event" | "Laporan";

const TYPE_COLOR: Record<PostType, string> = {
  Ide: "#2D5F3F",
  Gerakan: "#10B981",
  Event: "#F59E0B",
  Laporan: "#EF4444",
};

export default function CollaborationPage() {
  const [posts, setPosts] = useState<NewPost[]>([]);

  const handleNewPost = (post: NewPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Collaboration Wall</h1>
        <p className="mt-1 text-sm text-gray-500">Bagikan ide, gerakan, dan aksi hijaumu</p>
      </div>

      {/* Post composer — full width */}
      <PostComposer onPost={handleNewPost} />

      {/* Feed + Sidebar grid */}
      <div className="grid gap-6 lg:grid-cols-[60fr_40fr]">
        {/* Left: feed */}
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-[#E5E7EB] bg-white px-6 py-12 text-center">
              <p className="text-sm font-medium text-gray-400">Belum ada post.</p>
              <p className="mt-1 text-xs text-gray-300">Mulai dengan posting ide pertamamu!</p>
            </div>
          ) : (
            posts.map((post) => {
              const color = TYPE_COLOR[post.type as PostType] ?? "#2D5F3F";
              return (
                <div
                  key={post.id}
                  className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm"
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: "#2D5F3F" }}
                    >
                      {post.avatar}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">{post.author}</p>
                      <p className="text-xs text-gray-400">{post.createdAt}</p>
                    </div>
                    <span
                      className="ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {post.type}
                    </span>
                  </div>
                  <p className="text-sm text-[#1A1A1A]">{post.content}</p>
                  {post.linkedAction && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-md bg-[#2D5F3F]/5 px-3 py-2 text-xs text-[#2D5F3F]">
                      🔒 Aksi terverifikasi: <span className="font-medium">{post.linkedAction}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right: sidebar placeholder */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Trending Topik</h3>
            <p className="mt-2 text-xs text-gray-400">Tersedia di BLOK 5.2</p>
          </div>
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Anggota Aktif</h3>
            <p className="mt-2 text-xs text-gray-400">Tersedia di BLOK 5.2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
