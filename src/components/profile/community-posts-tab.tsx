"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Trash2, Plus, Image as ImageIcon, MapPin, Loader2 } from "lucide-react";
import {
  getUserCommunityPostsApi,
  createCommunityPostApi,
  toggleLikeCommunityPostApi,
  deleteCommunityPostApi,
} from "@/lib/api/users-api";
import { getPresignedUrl, uploadFileToS3 } from "@/lib/api/posts-api";
import { useFeedbackStore } from "@/stores/feedback-store";

interface CommunityPostsTabProps {
  userId: string;
  isOwnProfile: boolean;
}

export function CommunityPostsTab({ userId, isOwnProfile }: CommunityPostsTabProps) {
  const { showToast } = useFeedbackStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [caption, setCaption] = useState("");
  const [locationText, setLocationText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getUserCommunityPostsApi(userId);
      const list = res?.posts || res?.data?.posts || (Array.isArray(res) ? res : []);
      setPosts(list);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleUploadImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const presigned = await getPresignedUrl(file.name, file.type, {
        fileSize: file.size,
        uploadType: "community",
      });
      const uploadUrl = presigned?.uploadUrl || presigned?.data?.uploadUrl;
      const fileUrl = presigned?.fileUrl || presigned?.data?.fileUrl;
      if (!uploadUrl || !fileUrl) throw new Error("Upload URL unavailable");
      await uploadFileToS3(uploadUrl, file);
      setMediaUrl(fileUrl);
      showToast("Photo ready to post", "success");
    } catch (err: any) {
      showToast(err?.message || "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() && !mediaUrl) return;
    setSubmitting(true);
    try {
      await createCommunityPostApi({
        caption,
        content: caption,
        location: locationText,
        images: mediaUrl ? [{ url: mediaUrl }] : [],
        image: mediaUrl || undefined,
      });
      setCaption("");
      setLocationText("");
      setMediaUrl("");
      setShowCreate(false);
      showToast("Community memory shared!", "success");
      loadPosts();
    } catch (err: any) {
      showToast(err?.message || "Failed to publish post", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await toggleLikeCommunityPostApi(postId);
      loadPosts();
    } catch {
      showToast("Please sign in to like posts", "warning");
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteCommunityPostApi(postId);
      showToast("Post deleted", "success");
      loadPosts();
    } catch {
      showToast("Failed to delete post", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black">Community Stories & Memories</h3>
        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setShowCreate(!showCreate)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-bold hover:bg-[#A67F26] transition"
          >
            <Plus size={14} /> Share Story
          </button>
        )}
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreatePost}
          className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4"
        >
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            placeholder="Share a travel story, hidden trail tip, or Himalayan memory..."
            className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm"
            required
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Location (e.g. Kedarkantha)"
                className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs"
              />
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                <span>{mediaUrl ? "Change Photo" : "Add Photo"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImage(e.target.files?.[0])} />
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-5 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Publish"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-56 rounded-3xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
          <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">No community stories posted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => {
            const img = post.image || post.images?.[0]?.url || post.media?.[0]?.url;
            return (
              <div
                key={post._id || post.id}
                className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                {img && (
                  <div className="aspect-video w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <img src={img} alt="Story" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  {post.location && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C59A2F]">
                      <MapPin size={12} /> {typeof post.location === "string" ? post.location : post.location.city}
                    </span>
                  )}
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    {post.caption || post.content}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                    <button
                      type="button"
                      onClick={() => handleLike(post._id || post.id)}
                      className="inline-flex items-center gap-1.5 font-bold text-rose-500 hover:scale-105 transition"
                    >
                      <Heart size={14} className={post.isLiked ? "fill-rose-500" : ""} />
                      <span>{post.likesCount ?? post.likes?.length ?? 0} Likes</span>
                    </button>
                    {isOwnProfile && (
                      <button
                        type="button"
                        onClick={() => handleDelete(post._id || post.id)}
                        className="text-neutral-400 hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
