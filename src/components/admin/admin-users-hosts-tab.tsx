"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiUser, FiActivity, FiTrash2, FiChevronLeft, FiChevronRight, FiCheck, FiEdit2 } from "react-icons/fi";
import {
  getAdminUsersApi,
  updateAdminUserRoleApi,
  updateAdminUserApi,
  deleteAdminUserApi,
  getAdminHostHistoryApi,
} from "@/lib/api/admin-api";
import { useFeedbackStore } from "@/stores/feedback-store";
import { EditUserModal } from "./modals/edit-user-modal";

interface AdminUsersHostsTabProps {
  mode?: "users" | "hosts";
}

export function AdminUsersHostsTab({ mode = "users" }: AdminUsersHostsTabProps) {
  const { showToast, showConfirm } = useFeedbackStore();

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [userCounts, setUserCounts] = useState({ allCount: 0, guestsCount: 0, hostsCount: 0 });
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "hosts" | "guests">("all");
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [usersLoading, setUsersLoading] = useState(true);
  const [editUser, setEditUser] = useState<any>(null);

  // Host History / Old Data state
  const [hostHistory, setHostHistory] = useState<any[]>([]);
  const [historySubTab, setHistorySubTab] = useState<"details" | "experiences">("details");
  const [historyLoading, setHistoryLoading] = useState(false);

  // Load Users data
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await getAdminUsersApi({
        page: userPage,
        limit: 10,
        search: userSearch,
        role: userRoleFilter,
      });
      const data = res?.users ? res : res?.data || {};
      setUsers(data.users || (Array.isArray(res) ? res : []));
      setUserTotalPages(data.totalPages || 1);
      setUserCounts({
        allCount: data.allCount || data.totalUsers || (data.users ? data.users.length : 0),
        guestsCount: data.guestsCount || 0,
        hostsCount: data.hostsCount || 0,
      });
    } catch {
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, [userPage, userSearch, userRoleFilter]);

  // Load Host History data
  const loadHostHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await getAdminHostHistoryApi();
      const list = res?.data || res?.history || res?.hosts || (Array.isArray(res) ? res : []);
      setHostHistory(list);
    } catch {
      setHostHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === "hosts") {
      loadHostHistory();
    } else {
      const t = setTimeout(loadUsers, 250);
      return () => clearTimeout(t);
    }
  }, [mode, loadUsers, loadHostHistory]);

  const handleRoleChange = async (id: string, newRole: "guest" | "host" | "admin") => {
    try {
      await updateAdminUserRoleApi(id, newRole);
      showToast(`User role updated to ${newRole}`, "success");
      loadUsers();
    } catch {
      showToast("Failed to update user role", "error");
    }
  };

  const handleSaveUser = async (updatedData: any) => {
    if (!editUser) return;
    const id = editUser._id || editUser.id;
    try {
      const res = await updateAdminUserApi(id, updatedData);
      if (res?.success === false) {
        showToast(res?.message || "Failed to update user details", "error");
        return;
      }
      showToast("User details updated successfully", "success");
      await loadUsers();
    } catch (err: any) {
      showToast(err?.message || "Failed to update user details", "error");
    }
  };

  const handleDeleteUser = (id: string) => {
    showConfirm(
      "Delete User",
      "Are you sure you want to delete this user?",
      async () => {
        try {
          await deleteAdminUserApi(id);
          showToast("User deleted successfully", "success");
          loadUsers();
        } catch {
          showToast("Failed to delete user", "error");
        }
      }
    );
  };

  const exportUsersToCSV = () => {
    const headers = ["User ID", "First Name", "Last Name", "Email", "Role", "Host Status", "Created At"];
    const rows = users.map((u) => [
      u._id || u.id,
      u.firstname || "",
      u.lastname || "",
      u.email || "",
      u.role || "guest",
      u.hostStatus || "none",
      u.createdAt || "",
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `athithya_users_${userRoleFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= HOST HISTORY AUDIT LOGS MODE =================
  if (mode === "hosts") {
    const profileUpdates = hostHistory.filter((log) => log.type === "profile_update" || !log.type);
    const experienceDeletions = hostHistory.filter((log) => log.type === "experience_delete");

    return (
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-neutral-800 overflow-hidden transition-colors">
        <div className="p-8 border-b border-slate-50 dark:border-neutral-800 flex flex-col gap-6 transition-colors">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter transition-colors">
              Host Audit Logs
            </h2>
            <div className="text-[11px] font-semibold text-[#C59A2F] bg-[#FFF9EC]/80 dark:bg-neutral-800/30 border border-yellow-100/30 dark:border-neutral-800/50 rounded-xl p-4 leading-relaxed transition-colors flex items-start gap-2.5">
              <span className="text-sm">ℹ️</span>
              <span>
                <strong>Audit Log Note:</strong> This tab stores historical records of host details, preserving only the last 10 records of updated or deleted activities.
              </span>
            </div>
          </div>

          {/* Sub-tabs toggler */}
          <div className="flex gap-1.5 bg-slate-100/80 dark:bg-neutral-950 p-1.5 rounded-2xl w-fit border border-slate-200/50 dark:border-neutral-800 transition-colors">
            <button
              type="button"
              onClick={() => setHistorySubTab("details")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${
                historySubTab === "details"
                  ? "bg-white dark:bg-neutral-850 text-[#C59A2F] shadow-md shadow-slate-200/30 dark:shadow-none"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
              }`}
            >
              <FiUser size={13} />
              Host Details History ({profileUpdates.length})
            </button>
            <button
              type="button"
              onClick={() => setHistorySubTab("experiences")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${
                historySubTab === "experiences"
                  ? "bg-white dark:bg-neutral-850 text-[#C59A2F] shadow-md shadow-slate-200/30 dark:shadow-none"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
              }`}
            >
              <FiActivity size={13} />
              Deleted Experiences ({experienceDeletions.length})
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          {historyLoading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-[#C59A2F] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mt-2">
                Loading audit logs...
              </p>
            </div>
          ) : (historySubTab === "details" ? profileUpdates : experienceDeletions).length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-widest">
              No audit logs recorded
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/40">
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                    Host Info
                  </th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                    Action Type
                  </th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                    Changes / Details
                  </th>
                  <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-neutral-800 text-xs">
                {(historySubTab === "details" ? profileUpdates : experienceDeletions).map((log, i) => (
                  <tr key={log._id || i} className="hover:bg-slate-50/30 dark:hover:bg-neutral-800/30">
                    <td className="px-8 py-4 font-bold text-slate-900 dark:text-neutral-100">
                      {log.hostName || log.firstname ? `${log.firstname || ""} ${log.lastname || ""}` : log.userId || "Host"}
                      <p className="text-[10px] text-slate-400 font-normal">{log.email || ""}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-[#C59A2F] border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/40">
                        {log.type || "update"}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-slate-600 dark:text-neutral-400">
                      {log.details || log.reason || JSON.stringify(log.changes || log.data || "Host profile audit entry")}
                    </td>
                    <td className="px-8 py-4 text-right text-slate-400">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // ================= USERS MANAGEMENT MODE =================
  const allCount = userCounts.allCount || 0;
  const guestsCount = userCounts.guestsCount || 0;
  const hostsCount = userCounts.hostsCount || 0;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-neutral-800 overflow-hidden transition-colors">
      {/* Header matching athithya-app UserManagement.jsx */}
      <div className="p-8 border-b border-slate-50 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter transition-colors">
            Registered Users
          </h2>
          <div className="flex gap-1.5 bg-slate-100/80 dark:bg-neutral-950 p-1.5 rounded-2xl w-fit border border-slate-200/50 dark:border-neutral-800 transition-colors">
            <button
              type="button"
              onClick={() => {
                setUserRoleFilter("all");
                setUserPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                userRoleFilter === "all"
                  ? "bg-white dark:bg-neutral-850 text-[#C59A2F] shadow-md shadow-slate-200/30 dark:shadow-none"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
              }`}
            >
              All ({allCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setUserRoleFilter("hosts");
                setUserPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                userRoleFilter === "hosts"
                  ? "bg-white dark:bg-neutral-850 text-[#C59A2F] shadow-md shadow-slate-200/30 dark:shadow-none"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
              }`}
            >
              Hosts ({hostsCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setUserRoleFilter("guests");
                setUserPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                userRoleFilter === "guests"
                  ? "bg-white dark:bg-neutral-850 text-[#C59A2F] shadow-md shadow-slate-200/30 dark:shadow-none"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
              }`}
            >
              Guests ({guestsCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={exportUsersToCSV}
            style={{ backgroundColor: "#C59A2F" }}
            className="text-white font-black text-[10px] uppercase tracking-widest rounded-2xl px-5 py-3.5 hover:brightness-95 active:scale-[0.98] transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            📥 Export CSV
          </button>
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-neutral-600" />
            <input
              type="text"
              placeholder={`Search ${userRoleFilter}...`}
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setUserPage(1);
              }}
              className="pl-10 pr-6 py-3 bg-slate-50 dark:bg-neutral-950 rounded-2xl text-sm focus:outline-none focus:ring-2 ring-[#C59A2F]/20 border border-slate-100 dark:border-neutral-800 w-full text-slate-900 dark:text-neutral-100 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Users Datatable matching athithya-app */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-neutral-950/40 transition-colors">
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                User Info
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                {userRoleFilter === "hosts" ? "Host Status" : "Role"}
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                Joined
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-neutral-800 transition-colors">
            {usersLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-16">
                  <div className="w-8 h-8 border-4 border-[#C59A2F] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mt-2">
                    Loading users...
                  </p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-16 text-xs text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-widest transition-colors"
                >
                  No {userRoleFilter} found
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const id = u._id || u.id;
                return (
                  <tr
                    key={id}
                    className="hover:bg-slate-50/30 dark:hover:bg-neutral-800/30 transition-colors group border-b border-slate-50 dark:border-neutral-800 last:border-0"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-neutral-700 shadow-sm ring-1 ring-slate-100 dark:ring-neutral-800 transition-colors bg-neutral-100 shrink-0">
                          <img
                            src={
                              u.avatar?.url ||
                              `https://ui-avatars.com/api/?background=C59A2F&color=fff&name=${encodeURIComponent(
                                u.firstname || "User"
                              )}`
                            }
                            className="w-full h-full object-cover"
                            alt=""
                            loading="lazy"
                            onError={(e: any) => {
                              e.target.src = `https://ui-avatars.com/api/?background=C59A2F&color=fff&name=${encodeURIComponent(
                                u.firstname || "User"
                              )}`;
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 dark:text-neutral-100 group-hover:text-[#C59A2F] transition-colors">
                              {u.firstname} {u.lastname}
                            </p>
                            {(u.role === "host" || userRoleFilter === "hosts") && (
                              <span
                                className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border transition-colors ${
                                  Number(u.hostDetails?.yearsOfExperience || 0) > 0
                                    ? "bg-amber-50 dark:bg-amber-950/40 text-[#C59A2F] border-[#C59A2F]/30"
                                    : "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-700"
                                }`}
                              >
                                {u.hostDetails?.yearsOfExperience || 0} yrs exp
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-tight transition-colors">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-4">
                      {userRoleFilter === "hosts" ? (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                            u.hostStatus === "approved"
                              ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-900/40"
                              : u.hostStatus === "pending_approval" || u.hostStatus === "pending_verification"
                              ? "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-900/40"
                              : "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/40"
                          }`}
                        >
                          {u.hostStatus?.replace("_", " ") || "none"}
                        </span>
                      ) : (
                        <select
                          value={u.role || "guest"}
                          onChange={(e) => handleRoleChange(id, e.target.value as any)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border cursor-pointer transition-all ${
                            u.role === "admin"
                              ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/40"
                              : u.role === "host"
                              ? "bg-amber-50 text-[#C59A2F] border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40"
                              : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/40"
                          }`}
                        >
                          <option value="guest">Guest</option>
                          <option value="host">Host</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>

                    <td className="px-8 py-4 text-xs font-bold text-slate-500 dark:text-neutral-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>

                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditUser(u)}
                          className="p-2 text-slate-400 hover:text-[#C59A2F] hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl transition cursor-pointer"
                          title="Edit User Details"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition cursor-pointer"
                          title="Delete User"
                        >
                          <FiTrash2 size={16} />
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

      {/* Pagination matching athithya-app */}
      {userTotalPages > 1 && (
        <div className="p-6 border-t border-slate-50 dark:border-neutral-800 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 dark:text-neutral-500">
            Page {userPage} of {userTotalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={userPage <= 1}
              onClick={() => setUserPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-slate-200 dark:border-neutral-700 disabled:opacity-30 cursor-pointer"
            >
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, userTotalPages) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setUserPage(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                    userPage === p
                      ? "bg-[#C59A2F] text-white"
                      : "text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              type="button"
              disabled={userPage >= userTotalPages}
              onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
              className="p-2 rounded-xl border border-slate-200 dark:border-neutral-700 disabled:opacity-30 cursor-pointer"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
