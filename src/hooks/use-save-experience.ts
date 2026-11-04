"use client";

import { useState, useMemo } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { saveExperienceApi, unsaveExperienceApi } from "@/lib/api/experiences-api";

export interface UseSaveExperienceOptions {
  onUnsave?: (id: string) => void;
}

/**
 * Reusable hook for saving / un-saving experiences (wishlisting).
 * Handles optimistic updates, auth gating, role restriction, and toast notifications.
 */
export function useSaveExperience(
  experienceId: string,
  options: UseSaveExperienceOptions = {}
) {
  const { user: currentUser, fetchUser, openAuthModal } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const [optimisticSaved, setOptimisticSaved] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const computedSaved = useMemo(() => {
    if (!experienceId) return false;
    const savedList = currentUser?.savedExperiences || currentUser?.savedPosts;
    if (!Array.isArray(savedList)) return false;
    return savedList.some((item: unknown) => {
      const idStr =
        item && typeof item === "object"
          ? (item as { _id?: string; id?: string })._id ||
            (item as { _id?: string; id?: string }).id
          : item;
      return String(idStr) === String(experienceId);
    });
  }, [currentUser?.savedExperiences, currentUser?.savedPosts, experienceId]);

  const isSaved = optimisticSaved !== null ? optimisticSaved : computedSaved;

  const toggleSave = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (!experienceId) return;

    if (!currentUser) {
      openAuthModal("login");
      return;
    }

    if (currentUser.role === "host") {
      showToast(
        "Hosts cannot engage with another host's experience. Only guests can.",
        "error"
      );
      return;
    }

    if (isSubmitting) return;

    const nextSavedState = !isSaved;
    setOptimisticSaved(nextSavedState);
    setIsSubmitting(true);

    try {
      if (nextSavedState) {
        await saveExperienceApi(experienceId);
        showToast("Experience saved to your profile!", "success");
      } else {
        await unsaveExperienceApi(experienceId);
        showToast("Experience removed from saved", "success");
        options.onUnsave?.(experienceId);
      }
      await fetchUser();
    } catch {
      // Revert optimistic state on failure
      setOptimisticSaved(!nextSavedState);
      showToast("Failed to update bookmark", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSaved,
    isLoading: isSubmitting,
    toggleSave,
  };
}

