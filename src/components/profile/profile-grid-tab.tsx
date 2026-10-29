"use client";

import { useEffect, useState, useCallback } from "react";
import { Pin, Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  getHostGridMediaApi,
  addPersonalMediaApi,
  deletePersonalMediaApi,
  togglePinPersonalMediaApi,
  togglePinExperienceMediaApi,
} from "@/lib/api/users-api";
import { getPresignedUrl, uploadFileToS3 } from "@/lib/api/posts-api";
import { useFeedbackStore } from "@/stores/feedback-store";

interface ProfileGridTabProps {
  hostId: string;
  isOwnProfile: boolean;
}

export function ProfileGridTab({ hostId, isOwnProfile }: ProfileGridTabProps) {
  const { showToast } = useFeedbackStore();
  const [subTab, setSubTab] = useState<"experience" | "personal">("experience");
  const [experienceMedia, setExperienceMedia] = useState<any[]>([]);
  const [personalMedia, setPersonalMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadGrid = useCallback(async () => {
    if (!hostId) return;
    setLoading(true);
    try {
      const res = await getHostGridMediaApi(hostId);
      const data = res?.data || res || {};
      setExperienceMedia(data.experienceMedia || []);
      setPersonalMedia(data.personalMedia || []);
    } catch {
      // fallback empty
    } finally {
      setLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    loadGrid();
  }, [loadGrid]);

  const handleUploadPersonal = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadedItems: any[] = [];
      for (const file of Array.from(files)) {
        const presigned = await getPresignedUrl(file.name, file.type, {
          fileSize: file.size,
          uploadType: "personal-media",
        });
        const uploadUrl = presigned?.uploadUrl || presigned?.data?.uploadUrl;
        const fileUrl = presigned?.fileUrl || presigned?.data?.fileUrl;
        if (uploadUrl && fileUrl) {
          await uploadFileToS3(uploadUrl, file);
          uploadedItems.push({
            url: fileUrl,
            mediaType: file.type.startsWith("video") ? "video" : "image",
            caption: file.name,
          });
        }
      }
      if (uploadedItems.length > 0) {
        await addPersonalMediaApi(uploadedItems);
        showToast("Media added to your gallery!", "success");
        loadGrid();
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to upload media", "error");
    } finally {
      setUploading(false);
    }
  };

  const handlePinToggle = async (item: any) => {
    try {
      if (subTab === "personal") {
        await togglePinPersonalMediaApi(item._id || item.id);
      } else {
        await togglePinExperienceMediaApi(item.mediaKey || item.url);
      }
      loadGrid();
    } catch {
      showToast("Could not update pin status", "error");
    }
  };

  const handleDeletePersonal = async (id: string) => {
    try {
      await deletePersonalMediaApi(id);
      showToast("Media removed", "success");
      loadGrid();
    } catch {
      showToast("Could not delete media", "error");
    }
  };

  const activeItems = subTab === "experience" ? experienceMedia : personalMedia;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setSubTab("experience")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              subTab === "experience" ? "bg-[#C59A2F] text-white" : "text-neutral-500"
            }`}
          >
            Experience Shots ({experienceMedia.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("personal")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              subTab === "personal" ? "bg-[#C59A2F] text-white" : "text-neutral-500"
            }`}
          >
            Host Gallery ({personalMedia.length})
          </button>
        </div>

        {isOwnProfile && subTab === "personal" && (
          <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-bold cursor-pointer hover:bg-[#A67F26] transition">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            <span>{uploading ? "Uploading..." : "Upload Photos"}</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => handleUploadPersonal(e.target.files)}
            />
          </label>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-square rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : activeItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
          <ImageIcon size={36} className="mx-auto text-neutral-400 mb-3" />
          <h4 className="text-sm font-bold">No gallery media yet</h4>
          <p className="text-xs text-neutral-500 mt-1">
            {subTab === "experience"
              ? "Photos from hosted experiences automatically appear in this grid."
              : "Personal host moments and trail photos will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {activeItems.map((item, idx) => (
            <div
              key={item._id || item.mediaKey || idx}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800"
            >
              <img
                src={item.url || item.image}
                alt={item.caption || item.title || "Gallery media"}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {item.pinned && (
                <span className="absolute top-2 left-2 p-1.5 rounded-full bg-[#C59A2F] text-white shadow-xs">
                  <Pin size={12} />
                </span>
              )}
              {isOwnProfile && (
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => handlePinToggle(item)}
                    className="p-1.5 rounded-full bg-black/70 text-white hover:bg-[#C59A2F]"
                    title="Pin/Unpin"
                  >
                    <Pin size={12} />
                  </button>
                  {subTab === "personal" && (
                    <button
                      type="button"
                      onClick={() => handleDeletePersonal(item._id || item.id)}
                      className="p-1.5 rounded-full bg-black/70 text-rose-400 hover:bg-rose-600 hover:text-white"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
