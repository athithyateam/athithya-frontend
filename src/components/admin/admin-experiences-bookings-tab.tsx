"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiTrash2,
  FiExternalLink,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import {
  getAdminExperiencesApi,
  updateAdminExperienceApi,
  deleteAdminExperienceApi,
  getAdminBookingsApi,
  updateAdminBookingApi,
  deleteAdminBookingApi,
} from "@/lib/api/admin-api";
import { useFeedbackStore } from "@/stores/feedback-store";
import { EditExperienceModal } from "./modals/edit-experience-modal";

interface AdminExperiencesBookingsTabProps {
  mode: "experiences" | "bookings" | "journeys";
}

export function AdminExperiencesBookingsTab({ mode }: AdminExperiencesBookingsTabProps) {
  const { showToast, showConfirm } = useFeedbackStore();
  const [search, setSearch] = useState("");
  const [experiences, setExperiences] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Experience sub-tabs & selection
  const [expMainTab, setExpMainTab] = useState<"all" | "category" | "host">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expPage, setExpPage] = useState(1);
  const [expTotalPages, setExpTotalPages] = useState(1);
  const [editExp, setEditExp] = useState<any>(null);

  // Journey sub-tab
  const [journeyTab, setJourneyTab] = useState<"active" | "upcoming" | "completed" | "all">("active");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (mode === "experiences") {
        const res = await getAdminExperiencesApi({
          page: expPage,
          limit: 10,
          search,
        });
        const list = res?.experiences || res?.posts || res?.data?.experiences || (Array.isArray(res) ? res : []);
        setExperiences(list);
        setExpTotalPages(res?.totalPages || 1);
      } else {
        const res = await getAdminBookingsApi({ search, limit: 50 });
        const list = res?.bookings || res?.data?.bookings || (Array.isArray(res) ? res : []);
        setBookings(list);
      }
    } catch {
      setExperiences([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [mode, search, expPage]);

  useEffect(() => {
    const t = setTimeout(loadData, 250);
    return () => clearTimeout(t);
  }, [loadData]);

  const handleToggleFeatured = async (exp: any) => {
    const id = exp._id || exp.id;
    const isFeatured = !exp.isFeatured;
    try {
      await updateAdminExperienceApi(id, { isFeatured });
      showToast(`Experience ${isFeatured ? "featured" : "unfeatured"}!`, "success");
      loadData();
    } catch {
      showToast("Failed to update featured status", "error");
    }
  };

  const handleSaveExp = async (updatedData: any) => {
    if (!editExp) return;
    const id = editExp._id || editExp.id;
    try {
      const res = await updateAdminExperienceApi(id, updatedData);
      if (res?.success === false) {
        showToast(res?.message || "Failed to update experience", "error");
        return;
      }
      showToast("Experience updated successfully", "success");
      await loadData();
    } catch (err: any) {
      showToast(err?.message || "Failed to update experience", "error");
    }
  };

  const handleDeleteExp = (id: string) => {
    showConfirm(
      "Delete Experience",
      "Are you sure you want to delete this experience?",
      async () => {
        try {
          await deleteAdminExperienceApi(id);
          showToast("Experience deleted", "success");
          loadData();
        } catch {
          showToast("Could not delete experience", "error");
        }
      }
    );
  };

  const handleDeleteBooking = (id: string) => {
    showConfirm(
      "Delete Booking",
      "Are you sure you want to delete this booking?",
      async () => {
        try {
          await deleteAdminBookingApi(id);
          showToast("Booking deleted", "success");
          loadData();
        } catch {
          showToast("Could not delete booking", "error");
        }
      }
    );
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await updateAdminBookingApi(id, { status });
      showToast(`Booking marked as ${status}`, "success");
      loadData();
    } catch {
      showToast("Could not update booking", "error");
    }
  };

  const toggleSelectAll = (items: any[]) => {
    if (selectedIds.length === items.length && items.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i._id || i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    showConfirm(
      "Delete Items",
      `Are you sure you want to delete ${count} items?`,
      async () => {
        try {
          if (mode === "experiences") {
            await Promise.all(selectedIds.map((id) => deleteAdminExperienceApi(id)));
          } else {
            await Promise.all(selectedIds.map((id) => deleteAdminBookingApi(id)));
          }
          showToast(`${count} items deleted`, "success");
          setSelectedIds([]);
          loadData();
        } catch {
          showToast("Failed to delete selected items", "error");
        }
      }
    );
  };

  const exportExperiencesToCSV = () => {
    const headers = ["ID", "Title", "Category", "Host", "Price", "City", "Status", "Featured"];
    const rows = experiences.map((e) => [
      e._id || e.id,
      e.title || "",
      e.category || e.postType || "",
      e.user?.firstname || "",
      e.price?.perPerson || e.price || 0,
      e.location?.city || "",
      e.status || "active",
      e.isFeatured ? "Yes" : "No",
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map((r) => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "athithya_experiences.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= 1. EXPERIENCES MODE =================
  if (mode === "experiences") {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-neutral-800 overflow-hidden transition-colors relative">
        <div className="p-8 border-b border-slate-50 dark:border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter transition-colors shrink-0">
                Experiences
                <span className="ml-2 text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                  ({experiences.length} shown)
                </span>
              </h2>
              <div className="flex gap-1.5 bg-slate-100/80 dark:bg-neutral-950 p-1.5 rounded-2xl w-fit border border-slate-200/50 dark:border-neutral-800 transition-colors">
                {(["all", "category", "host"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setExpMainTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                      expMainTab === tab
                        ? "bg-white dark:bg-neutral-850 text-[#C59A2F] shadow-md shadow-slate-200/30 dark:shadow-none"
                        : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    {tab === "all" ? "All" : tab === "category" ? "By Category" : "By Host"}
                  </button>
                ))}
              </div>
            </div>

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-100 dark:border-red-900/30 cursor-pointer"
              >
                <FiTrash2 size={14} />
                Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={exportExperiencesToCSV}
              style={{ backgroundColor: "#C59A2F" }}
              className="text-white font-black text-[10px] uppercase tracking-widest rounded-2xl px-5 py-3.5 hover:brightness-95 active:scale-[0.98] transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              📥 Export CSV
            </button>
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-neutral-600" />
              <input
                type="text"
                placeholder="Search experiences..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-6 py-3 bg-slate-50 dark:bg-neutral-950 rounded-2xl text-sm focus:outline-none focus:ring-2 ring-[#C59A2F]/20 border border-slate-100 dark:border-neutral-800 w-full text-slate-900 dark:text-neutral-100 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Experiences Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-neutral-950/40 transition-colors">
                <th className="px-6 py-5 text-left w-12">
                  <input
                    type="checkbox"
                    checked={experiences.length > 0 && selectedIds.length === experiences.length}
                    onChange={() => toggleSelectAll(experiences)}
                    className="w-4 h-4 rounded border-slate-300 text-[#C59A2F] focus:ring-[#C59A2F]/20 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                  Experience
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                  Host
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                  Price
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                  Featured
                </th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <div className="w-8 h-8 border-4 border-[#C59A2F] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                      Loading experiences...
                    </p>
                  </td>
                </tr>
              ) : experiences.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-xs text-slate-400 font-bold uppercase tracking-widest">
                    No experiences found
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => {
                  const id = exp._id || exp.id;
                  const coverPhoto = exp.photos?.[0]?.url || exp.coverImage?.url || exp.images?.[0] || "";

                  return (
                    <tr key={id} className="hover:bg-slate-50/30 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(id)}
                          onChange={() => toggleSelect(id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#C59A2F] cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-slate-100 dark:border-neutral-800">
                            {coverPhoto ? (
                              <img src={coverPhoto} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">🏔</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-neutral-100 text-sm">{exp.title}</p>
                            <p className="text-[10px] text-slate-400">{exp.location?.city || "Uttarakhand"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700 dark:text-neutral-300">
                        {exp.user?.firstname || exp.host?.firstname || "Host"}
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900 dark:text-neutral-100">
                        ₹{exp.price?.perPerson || exp.price || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            exp.status === "active" || exp.status === "approved"
                              ? "bg-green-50 text-green-600 dark:bg-green-900/20"
                              : "bg-amber-50 text-[#C59A2F] dark:bg-amber-950/20"
                          }`}
                        >
                          {exp.status || "active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(exp)}
                          className="p-1.5 hover:scale-110 transition cursor-pointer"
                          title={exp.isFeatured ? "Unfeature" : "Feature"}
                        >
                          {exp.isFeatured ? (
                            <FaStar size={16} className="text-[#C59A2F]" />
                          ) : (
                            <FiStar size={16} className="text-slate-300" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditExp(exp)}
                            className="p-2 text-slate-400 hover:text-[#C59A2F] rounded-lg transition cursor-pointer"
                            title="Edit Experience"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <Link
                            href={`/post/${id}`}
                            className="p-2 text-slate-400 hover:text-[#C59A2F] rounded-lg transition"
                            title="Preview Experience"
                          >
                            <FiExternalLink size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteExp(id)}
                            className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition cursor-pointer"
                            title="Delete Experience"
                          >
                            <FiTrash2 size={15} />
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

        {/* Edit Experience Modal */}
        {editExp && (
          <EditExperienceModal
            experience={editExp}
            onClose={() => setEditExp(null)}
            onSave={handleSaveExp}
          />
        )}
      </div>
    );
  }

  // ================= 2. JOURNEYS MODE (JourneyTracking.jsx) =================
  if (mode === "journeys") {
    const journeyList = bookings.filter((b) => {
      if (journeyTab === "upcoming") return b.status === "accepted";
      if (journeyTab === "active") return b.status === "in_progress";
      if (journeyTab === "completed") return b.status === "completed";
      return ["accepted", "in_progress", "completed", "confirmed", "started"].includes(b.status);
    });

    return (
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-neutral-800 overflow-hidden transition-colors relative">
        <div className="p-8 border-b border-slate-50 dark:border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
            <h2 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter shrink-0">
              Live Journeys
              <span className="ml-2 text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                ({journeyList.length} tracked)
              </span>
            </h2>
            <div className="flex gap-1.5 bg-slate-100/80 dark:bg-neutral-950 p-1.5 rounded-2xl w-fit border border-slate-200/50 dark:border-neutral-800 transition-colors">
              {[
                { id: "active" as const, label: "Active", icon: <FiActivity className="text-blue-500" /> },
                { id: "upcoming" as const, label: "Upcoming", icon: <FiClock className="text-amber-500" /> },
                { id: "completed" as const, label: "Completed", icon: <FiCheckCircle className="text-green-500" /> },
                { id: "all" as const, label: "All" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setJourneyTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer ${
                    journeyTab === tab.id
                      ? "bg-white dark:bg-neutral-850 text-[#C59A2F] shadow-md shadow-slate-200/30 dark:shadow-none"
                      : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search journeys..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-6 py-3 bg-slate-50 dark:bg-neutral-950 rounded-2xl text-sm focus:outline-none border border-slate-100 dark:border-neutral-800 w-full"
            />
          </div>
        </div>

        {/* Live Journeys Grid */}
        <div className="p-8">
          {journeyList.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400 font-bold uppercase tracking-widest">
              No live journeys under {journeyTab}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {journeyList.map((j) => {
                const id = j._id || j.id;
                return (
                  <div
                    key={id}
                    className="p-6 rounded-3xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#C59A2F]">
                        #{String(id).slice(-6)}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                          j.status === "in_progress"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                            : j.status === "completed"
                            ? "bg-green-50 text-green-600 dark:bg-green-900/20"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                        }`}
                      >
                        {j.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-neutral-100">
                        {j.post?.title || j.postTitle || "Experience"}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Guest: <strong>{j.guest?.firstname || "Guest"}</strong> • Host:{" "}
                        <strong>{j.host?.firstname || "Host"}</strong>
                      </p>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-800">
                      <span>Total: ₹{j.totalAmount || j.amount || 0}</span>
                      <span>{j.startDate ? new Date(j.startDate).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= 3. BOOKINGS MODE (BookingManagement.jsx) =================
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-neutral-800 overflow-hidden transition-colors relative">
      <div className="p-8 border-b border-slate-50 dark:border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter transition-colors">
            Booked Experiences
          </h2>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-100 dark:border-red-900/30 cursor-pointer"
            >
              <FiTrash2 size={14} />
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>

        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-6 py-3 bg-slate-50 dark:bg-neutral-950 rounded-2xl text-sm focus:outline-none border border-slate-100 dark:border-neutral-800 w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-neutral-950/40 border-b border-slate-100 dark:border-neutral-800">
              <th className="px-6 py-5 text-left w-12">
                <input
                  type="checkbox"
                  checked={bookings.length > 0 && selectedIds.length === bookings.length}
                  onChange={() => toggleSelectAll(bookings)}
                  className="w-4 h-4 rounded border-slate-300 text-[#C59A2F] cursor-pointer"
                />
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                Guest & Group
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                Experience
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                Date
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                Price
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                Status
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-neutral-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <div className="w-8 h-8 border-4 border-[#C59A2F] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                    Loading bookings...
                  </p>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const id = b._id || b.id;
                return (
                  <tr key={id} className="hover:bg-slate-50/30 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={() => toggleSelect(id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#C59A2F] cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#C59A2F]/15 text-[#C59A2F] font-bold text-xs flex items-center justify-center shrink-0">
                          {(b.guest?.firstname?.[0] || "G").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-neutral-100 text-sm">
                            {b.guest?.firstname} {b.guest?.lastname}
                          </p>
                          <p className="text-[10px] text-slate-400">{b.guest?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-xs font-bold text-slate-900 dark:text-neutral-100">
                      {b.post?.title || b.postTitle || "Experience"}
                    </td>
                    <td className="px-8 py-4 text-xs font-bold text-slate-500">
                      {b.startDate ? new Date(b.startDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-8 py-4 text-xs font-black text-slate-900 dark:text-neutral-100">
                      ₹{b.totalAmount || b.amount || 0}
                    </td>
                    <td className="px-8 py-4">
                      <select
                        value={b.status || "pending"}
                        onChange={(e) => handleUpdateBookingStatus(id, e.target.value)}
                        className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-neutral-700 bg-transparent cursor-pointer"
                      >
                        <option value="pending">pending</option>
                        <option value="accepted">accepted</option>
                        <option value="confirmed">confirmed</option>
                        <option value="in_progress">in_progress</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteBooking(id)}
                        className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition cursor-pointer"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Experience Modal */}
      {editExp && (
        <EditExperienceModal
          experience={editExp}
          onClose={() => setEditExp(null)}
          onSave={handleSaveExp}
        />
      )}
    </div>
  );
}
