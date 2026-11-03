"use client";

import React, { useState } from "react";
import { FiX } from "react-icons/fi";

interface EditExperienceModalProps {
  experience: any;
  onClose: () => void;
  onSave: (updatedExp: any) => Promise<void>;
}

export function EditExperienceModal({ experience, onClose, onSave }: EditExperienceModalProps) {
  const [title, setTitle] = useState(experience?.title || "");
  const [categories, setCategories] = useState<string[]>(
    experience?.categories || (experience?.category ? [experience.category] : [])
  );
  const [description, setDescription] = useState(experience?.description || "");
  const [longDescription, setLongDescription] = useState(experience?.longDescription || "");
  const [price, setPrice] = useState(experience?.price?.perPerson ?? experience?.price?.amount ?? experience?.price ?? "");
  const [period, setPeriod] = useState(experience?.price?.period || "hour");
  const [status, setStatus] = useState(experience?.status || "active");
  const [isFeatured, setIsFeatured] = useState(Boolean(experience?.isFeatured));
  const [city, setCity] = useState(experience?.location?.city || "");
  const [address, setAddress] = useState(experience?.location?.address || "");
  const [startPoint, setStartPoint] = useState(experience?.location?.startPoint || "");
  const [endPoint, setEndPoint] = useState(experience?.location?.endPoint || "");
  const [saving, setSaving] = useState(false);

  if (!experience) return null;

  const handleCategoryToggle = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        categories,
        status,
        isFeatured,
        description: description.trim(),
        longDescription: longDescription.trim(),
        price: {
          ...(experience.price || {}),
          perPerson: Number(price) || 0,
          amount: Number(price) || 0,
          total: Number(price) || 0,
          period,
        },
        location: {
          ...(experience.location || {}),
          city: city.trim(),
          address: address.trim(),
          startPoint: startPoint.trim(),
          endPoint: endPoint.trim(),
        },
      };
      await onSave(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-colors z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter">
              Edit Experience Info
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              ID: {experience._id || experience.id}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Experience Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Categories</label>
            <div className="flex flex-wrap gap-2">
              {[
                "Trek",
                "Rafting",
                "Camping",
                "Bungee jumping",
                "Safari",
                "Experience Guide",
                "Paragliding",
                "Others",
              ].map((cat) => {
                const isSelected = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                      isSelected
                        ? "bg-[#C59A2F] text-white border-[#C59A2F]"
                        : "bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:border-[#C59A2F]"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Price (₹)</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Charging Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              >
                <option value="hour">per hour</option>
                <option value="day">per day</option>
                <option value="minute">per minute</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Short Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Long Description / Details</label>
            <textarea
              rows={3}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              >
                <option value="active">Active (Published)</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending Review</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Featured on Home</label>
              <button
                type="button"
                onClick={() => setIsFeatured((v) => !v)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between cursor-pointer ${
                  isFeatured
                    ? "bg-[#C59A2F]/10 border-[#C59A2F] text-[#C59A2F]"
                    : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-500"
                }`}
              >
                <span>{isFeatured ? "★ Featured Experience" : "Standard Experience"}</span>
                <span className="text-[10px] font-black uppercase">{isFeatured ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Starting Point</label>
              <input
                type="text"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder="e.g. Dehradun"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Ending Point</label>
              <input
                type="text"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                placeholder="e.g. Rishikesh"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Address / Location</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none focus:border-[#C59A2F]"
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
              {saving ? "Saving..." : "Save Experience"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

