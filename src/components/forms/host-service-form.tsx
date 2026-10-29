"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, X } from "lucide-react";
import {
  getService,
  createService,
  updateService,
  getPresignedUrl,
  uploadFileToS3,
} from "@/lib/api/posts-api";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { MapPicker } from "@/components/ui/map-picker";
import {
  FormSection,
  ErrorMsg,
  InlineAdder,
  CategoryPills,
  FORM_GOLD,
} from "./form-primitives";

const STEPS = [
  { id: 1, label: "Basic Details" },
  { id: 2, label: "Location & Pricing" },
  { id: 3, label: "Rules & Amenities" },
  { id: 4, label: "Media" },
];

const ALL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function HostServiceForm({ editId }: { editId?: string | null }) {
  const { user } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const [currentStep, setCurrentStep] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(1);
  const [period, setPeriod] = useState("hour");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("Uttarakhand");
  const [country, setCountry] = useState("India");
  const [address, setAddress] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  const [amenities, setAmenities] = useState<string[]>([]);
  const [privacyPolicies, setPrivacyPolicies] = useState<string[]>([]);

  const [media, setMedia] = useState<
    { file: File; preview: string; type: "image" | "video" }[]
  >([]);
  const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
  const [existingVideos, setExistingVideos] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (editId) {
      getService(editId)
        .then((res: any) => {
          const basePost = res?.service || res?.post || res?.data || res;
          if (!basePost?._id) return;
          const s = basePost.pendingUpdate
            ? { ...basePost, ...basePost.pendingUpdate }
            : basePost;
          setTitle(s.title || "");
          setDescription(s.description || "");
          setLongDescription(s.longDescription || "");
          setPrice(String(s.price?.perPerson || ""));
          setPeriod(
            s.duration?.minutes ? "minute" : s.duration?.hours ? "hour" : "day"
          );
          setDuration(
            s.duration?.minutes || s.duration?.hours || s.duration?.days || 1
          );
          setCity(s.location?.city || "");
          setAddress(s.location?.address || "");
          setStateField(s.location?.state || "Uttarakhand");
          setCountry(s.location?.country || "India");
          setStartPoint(s.location?.startPoint || "");
          setEndPoint(s.location?.endPoint || "");
          setCategories(s.categories || []);
          setAmenities(s.amenities || []);
          setPrivacyPolicies(s.privacyPolicy || []);
          setExistingPhotos(s.photos || []);
          setExistingVideos(s.videos || []);
          if (s.location?.coordinates?.coordinates) {
            setLongitude(s.location.coordinates.coordinates[0]);
            setLatitude(s.location.coordinates.coordinates[1]);
          }
          if (s.season) {
            try {
              const parsed =
                typeof s.season === "string" ? JSON.parse(s.season) : s.season;
              if (Array.isArray(parsed?.months)) setSelectedMonths(parsed.months);
              else if (Array.isArray(parsed)) setSelectedMonths(parsed);
            } catch {}
          }
        })
        .catch(() => showToast("Failed to load experience data", "error"));
    } else if (user?.firstname && !title) {
      setTitle(`${user.firstname}'s Invitation`);
    }
  }, [editId, user?.firstname]);

  const validateStep = (step: number) => {
    const err: Record<string, string> = {};
    if (step === 1) {
      if (!title.trim()) err.title = "Title is required";
      if (!description.trim()) err.description = "Short description is required";
      if (!longDescription.trim())
        err.longDescription = "Full description is required";
      if (categories.length === 0)
        err.categories = "Select at least one Experience Type";
    } else if (step === 2) {
      if (!city.trim() || !latitude)
        err.location = "Please pin your location on the map";
      if (!price) err.price = "Price is required";
      if (!address.trim()) err.address = "Specific address is required";
      if (!startPoint.trim()) err.startPoint = "Starting point is required";
      if (!endPoint.trim()) err.endPoint = "Ending point is required";
      if (selectedMonths.length === 0)
        err.season = "Select at least one available month";
    } else if (step === 3) {
      if (privacyPolicies.length === 0)
        err.rules = "Add at least one host rule";
      if (amenities.length === 0) err.amenities = "Add at least one amenity";
    } else if (step === 4) {
      const hasImage =
        existingPhotos.length > 0 || media.some((m) => m.type === "image");
      if (!hasImage) err.media = "Please upload at least one image";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const nextMedia = [...media];
    for (const f of files) {
      const isVid = f.type.startsWith("video");
      nextMedia.push({
        file: f,
        preview: URL.createObjectURL(f),
        type: isVid ? "video" : "image",
      });
    }
    setMedia(nextMedia.slice(0, 6));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setLoading(true);
    setProgress(10);
    try {
      const uploadedPhotos: any[] = [];
      const uploadedVideos: any[] = [];
      for (let i = 0; i < media.length; i++) {
        const m = media[i];
        const presigned = await getPresignedUrl(m.file.name, m.file.type);
        if (!presigned?.success) throw new Error("Upload URL failed");
        await uploadFileToS3(presigned.uploadUrl, m.file, {
          onUploadProgress: (pct: number) => {
            setProgress(Math.round(((i + pct / 100) / media.length) * 100));
          },
        });
        const meta = {
          url: presigned.fileUrl,
          public_id: presigned.key,
          resource_type: presigned.resource_type,
        };
        if (m.type === "video") uploadedVideos.push(meta);
        else uploadedPhotos.push(meta);
      }

      const payload: any = {
        postType: "service",
        title,
        description,
        longDescription,
        price: {
          perPerson: Number(price || 0),
          currency: "INR",
          period: "person",
        },
        season: JSON.stringify({ months: selectedMonths }),
        capacity: { maxPeople: 3, guests: 3 },
        duration:
          period === "minute"
            ? { minutes: Number(duration) || 15, nights: 0 }
            : period === "hour"
            ? { hours: Number(duration) || 1, nights: 0 }
            : { days: Number(duration) || 1, nights: 0 },
        location: {
          city,
          address,
          state: stateField,
          country,
          startPoint,
          endPoint,
          coordinates:
            latitude && longitude
              ? {
                  type: "Point",
                  coordinates: [Number(longitude), Number(latitude)],
                }
              : undefined,
        },
        categories,
        amenities,
        privacyPolicy: privacyPolicies,
        photos: [...existingPhotos, ...uploadedPhotos],
        videos: [...existingVideos, ...uploadedVideos],
      };

      const res = editId
        ? await updateService(editId, { ...payload, status: "pending" })
        : await createService(payload);

      if (res?.success) {
        setShowSuccess(true);
        showToast(res?.message || "Experience saved successfully", "success");
      }
    } catch (err: any) {
      showToast(err?.message || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="p-10 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
        <CheckCircle2 size={56} className="text-[#C59A2F] mx-auto" />
        <h3 className="text-2xl font-black">Experience Submitted!</h3>
        <p className="text-sm text-neutral-500">
          Your experience is pending admin approval and will be live once verified.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between gap-2 mb-6">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={`flex-1 py-2.5 px-3 rounded-xl text-center text-xs font-black uppercase tracking-wider border ${
              currentStep >= s.id
                ? "bg-[#C59A2F] text-white border-[#C59A2F]"
                : "bg-white dark:bg-neutral-900 text-neutral-400 border-neutral-200 dark:border-neutral-800"
            }`}
          >
            {s.id}. {s.label}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="space-y-5">
          <FormSection title="Experience Details">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm"
                  placeholder="Experience title"
                />
                <ErrorMsg error={errors.title} />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">
                  Short Overview
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm"
                  placeholder="Brief summary..."
                />
                <ErrorMsg error={errors.description} />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm"
                  placeholder="Full itinerary and what guests will experience..."
                />
                <ErrorMsg error={errors.longDescription} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Experience Categories">
            <CategoryPills
              values={categories}
              onAdd={(v) => setCategories((c) => [...c, v])}
              onRemove={(v) => setCategories((c) => c.filter((x) => x !== v))}
            />
            <ErrorMsg error={errors.categories} />
          </FormSection>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-5">
          <FormSection title="Pin Location on Map">
            <MapPicker
              value={
                latitude && longitude
                  ? { lat: latitude, lng: longitude, city, state: stateField, address }
                  : undefined
              }
              onChange={(loc) => {
                setLatitude(loc.lat);
                setLongitude(loc.lng);
                if (loc.city) setCity(loc.city);
                if (loc.state) setStateField(loc.state);
                if (loc.address) setAddress(loc.address);
              }}
            />
            <ErrorMsg error={errors.location} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City / Town"
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
              />
              <input
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder="Start Point"
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
              />
              <input
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                placeholder="End Point"
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
              />
            </div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full meeting address / landmark"
              className="w-full mt-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
            />
          </FormSection>

          <FormSection title="Pricing, Duration & Available Months">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per person (₹)"
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="Duration"
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
              />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
              >
                <option value="minute">Minutes</option>
                <option value="hour">Hours</option>
                <option value="day">Days</option>
              </select>
            </div>
            <ErrorMsg error={errors.price} />

            <label className="text-xs font-bold block mb-2">
              Available Months
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_MONTHS.map((m) => {
                const active = selectedMonths.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() =>
                      setSelectedMonths((prev) =>
                        active ? prev.filter((x) => x !== m) : [...prev, m]
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      active
                        ? "bg-[#C59A2F] text-white border-[#C59A2F]"
                        : "border-neutral-200 dark:border-neutral-700"
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                );
              })}
            </div>
            <ErrorMsg error={errors.season} />
          </FormSection>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-5">
          <FormSection title="Host Rules">
            <InlineAdder
              placeholder="Add a rule (e.g. Carry valid ID)"
              values={privacyPolicies}
              onAdd={(v) => setPrivacyPolicies((p) => [...p, v])}
              onRemove={(v) =>
                setPrivacyPolicies((p) => p.filter((x) => x !== v))
              }
            />
            <ErrorMsg error={errors.rules} />
          </FormSection>
          <FormSection title="Included Amenities">
            <InlineAdder
              placeholder="Add an amenity (e.g. First Aid Kit, Tea & Snacks)"
              values={amenities}
              onAdd={(v) => setAmenities((a) => [...a, v])}
              onRemove={(v) => setAmenities((a) => a.filter((x) => x !== v))}
            />
            <ErrorMsg error={errors.amenities} />
          </FormSection>
        </div>
      )}

      {currentStep === 4 && (
        <FormSection title="Upload Photos & Video (Max 5 Photos, 1 Video)">
          <label className="block border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-8 text-center cursor-pointer hover:border-[#C59A2F]">
            <Upload className="mx-auto mb-2 text-[#C59A2F]" size={24} />
            <span className="text-xs font-bold">
              Click to select images or video
            </span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFilesSelected}
              className="hidden"
            />
          </label>
          <ErrorMsg error={errors.media} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {existingPhotos.map((p, idx) => (
              <div key={`ex-${idx}`} className="relative">
                <img
                  src={p.url || p}
                  alt=""
                  className="h-24 w-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() =>
                    setExistingPhotos((prev) =>
                      prev.filter((_, i) => i !== idx)
                    )
                  }
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {media.map((m, idx) => (
              <div key={`new-${idx}`} className="relative">
                <img
                  src={m.preview}
                  alt=""
                  className="h-24 w-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() =>
                    setMedia((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          {loading && (
            <p className="text-xs text-[#C59A2F] font-bold mt-3">
              Uploading... {progress}%
            </p>
          )}
        </FormSection>
      )}

      <div className="flex items-center justify-between pt-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((s) => s - 1)}
            className="px-6 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={14} /> Previous
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={() => validateStep(currentStep) && setCurrentStep((s) => s + 1)}
            className="px-6 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            style={{ background: FORM_GOLD }}
          >
            Next <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl text-white text-xs font-black uppercase tracking-wider cursor-pointer disabled:opacity-50"
            style={{ background: FORM_GOLD }}
          >
            {loading ? "Publishing..." : editId ? "Update Experience" : "Publish Experience"}
          </button>
        )}
      </div>
    </form>
  );
}
