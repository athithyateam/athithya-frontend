"use client";

import { useState, useEffect } from "react";
import { X, Users, Check } from "lucide-react";
import { getGuestsApi } from "@/lib/api/users-api";
import { useChatStore } from "@/stores/chat-store";
import { useFeedbackStore } from "@/stores/feedback-store";

interface ChatGroupModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChatGroupModal({ open, onClose }: ChatGroupModalProps) {
  const { createGroup } = useChatStore();
  const { showToast } = useFeedbackStore();
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!open) return;
    getGuestsApi({ search, limit: 20 })
      .then((res) => {
        const list = res?.guests || res?.users || res?.data?.guests || (Array.isArray(res) ? res : []);
        setCandidates(list);
      })
      .catch(() => setCandidates([]));
  }, [open, search]);

  if (!open) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return showToast("Enter a group name", "warning");
    if (selectedIds.length === 0) return showToast("Select at least 1 traveler", "warning");
    setCreating(true);
    try {
      await createGroup(groupName.trim(), selectedIds);
      showToast("Group trip chat created!", "success");
      setGroupName("");
      setSelectedIds([]);
      onClose();
    } catch (err: any) {
      showToast(err?.message || "Failed to create group", "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#C59A2F]" />
            <h3 className="font-black text-base">New Group Trip Chat</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <X size={16} />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Group / Expedition Name</label>
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Kedarkantha Winter Squad"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-xs"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
            Add Travelers ({selectedIds.length} selected)
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search travelers..."
            className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-xs mb-2"
          />
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {candidates.map((u) => {
              const id = u._id || u.id;
              const checked = selectedIds.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleSelect(id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left text-xs transition ${
                    checked
                      ? "border-[#C59A2F] bg-[#C59A2F]/10 font-bold"
                      : "border-neutral-200/70 dark:border-neutral-800"
                  }`}
                >
                  <span className="capitalize">
                    {u.firstname} {u.lastname}
                  </span>
                  {checked && <Check size={14} className="text-[#C59A2F]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border text-xs font-bold">
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating}
            className="px-5 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Group"}
          </button>
        </div>
      </form>
    </div>
  );
}

