"use client";

import React, { useState } from "react";
import { FiX } from "react-icons/fi";

interface EditUserModalProps {
  user: any;
  onClose: () => void;
  onSave: (updatedUser: any) => Promise<void>;
}

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "guest");
  const [hostStatus, setHostStatus] = useState(user?.hostStatus || "approved");
  const [phone, setPhone] = useState(user?.phone || user?.hostDetails?.phone || "");
  const [description, setDescription] = useState(user?.description || "");
  const [city, setCity] = useState(user?.hostDetails?.city || user?.location?.city || "");
  const [district, setDistrict] = useState(user?.hostDetails?.district || "");
  const [physicalAddress, setPhysicalAddress] = useState(user?.hostDetails?.physicalAddress || "");
  const [pincode, setPincode] = useState(user?.hostDetails?.pincode || "");
  const [yearsOfExperience, setYearsOfExperience] = useState(
    user?.hostDetails?.yearsOfExperience !== undefined ? user.hostDetails.yearsOfExperience : 0
  );
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isHost = role === "host" || user?.role === "host";
      const payload: Record<string, any> = {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        role,
        description: description.trim(),
        phone: phone.trim(),
      };

      if (isHost) {
        payload.hostStatus = hostStatus;
        payload.hostDetails = {
          ...(user.hostDetails || {}),
          phone: phone.trim(),
          city: city.trim(),
          district: district.trim(),
          physicalAddress: physicalAddress.trim(),
          pincode: pincode.trim(),
          yearsOfExperience: Number(yearsOfExperience) || 0,
        };
      }

      await onSave(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-colors z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter">
              Edit User Details
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              ID: {user._id || user.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">First Name</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Last Name</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              >
                <option value="guest">Guest</option>
                <option value="host">Host</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {(role === "host" || user?.role === "host") && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Host Status</label>
              <select
                value={hostStatus}
                onChange={(e) => setHostStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              >
                <option value="pending_verification">Pending Verification</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Years of Experience</label>
              <input
                type="number"
                min={0}
                max={30}
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Bio / Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Physical Address</label>
            <input
              type="text"
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Pin Code</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-neutral-700 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-neutral-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#a67f26] transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
