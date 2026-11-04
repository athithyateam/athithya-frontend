"use client";

import React from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { FormSection, ErrorMsg } from "../form-primitives";
import type { MediaItem, ExistingMedia, FormErrors } from "./types";

interface Step4MediaUploadProps {
  media: MediaItem[];
  existingPhotos: ExistingMedia[];
  existingVideos: ExistingMedia[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeMedia: (idx: number) => void;
  removeExistingPhoto: (idx: number) => void;
  removeExistingVideo: (idx: number) => void;
  loading: boolean;
  progress: number;
  errors: FormErrors;
}

export function Step4MediaUpload({
  media,
  existingPhotos,
  existingVideos,
  handleFileChange,
  removeMedia,
  removeExistingPhoto,
  removeExistingVideo,
  loading,
  progress,
  errors,
}: Step4MediaUploadProps) {
  return (
    <div className="space-y-5">
      <FormSection title="Media Uploads">
        {/* Upload Drop Zone */}
        <label className="rounded-2xl p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-[#C59A2F] bg-neutral-50/50 dark:bg-neutral-800/30 transition flex flex-col items-center justify-center text-center cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-neutral-800 text-[#C59A2F] flex items-center justify-center mb-3">
            <FiUpload size={22} />
          </div>
          <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
            Click or Drag photos & videos here
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            Upload up to 5 photos or 1 video max. High-resolution landscape photos recommended.
          </p>
        </label>
        <ErrorMsg error={errors.media} />

        {/* Media Previews Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {/* Existing Photos */}
          {existingPhotos.map((p, idx) => (
            <div
              key={`exist_photo_${idx}`}
              className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 group"
            >
              <img src={p.url} alt="Photo" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingPhoto(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition cursor-pointer"
                title="Remove photo"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}

          {/* Existing Videos */}
          {existingVideos.map((v, idx) => (
            <div
              key={`exist_video_${idx}`}
              className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 group"
            >
              <video src={v.url} className="w-full h-full object-cover" controls />
              <button
                type="button"
                onClick={() => removeExistingVideo(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition cursor-pointer"
                title="Remove video"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}

          {/* New Selected Media */}
          {media.map((m, idx) => (
            <div
              key={`new_media_${idx}`}
              className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 group"
            >
              {m.type === "image" ? (
                <img src={m.preview} alt="New Upload" className="w-full h-full object-cover" />
              ) : (
                <video src={m.preview} className="w-full h-full object-cover" controls />
              )}
              <button
                type="button"
                onClick={() => removeMedia(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition cursor-pointer"
                title="Remove file"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Upload Progress Bar */}
        {loading && (
          <div className="mt-4 space-y-2">
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#C59A2F] h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] font-bold text-center text-neutral-500">
              Uploading media & saving experience: {progress}%
            </p>
          </div>
        )}
      </FormSection>
    </div>
  );
}
