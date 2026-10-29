"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ShieldCheck, Trash2, Download, History } from "lucide-react";
import {
  getAdminUsersApi,
  updateAdminUserRoleApi,
  updateAdminUserApi,
  deleteAdminUserApi,
  getAdminHostHistoryApi,
} from "@/lib/api/admin-api";
import { useFeedbackStore } from "@/stores/feedback-store";

interface AdminUsersHostsTabProps {
  mode?: "users" | "hosts";
}

export function AdminUsersHostsTab({ mode = "users" }: AdminUsersHostsTabProps) {
  const { showToast } = useFeedbackStore();
  const [users, setUsers] = useState<any[]>([]);
  const [hostHistory, setHostHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (mode === "hosts") {
        const res = await getAdminHostHistoryApi();
        setHostHistory(res?.history || res?.hosts || res?.data?.history || (Array.isArray(res) ? res : []));
      } else {
        const res = await getAdminUsersApi({ search, role: roleFilter, limit: 50 });
        setUsers(res?.users || res?.data?.users || (Array.isArray(res) ? res : []));
      }
    } catch {
      setUsers([]);
      setHostHistory([]);
    } finally {
      setLoading(false);
    }
  }, [mode, search, roleFilter]);

  useEffect(() => {
    const t = setTimeout(loadData, 200);
    return () => clearTimeout(t);
  }, [loadData]);

  const handleRoleChange = async (id: string, role: "guest" | "host" | "admin") => {
    try {
      await updateAdminUserRoleApi(id, role);
      showToast(`Role updated to ${role}`, "success");
      loadData();
    } catch {
      showToast("Failed to update user role", "error");
    }
  };

  const handleToggleVerifyBadge = async (u: any) => {
    const id = u._id || u.id;
    const enabled = !u.verifyBadge?.enabled;
    try {
      await updateAdminUserApi(id, { verifyBadge: { enabled } });
      showToast(`Verified badge ${enabled ? "granted" : "removed"}`, "success");
      loadData();
    } catch {
      showToast("Could not update badge", "error");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteAdminUserApi(id);
      showToast("User deleted", "success");
      loadData();
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  const exportCsv = () => {
    const rows = [
      ["ID", "Name", "Email", "Role", "Phone"],
      ...users.map((u) => [
        u._id || u.id,
        `${u.firstname || ""} ${u.lastname || ""}`.trim(),
        u.email || "",
        u.role || "guest",
        u.phone || "",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "athithya-users.csv";
    a.click();
  };

  if (mode === "hosts") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Host Verification & Onboarding History</h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
            Audit trail of host applications and approvals
          </p>
        </div>
        {hostHistory.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <History size={36} className="mx-auto text-neutral-400 mb-2" />
            <p className="text-sm font-bold">No host onboarding history entries found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {hostHistory.map((item, idx) => (
              <div
                key={item._id || idx}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm">{item.firstname || item.hostName || "Host"}</h4>
                  <p className="text-xs text-neutral-500">{item.email} • Status: {item.hostStatus || item.status}</p>
                </div>
                <span className="text-xs text-neutral-400">
                  {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">User Management</h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
            Manage Travelers, Hosts, and Administrators
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 dark:bg-neutral-800 text-white text-xs font-bold"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-bold"
        >
          <option value="">All Roles</option>
          <option value="guest">Guests</option>
          <option value="host">Hosts</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Badge</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-400">
                  Loading users...
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const id = u._id || u.id;
                return (
                  <tr key={id}>
                    <td className="p-4 font-bold capitalize">
                      {u.firstname} {u.lastname}
                    </td>
                    <td className="p-4 text-neutral-500">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role || "guest"}
                        onChange={(e) => handleRoleChange(id, e.target.value as any)}
                        className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent font-bold uppercase text-[11px]"
                      >
                        <option value="guest">guest</option>
                        <option value="host">host</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleVerifyBadge(u)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          u.verifyBadge?.enabled
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        <ShieldCheck size={12} /> {u.verifyBadge?.enabled ? "Verified" : "Unverified"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
