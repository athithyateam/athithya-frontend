"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiEye,
  FiEyeOff,
  FiExternalLink,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFeedbackStore } from "@/stores/feedback-store";
import { useAuthStore } from "@/stores/auth-store";
import { deleteService } from "@/lib/api/posts-api";
import { apiClient } from "@/lib/api/axios-instance";
import { ExperienceCard } from "@/components/cards/experience-card";
import { GOLD, type ProfileTheme } from "./profile-shared";

interface HostExperienceDataTableProps {
  experiences?: any[];
  isLoading?: boolean;
  onRefresh?: () => void;
  pagination?: any;
  onPageChange?: (page: number) => void;
  isThemed?: boolean;
  theme?: ProfileTheme;
}

export function HostExperienceDataTable({
  experiences = [],
  isLoading = false,
  onRefresh,
  pagination,
  onPageChange,
  isThemed = false,
  theme,
}: HostExperienceDataTableProps) {
  const router = useRouter();
  const { showToast, showConfirm } = useFeedbackStore();
  const { user, setShowHostStatusModal } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [hideModalData, setHideModalData] = useState<{
    ids: string[];
    action: "hide" | "unhide";
  } | null>(null);
  const [hideReasonText, setHideReasonText] = useState("");
  const [isSubmittingHide, setIsSubmittingHide] = useState(false);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    experiences.forEach((exp) => {
      if (Array.isArray(exp.categories)) {
        exp.categories.forEach((c: string) => cats.add(c));
      } else if (exp.category) {
        cats.add(exp.category);
      }
    });
    return Array.from(cats).sort();
  }, [experiences]);

  const allLocations = useMemo(() => {
    const locs = new Set<string>();
    experiences.forEach((exp) => {
      const city = exp.location?.city || exp.location?.name || "";
      const state = exp.location?.state || "";
      if (city && state) {
        locs.add(`${city}, ${state}`);
      } else if (city) {
        locs.add(city);
      } else if (state) {
        locs.add(state);
      }
    });
    return Array.from(locs).sort();
  }, [experiences]);

  const filteredList = useMemo(() => {
    return experiences.filter((exp) => {
      const title = (exp.title || "").toLowerCase();
      const city = (
        exp.location?.city ||
        exp.location?.name ||
        ""
      ).toLowerCase();
      const state = (exp.location?.state || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q || title.includes(q) || city.includes(q) || state.includes(q);

      const status = (exp.status || "active").toLowerCase();
      let matchesStatus = true;
      if (selectedStatus === "active")
        matchesStatus = status === "active" && !exp.isHidden;
      else if (selectedStatus === "pending")
        matchesStatus =
          status === "pending" ||
          exp.deleteRequested ||
          exp.hideRequested ||
          exp.unhideRequested;
      else if (selectedStatus === "hidden") matchesStatus = Boolean(exp.isHidden);

      const expCats = Array.isArray(exp.categories)
        ? exp.categories
        : [exp.category].filter(Boolean);
      const matchesCat =
        selectedCategory === "all" || expCats.includes(selectedCategory);

      const fullLoc = city && state ? `${city}, ${state}` : city || state || "";
      const matchesLoc =
        selectedLocation === "all" ||
        fullLoc.toLowerCase() === selectedLocation.toLowerCase() ||
        city.toLowerCase() === selectedLocation.toLowerCase() ||
        state.toLowerCase() === selectedLocation.toLowerCase();

      return matchesSearch && matchesStatus && matchesCat && matchesLoc;
    });
  }, [
    experiences,
    searchQuery,
    selectedStatus,
    selectedCategory,
    selectedLocation,
  ]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((exp) => exp._id || exp.id));
    }
  };

  const openHideModal = (ids: string[], action: "hide" | "unhide") => {
    setHideModalData({ ids, action });
    setHideReasonText("");
  };

  const submitHideRequest = async () => {
    if (!hideModalData) return;
    if (hideModalData.action === "hide" && !hideReasonText.trim()) return;

    setIsSubmittingHide(true);
    try {
      const results = await Promise.allSettled(
        hideModalData.ids.map((id) =>
          apiClient.patch(`/api/services/${id}/hide`, {
            reason:
              hideModalData.action === "unhide"
                ? "unhide"
                : hideReasonText.trim(),
          })
        )
      );

      const successfulCount = results.filter(
        (r) => r.status === "fulfilled" && r.value?.data?.success
      ).length;

      if (successfulCount > 0) {
        const toastMsg =
          hideModalData.action === "unhide"
            ? `${successfulCount} experience unhidden successfully`
            : `${successfulCount} experience hide request submitted for admin review`;

        showToast(toastMsg, "success");
        setHideModalData(null);
        setHideReasonText("");
        setSelectedIds([]);
        onRefresh?.();
      } else {
        showToast("Failed to process request", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Error submitting request", "error");
    } finally {
      setIsSubmittingHide(false);
    }
  };

  const handleDelete = (exp: any) => {
    const id = exp._id || exp.id;
    showConfirm(
      "Delete Experience",
      "Are you sure you want to delete this experience? It will be submitted to the admin team for review before permanent deletion.",
      async () => {
        setDeletingId(id);
        try {
          const res = await deleteService(id);
          if (res?.success) {
            showToast("Deletion request submitted for admin review", "success");
            onRefresh?.();
          } else {
            showToast(res?.message || "Failed to delete experience", "error");
          }
        } catch (err: any) {
          showToast(err?.message || "Error deleting experience", "error");
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    showConfirm(
      "Delete Selected Experiences",
      `Are you sure you want to delete these ${count} selected ${
        count === 1 ? "experience" : "experiences"
      }? They will be submitted to the admin panel for review before permanent deletion.`,
      async () => {
        setIsBulkDeleting(true);
        try {
          const results = await Promise.allSettled(
            selectedIds.map((id) => deleteService(id))
          );

          const successfulCount = results.filter(
            (r) => r.status === "fulfilled" && r.value?.success
          ).length;

          if (successfulCount > 0) {
            showToast(
              `${successfulCount} experience deletion ${
                successfulCount === 1 ? "request" : "requests"
              } submitted for admin review`,
              "success"
            );
            setSelectedIds([]);
            onRefresh?.();
          } else {
            showToast("Failed to submit deletion requests", "error");
          }
        } catch (err: any) {
          showToast(err?.message || "Error processing bulk deletion", "error");
        } finally {
          setIsBulkDeleting(false);
        }
      }
    );
  };

  const formatPrice = (exp: any) => {
    const price =
      exp.price?.perPerson ??
      exp.price?.amount ??
      exp.price?.basePrice ??
      exp.price ??
      0;
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const getThumbnail = (exp: any) => {
    if (exp.photos && exp.photos.length > 0) {
      return typeof exp.photos[0] === "string"
        ? exp.photos[0]
        : exp.photos[0]?.url;
    }
    if (exp.coverImage) return exp.coverImage;
    if (exp.image) return exp.image;
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80";
  };

  const getRatingValue = (exp: any) => {
    if (!exp) return "New";
    let r = exp.rating;
    if (r && typeof r === "object") {
      r = r.average ?? r.rate ?? r.score;
    }
    const val = Number(r);
    if (!isNaN(val) && val > 0) {
      return val.toFixed(1);
    }
    return "New";
  };

  const getReviewCount = (exp: any) => {
    if (!exp) return 0;
    if (typeof exp.reviewCount === "number") return exp.reviewCount;
    if (
      exp.rating &&
      typeof exp.rating === "object" &&
      typeof exp.rating.count === "number"
    ) {
      return exp.rating.count;
    }
    return 0;
  };

  return (
    <div className="w-full space-y-4">
      {/* ── Table Header Toolbar (Search & Dropdown Filters) ── */}
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4"
        style={
          isThemed
            ? { background: "transparent", borderColor: "rgba(255,255,255,0.14)" }
            : undefined
        }
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <FiSearch
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
              style={
                isThemed ? { color: "rgba(255,255,255,0.5)" } : undefined
              }
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experience by title, location..."
              className="w-full pl-11 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 rounded-2xl text-xs font-bold text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#C59A2F] transition-all"
              style={
                isThemed
                  ? {
                      background: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.15)",
                      color: "#ffffff",
                    }
                  : undefined
              }
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                style={
                  isThemed ? { color: "rgba(255,255,255,0.6)" } : undefined
                }
              >
                <FiX size={15} />
              </button>
            )}
          </div>

          {/* Action Buttons: View Toggle & Add New Experience */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-700/60 shrink-0"
              style={
                isThemed
                  ? {
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.15)",
                    }
                  : undefined
              }
            >
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-neutral-900 text-[#C59A2F] shadow-xs"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
                style={
                  isThemed && viewMode !== "table"
                    ? { color: "rgba(255,255,255,0.5)" }
                    : undefined
                }
                title="Table View"
              >
                <FiList size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-white dark:bg-neutral-900 text-[#C59A2F] shadow-xs"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
                style={
                  isThemed && viewMode !== "cards"
                    ? { color: "rgba(255,255,255,0.5)" }
                    : undefined
                }
                title="Cards View"
              >
                <FiGrid size={16} />
              </button>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (
                  user?.role === "host" &&
                  user?.hostStatus !== "approved"
                ) {
                  setShowHostStatusModal(true);
                } else {
                  router.push("/post?type=service");
                }
              }}
              className="px-5 py-2.5 rounded-2xl text-white dark:text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer shrink-0"
              style={{ background: GOLD }}
            >
              <FiPlus size={16} />
              <span>Add Experience</span>
            </motion.button>
          </div>
        </div>

        {/* ── Dropdown Filters Bar (Category & Location Dropdowns) ── */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-2">
            <label
              className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 shrink-0"
              style={
                isThemed ? { color: "rgba(255,255,255,0.75)" } : undefined
              }
            >
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#C59A2F]"
              style={
                isThemed
                  ? {
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "#ffffff",
                    }
                  : undefined
              }
            >
              <option value="all" className="text-neutral-900">
                All Categories
              </option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat} className="text-neutral-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 shrink-0"
              style={
                isThemed ? { color: "rgba(255,255,255,0.75)" } : undefined
              }
            >
              Location:
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#C59A2F]"
              style={
                isThemed
                  ? {
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "#ffffff",
                    }
                  : undefined
              }
            >
              <option value="all" className="text-neutral-900">
                All Locations ({allLocations.length})
              </option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc} className="text-neutral-900">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 shrink-0"
              style={
                isThemed ? { color: "rgba(255,255,255,0.75)" } : undefined
              }
            >
              Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#C59A2F]"
              style={
                isThemed
                  ? {
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "#ffffff",
                    }
                  : undefined
              }
            >
              <option value="all" className="text-neutral-900">
                All Statuses
              </option>
              <option value="active" className="text-neutral-900">
                Active
              </option>
              <option value="pending" className="text-neutral-900">
                Pending
              </option>
              <option value="hidden" className="text-neutral-900">
                Hidden
              </option>
            </select>
          </div>

          {(selectedCategory !== "all" ||
            selectedLocation !== "all" ||
            selectedStatus !== "all" ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedLocation("all");
                setSelectedStatus("all");
                setSearchQuery("");
              }}
              className="text-[11px] font-black uppercase tracking-wider text-[#C59A2F] hover:underline ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ── Bulk Actions Banner ── */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 px-5 rounded-2xl bg-amber-50 dark:bg-[#C59A2F]/10 border border-[#C59A2F]/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C59A2F] animate-pulse" />
                  <span className="text-xs font-black text-neutral-800 dark:text-neutral-200">
                    {selectedIds.length} experience
                    {selectedIds.length > 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="text-xs font-bold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    Deselect All
                  </button>
                  <button
                    type="button"
                    onClick={() => openHideModal(selectedIds, "hide")}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <FiEyeOff size={14} />
                    <span>Hide Selected Experience</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    disabled={isBulkDeleting}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FiTrash2 size={14} />
                    <span>
                      {isBulkDeleting
                        ? "Submitting..."
                        : `Delete Selected Experience (${selectedIds.length})`}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {viewMode === "cards" ? (
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse"
                />
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div
              className="py-16 text-center bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl"
              style={
                isThemed
                  ? {
                      background: "rgba(255,255,255,0.03)",
                      borderColor: theme?.divider || "rgba(255,255,255,0.1)",
                    }
                  : undefined
              }
            >
              <div
                className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400 dark:text-neutral-500"
                style={
                  isThemed
                    ? {
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.6)",
                      }
                    : undefined
                }
              >
                <FiGrid size={22} />
              </div>
              <p
                className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2"
                style={
                  isThemed ? { color: "rgba(255,255,255,0.7)" } : undefined
                }
              >
                No experiences found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredList.map((exp, i) => (
                <motion.div
                  key={exp._id || i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ExperienceCard
                    data={{
                      ...exp,
                      user:
                        typeof exp.user === "object" &&
                        exp.user !== null &&
                        (exp.user.firstname || exp.user.name)
                          ? exp.user
                          : user,
                    }}
                    className="w-full !h-auto"
                    showActions={true}
                    onDeleteSuccess={onRefresh}
                    isThemed={isThemed}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-sm overflow-hidden"
          style={
            isThemed
              ? {
                  background: "transparent",
                  borderColor: "rgba(255,255,255,0.14)",
                }
              : undefined
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr
                  className="bg-neutral-50/80 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-400 select-none"
                  style={
                    isThemed
                      ? {
                          background: "transparent",
                          borderColor: "rgba(255,255,255,0.14)",
                          color: "#ffffff",
                        }
                      : undefined
                  }
                >
                  <th className="py-4 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredList.length > 0 &&
                        selectedIds.length === filteredList.length
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-neutral-300 text-[#C59A2F] focus:ring-[#C59A2F]/20 cursor-pointer"
                      title="Select All"
                    />
                  </th>
                  <th className="py-4 px-5">Experience</th>
                  <th className="py-4 px-5">Pricing</th>
                  <th className="py-4 px-5">Rating & Bookings</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="w-7 h-7 border-2 border-[#C59A2F]/30 border-t-[#C59A2F] rounded-full animate-spin mx-auto mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                        Loading experiences...
                      </span>
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div
                        className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400 dark:text-neutral-500"
                        style={
                          isThemed
                            ? {
                                background: "rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.6)",
                              }
                            : undefined
                        }
                      >
                        <FiGrid size={22} />
                      </div>
                      <p
                        className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2"
                        style={
                          isThemed
                            ? { color: "rgba(255,255,255,0.7)" }
                            : undefined
                        }
                      >
                        No experiences found
                      </p>
                      {(searchQuery ||
                        selectedStatus !== "all" ||
                        selectedCategory !== "all" ||
                        selectedLocation !== "all") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedStatus("all");
                            setSelectedCategory("all");
                            setSelectedLocation("all");
                          }}
                          className="text-xs font-bold text-[#C59A2F] hover:underline cursor-pointer"
                        >
                          Reset filters & search
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((exp) => {
                    const id = exp._id || exp.id;
                    const thumb = getThumbnail(exp);
                    const isDeleting = deletingId === id;
                    const status = (exp.status || "active").toLowerCase();
                    const categories = Array.isArray(exp.categories)
                      ? exp.categories
                      : [exp.category].filter(Boolean);
                    const isSelected = selectedIds.includes(id);
                    const isPendingReview = Boolean(
                      exp.deleteRequested ||
                        exp.hideRequested ||
                        exp.unhideRequested
                    );

                    return (
                      <tr
                        key={id}
                        className={`${
                          isSelected
                            ? "bg-amber-500/5 dark:bg-[#C59A2F]/10"
                            : "hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40"
                        } transition-colors group`}
                      >
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(id)}
                            className="w-4 h-4 rounded border-neutral-300 text-[#C59A2F] focus:ring-[#C59A2F]/20 cursor-pointer"
                          />
                        </td>

                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-100 dark:border-neutral-800 shadow-xs relative">
                              <img
                                src={thumb}
                                alt={exp.title}
                                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                  exp.isHidden ? "opacity-60 grayscale" : ""
                                }`}
                                loading="lazy"
                              />
                              {exp.isHidden && (
                                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                                  <FiEyeOff size={14} />
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 max-w-xs">
                              <h4
                                className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm line-clamp-1 group-hover:text-[#C59A2F] transition-colors"
                                style={
                                  isThemed ? { color: "#ffffff" } : undefined
                                }
                              >
                                {exp.title}
                              </h4>
                              <div
                                className="flex items-center gap-2 text-[10px] text-neutral-400 dark:text-neutral-400 font-medium"
                                style={
                                  isThemed
                                    ? { color: "rgba(255,255,255,0.7)" }
                                    : undefined
                                }
                              >
                                <span className="flex items-center gap-1">
                                  <FiMapPin
                                    size={11}
                                    className="text-[#C59A2F]"
                                  />
                                  {exp.location?.city ||
                                    exp.location?.name ||
                                    "Uttarakhand"}
                                  {exp.location?.state
                                    ? `, ${exp.location.state}`
                                    : ""}
                                </span>
                              </div>
                              {categories.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                  {categories.map((c: string) => (
                                    <span
                                      key={c}
                                      className="px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-[#C59A2F]/10 text-[#C59A2F] text-[9px] font-bold border border-amber-200/40 dark:border-[#C59A2F]/20 uppercase"
                                    >
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-[#C59A2F]">
                              {formatPrice(exp)}
                            </span>
                            <span
                              className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500"
                              style={
                                isThemed
                                  ? { color: "rgba(255,255,255,0.6)" }
                                  : undefined
                              }
                            >
                              per person
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="flex flex-col gap-1">
                            <div
                              className="flex items-center gap-1 text-xs font-bold text-neutral-800 dark:text-neutral-200"
                              style={
                                isThemed ? { color: "#ffffff" } : undefined
                              }
                            >
                              <FaStar size={12} className="text-amber-400" />
                              <span>{getRatingValue(exp)}</span>
                              {getReviewCount(exp) > 0 && (
                                <span className="text-neutral-400 text-[10px]">
                                  ({getReviewCount(exp)})
                                </span>
                              )}
                            </div>
                            <span
                              className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500"
                              style={
                                isThemed
                                  ? { color: "rgba(255,255,255,0.7)" }
                                  : undefined
                              }
                            >
                              {exp.bookingCount || 0} Bookings
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          {exp.deleteRequested ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40">
                              <FiClock size={10} />
                              Pending Delete Review
                            </span>
                          ) : exp.hideRequested ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40">
                              <FiClock size={10} />
                              Pending Hide Review
                            </span>
                          ) : exp.unhideRequested ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40">
                              <FiClock size={10} />
                              Pending Unhide Review
                            </span>
                          ) : exp.isHidden ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-neutral-100 text-neutral-600 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700">
                              <FiEyeOff size={10} />
                              Hidden
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                status === "active"
                                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/40"
                                  : status === "pending"
                                  ? "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/40"
                                  : "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40"
                              }`}
                            >
                              {status === "active" && (
                                <FiCheckCircle size={10} />
                              )}
                              {status === "pending" && <FiClock size={10} />}
                              {status !== "active" && status !== "pending" && (
                                <FiAlertTriangle size={10} />
                              )}
                              {status}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => router.push(`/post/${id}`)}
                              className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-[#C59A2F] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                              title="View Experience"
                            >
                              <FiExternalLink size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/post?edit=${id}&type=${
                                    exp.postType || "service"
                                  }`
                                )
                              }
                              className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all cursor-pointer"
                              title="Edit Experience"
                            >
                              <FiEdit2 size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openHideModal(
                                  [id],
                                  exp.isHidden ? "unhide" : "hide"
                                )
                              }
                              disabled={isPendingReview}
                              className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title={
                                isPendingReview
                                  ? "Request pending admin review"
                                  : exp.isHidden
                                  ? "Unhide Experience"
                                  : "Hide Experience"
                              }
                            >
                              {exp.isHidden ? (
                                <FiEye size={16} />
                              ) : (
                                <FiEyeOff size={16} />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(exp)}
                              disabled={isDeleting || isPendingReview}
                              className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title={
                                isPendingReview
                                  ? "Request pending admin review"
                                  : "Delete Experience"
                              }
                            >
                              {isDeleting ? (
                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FiTrash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {pagination?.totalPages > 1 && (
            <div
              className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4"
              style={
                isThemed
                  ? {
                      borderColor:
                        theme?.divider || "rgba(255,255,255,0.1)",
                    }
                  : undefined
              }
            >
              <span
                className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500"
                style={
                  isThemed ? { color: "rgba(255,255,255,0.7)" } : undefined
                }
              >
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onPageChange?.(i + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      pagination.currentPage === i + 1
                        ? "bg-[#C59A2F] text-white shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Hide / Unhide Reason Modal ── */}
      <AnimatePresence>
        {hideModalData && (
          <div className="fixed inset-0 z-[80000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHideModalData(null)}
              className={`absolute inset-0 ${
                isThemed
                  ? "bg-black/35 backdrop-blur-sm"
                  : "bg-black/60 backdrop-blur-sm"
              }`}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className={`relative z-10 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 text-left transition-colors ${
                isThemed
                  ? ""
                  : "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-2xl"
              }`}
              style={
                isThemed
                  ? {
                      background: "rgba(18,18,22,0.88)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.22)",
                      boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
                    }
                  : undefined
              }
            >
              <div
                className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4"
                style={
                  isThemed
                    ? { borderBottomColor: "rgba(255, 255, 255, 0.12)" }
                    : undefined
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-[#C59A2F] flex items-center justify-center shrink-0">
                    {hideModalData.action === "hide" ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </div>
                  <div>
                    <h3
                      className="text-base font-black text-neutral-900 dark:text-neutral-100 capitalize"
                      style={isThemed ? { color: "#ffffff" } : undefined}
                    >
                      {hideModalData.action === "hide"
                        ? "Hide Experience"
                        : "Unhide Experience"}
                    </h3>
                    <p
                      className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500"
                      style={
                        isThemed
                          ? { color: "rgba(255, 255, 255, 0.70)" }
                          : undefined
                      }
                    >
                      {hideModalData.action === "hide"
                        ? "Submit request for admin review"
                        : "Unhide experience immediately on platform"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHideModalData(null)}
                  className={`transition-colors cursor-pointer ${
                    isThemed
                      ? "text-white hover:opacity-80"
                      : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  }`}
                >
                  <FiX size={18} />
                </button>
              </div>

              <p
                className="text-xs text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed"
                style={
                  isThemed ? { color: "rgba(255, 255, 255, 0.88)" } : undefined
                }
              >
                Are you sure you want to {hideModalData.action}{" "}
                {hideModalData.ids.length === 1
                  ? "this experience"
                  : `these ${hideModalData.ids.length} selected experiences`}{" "}
                {hideModalData.action === "hide"
                  ? "from the platform? Your request will be sent to the admin team for approval."
                  : "on the platform? It will immediately become active again."}
              </p>

              {hideModalData.action === "hide" && (
                <div className="space-y-2">
                  <label
                    className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block"
                    style={isThemed ? { color: "#ffffff" } : undefined}
                  >
                    Mention your reason to hide the experience{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={hideReasonText}
                    onChange={(e) => setHideReasonText(e.target.value)}
                    placeholder="Mention your reason to hide the experience..."
                    className="w-full p-3.5 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-xs font-bold text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#C59A2F] transition-all resize-none"
                    style={
                      isThemed
                        ? {
                            background: "transparent",
                            borderColor: "rgba(255, 255, 255, 0.22)",
                            color: "#ffffff",
                          }
                        : undefined
                    }
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setHideModalData(null)}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isThemed
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  No, Cancel
                </button>

                <button
                  type="button"
                  onClick={submitHideRequest}
                  disabled={
                    (hideModalData.action === "hide" &&
                      !hideReasonText.trim()) ||
                    isSubmittingHide
                  }
                  className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                    (hideModalData.action === "hide" &&
                      !hideReasonText.trim()) ||
                    isSubmittingHide
                      ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 opacity-40 cursor-not-allowed border border-neutral-300 dark:border-neutral-700"
                      : "bg-[#C59A2F] text-white hover:bg-[#B48928] cursor-pointer"
                  }`}
                >
                  {isSubmittingHide ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : hideModalData.action === "unhide" ? (
                    "Yes, Unhide"
                  ) : (
                    "Yes, Submit"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

