"use client";

import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import {
  getItinerary,
  createItinerary,
  updateItinerary,
  getPresignedUrl,
  uploadFileToS3,
} from "@/lib/api/posts-api";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { FormSection, CategoryPills, FORM_GOLD } from "./form-primitives";

export function TravellerPlanForm({ editId }: { editId?: string | null }) {
  const { user } = useAuthStore();
  const { showToast } = useFeedbackStore();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [planName, setPlanName] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("Uttarakhand");
  const [country, setCountry] = useState("India");
  const [address, setAddress] = useState("");
  const [days, setDays] = useState(1);
  const [nights, setNights] = useState(0);
  const [maxPeople, setMaxPeople] = useState(5);
  const [priceTotal, setPriceTotal] = useState("");
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [period, setPeriod] = useState("person");
  const [categories, setCategories] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState("anyone");

  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editId) {
      getItinerary(editId)
        .then((res: any) => {
          const i = res?.itinerary || res?.post || res?.data || res;
          if (!i?._id) return;
          setTitle(i.title || "");
          setSubtitle(i.subtitle || "");
          setDescription(i.description || "");
          setPlanName(i.plan?.name || "");
          setCategories(i.categories || []);
          setCity(i.location?.city || "");
          setStateField(i.location?.state || "Uttarakhand");
          setCountry(i.location?.country || "India");
          setAddress(i.location?.address || "");
          setDays(i.duration?.days || 1);
          setNights(i.duration?.nights || 0);
          setMaxPeople(i.capacity?.maxPeople || 5);
          setPriceTotal(String(i.price?.total || ""));
          setPricePerPerson(String(i.price?.perPerson || ""));
          setPeriod(i.price?.period || "person");
          setExistingPhotos(i.photos || []);
        })
        .catch(() => setFormError("Failed to load itinerary data"));
    } else if (user?.firstname && !title) {
      setTitle(`${user.firstname}'s invitation`);
    }
  }, [editId, user?.firstname]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos((prev) => [
      ...prev,
      ...files.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !city.trim()) {
      setFormError("Title, description, and city are required");
      return;
    }
    if (categories.length === 0) {
      setFormError("Select at least one category");
      return;
    }
    setFormError("");
    setLoading(true);
    setProgress(10);

    try {
      const uploadedPhotos: any[] = [];
      for (let idx = 0; idx < photos.length; idx++) {
        const m = photos[idx];
        const presigned = await getPresignedUrl(m.file.name, m.file.type);
        if (!presigned?.success) throw new Error("Upload URL failed");
        await uploadFileToS3(presigned.uploadUrl, m.file, {
          onUploadProgress: (pct: number) => {
            setProgress(Math.round(((idx + pct / 100) / photos.length) * 100));
          },
        });
        uploadedPhotos.push({
          url: presigned.fileUrl,
          public_id: presigned.key,
          resource_type: presigned.resource_type,
        });
      }

      const payload = {
        postType: "plan",
        title,
        subtitle,
        description,
        planName,
        location: { city, state: stateField, country, address },
        duration: { days: Number(days || 1), nights: Number(nights || 0) },
        capacity: { maxPeople: Number(maxPeople || 1) },
        price: {
          total: Number(priceTotal || 0),
          perPerson: Number(pricePerPerson || 0),
          period,
        },
        categories,
        tags: lookingFor !== "anyone" ? [`looking:${lookingFor}`] : [],
        status: "active",
        userRole: "guest",
        city,
        state: stateField,
        country,
        photos: [...existingPhotos, ...uploadedPhotos],
      };

      if (editId) {
        await updateItinerary(editId, payload);
        showToast("Itinerary updated successfully", "success");
      } else {
        await createItinerary(payload);
        showToast("Itinerary created successfully", "success");
        setTitle("");
        setDescription("");
        setCity("");
        setCategories([]);
        setPhotos([]);
      }
    } catch (err: any) {
      setFormError(err?.message || "Submission failed");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection title="Basic Details">
        <div className="space-y-3">
          <input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="Plan name (optional)"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your invitation title"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-medium"
          />
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Kedarnath"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
          />
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 250))}
            placeholder="Describe the plan"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
          />
        </div>
      </FormSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <FormSection title="Location, Duration & Pricing">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
              />
              <input
                value={stateField}
                readOnly
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm"
              />
              <input
                value={country}
                readOnly
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">
                  Days
                </label>
                <input
                  type="number"
                  min={1}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">
                  Nights
                </label>
                <input
                  type="number"
                  min={0}
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">
                  Max People
                </label>
                <input
                  type="number"
                  min={1}
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(e.target.value)}
                placeholder="Price per person (₹)"
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={priceTotal}
                onChange={(e) => setPriceTotal(e.target.value)}
                placeholder="Total price (optional)"
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
              />
            </div>
          </FormSection>
        </div>

        <div className="space-y-5">
          <FormSection title="Photos">
            <label className="block rounded-xl p-4 text-center cursor-pointer border-dashed border-2 border-neutral-300 dark:border-neutral-700 hover:border-[#C59A2F]">
              <Upload className="mx-auto mb-1 text-[#C59A2F]" size={18} />
              <span className="text-xs text-neutral-500">
                Click to upload photos
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesSelected}
                className="hidden"
              />
            </label>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {photos.map((p, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={p.preview}
                    alt=""
                    className="rounded-lg object-cover h-16 w-full"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPhotos((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </FormSection>

          <FormSection title="Categories">
            <CategoryPills
              values={categories}
              onAdd={(v) => setCategories((c) => [...c, v])}
              onRemove={(v) => setCategories((c) => c.filter((x) => x !== v))}
            />
          </FormSection>

          <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
            {formError && (
              <div className="text-xs text-red-500 mb-2">{formError}</div>
            )}
            {loading && (
              <div className="text-xs text-neutral-400 mb-2">
                Upload progress: {progress}%
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-xl font-bold text-sm cursor-pointer"
              style={{ background: FORM_GOLD }}
            >
              {loading
                ? editId
                  ? "Updating..."
                  : "Creating..."
                : editId
                ? "Update Plan"
                : "Create Plan"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
