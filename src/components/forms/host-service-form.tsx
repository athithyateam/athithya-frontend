"use client";

import React, { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiUpload,
  FiX,
  FiTrash2,
  FiPercent,
  FiCalendar,
  FiMapPin,
  FiAlertTriangle,
} from "react-icons/fi";
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
  FORM_GOLD,
} from "./form-primitives";

const steps = [
  { id: 1, label: "Basic Details" },
  { id: 2, label: "Location & Pricing" },
  { id: 3, label: "Rules & Categories" },
  { id: 4, label: "Media" },
];

const EXPERIENCE_TYPES = [
  "Trek",
  "Rafting",
  "Camping",
  "Safari",
  "Bungee jumping",
  "Experience Guide",
  "Paragliding",
  "Others",
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

const getPlatformFeeRate = (amount: number) => {
  const amt = Number(amount) || 0;
  if (amt < 2000) return 0.05; // 5%
  if (amt <= 5000) return 0.035; // 3.5%
  return 0.02; // 2%
};

export function HostServiceForm({ editId }: { editId?: string | null }) {
  const { user } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [selectedType, setSelectedType] = useState<string>("Trek");

  // Step 2: Location & Pricing
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("Uttarakhand");
  const [country, setCountry] = useState("India");
  const [address, setAddress] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);

  const getRouteSuggestions = () => {
    const list = new Set<string>();
    if (city?.trim()) list.add(city.trim());
    [
      "Dehradun",
      "Haridwar",
      "Rishikesh",
      "Haldwani",
      "Nainital",
      "Mussoorie",
      "Almora",
      "Pithoragarh",
      "Uttarkashi",
      "Srinagar",
      "Joshimath",
      "Chopta",
      "Kedarnath",
      "Badrinath",
      "Roorkee",
      "Rudrapur",
    ].forEach((c) => list.add(c));
    return Array.from(list);
  };
  const routeSuggestions = getRouteSuggestions();

  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("hour");
  const [duration, setDuration] = useState<number | string>(1);
  const [showDiscountInputs, setShowDiscountInputs] = useState(false);
  const [discounts, setDiscounts] = useState<{ threshold: number; percentage: number }[]>([]);
  const [discountPriceInputs, setDiscountPriceInputs] = useState<Record<number, string>>({});
  const [discountPercentageInputs, setDiscountPercentageInputs] = useState<Record<number, string>>({});
  const [activeDiscountField, setActiveDiscountField] = useState<number | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  const handleDiscountChange = (threshold: number, percentage: number | "") => {
    setDiscounts((prev) => {
      const filtered = prev.filter((d) => Number(d.threshold) !== threshold);
      if (percentage === "" || percentage === null || isNaN(Number(percentage)) || Number(percentage) <= 0) {
        return filtered;
      }
      return [...filtered, { threshold, percentage: Number(percentage) }];
    });
  };

  useEffect(() => {
    const updatedPriceInputs = { ...discountPriceInputs };
    const updatedPctInputs = { ...discountPercentageInputs };
    const basePriceNum = Number(price) || 0;

    discounts.forEach((d) => {
      const derivedPrice = Math.round(basePriceNum * (1 - d.percentage / 100));
      const roundedPct = Math.round(d.percentage).toString();
      if (
        updatedPriceInputs[d.threshold] === undefined ||
        (d.threshold !== activeDiscountField &&
          Math.abs(Number(updatedPriceInputs[d.threshold]) - derivedPrice) > 1)
      ) {
        updatedPriceInputs[d.threshold] = derivedPrice > 0 ? derivedPrice.toString() : "";
      }
      if (
        updatedPctInputs[d.threshold] === undefined ||
        (d.threshold !== activeDiscountField && updatedPctInputs[d.threshold] !== roundedPct)
      ) {
        updatedPctInputs[d.threshold] = roundedPct;
      }
    });

    setDiscountPriceInputs(updatedPriceInputs);
    setDiscountPercentageInputs(updatedPctInputs);
  }, [discounts, price]);

  // Step 3: Rules & Amenities
  const [privacyPolicies, setPrivacyPolicies] = useState<string[]>([]);
  const [customRule, setCustomRule] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  // Step 4: Media
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
          if (s.categories && s.categories.length > 0) {
            setSelectedType(s.categories[0]);
          }
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
          setAmenities(s.amenities || []);
          setPrivacyPolicies(s.privacyPolicy || []);
          setExistingPhotos(s.photos || []);
          setExistingVideos(s.videos || []);

          if (s.discounts && Array.isArray(s.discounts) && s.discounts.length > 0) {
            setShowDiscountInputs(true);
            setDiscounts(s.discounts);
            const pInputs: Record<number, string> = {};
            const pctInputs: Record<number, string> = {};
            const bPrice = Number(s.price?.perPerson || 0);
            s.discounts.forEach((d: any) => {
              pctInputs[d.threshold] = String(Math.round(d.percentage));
              if (bPrice > 0) {
                pInputs[d.threshold] = String(Math.round(bPrice * (1 - d.percentage / 100)));
              }
            });
            setDiscountPriceInputs(pInputs);
            setDiscountPercentageInputs(pctInputs);
          }

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
      if (!selectedType) err.selectedType = "Please select an Experience Type";
    } else if (step === 2) {
      if (!latitude || !longitude)
        err.location = "Please pin your location on the map";
      if (!price || Number(price) <= 0) err.price = "Valid price per person is required";
      if (!address.trim()) err.address = "Specific location / address is required";
      if (!startPoint.trim()) err.startPoint = "Starting point is required";
      if (!endPoint.trim()) err.endPoint = "Ending point is required";
      if (selectedMonths.length === 0)
        err.season = "Select at least one available month";
    } else if (step === 3) {
      if (privacyPolicies.length === 0)
        err.rules = "Please add at least one host rule";
      if (amenities.length === 0)
        err.amenities = "Please add at least one amenity";
    } else if (step === 4) {
      if (existingPhotos.length === 0 && media.length === 0) {
        err.media = "Please upload at least one photo or video";
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const toggleMonth = (m: string) => {
    setSelectedMonths((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
    if (errors.season) setErrors((prev) => ({ ...prev, season: null }));
  };

  const addCustomRule = () => {
    if (!customRule.trim()) return;
    if (!privacyPolicies.includes(customRule.trim())) {
      setPrivacyPolicies((prev) => [...prev, customRule.trim()]);
    }
    setCustomRule("");
    if (errors.rules) setErrors((prev) => ({ ...prev, rules: null }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const items = files.slice(0, 5 - (existingPhotos.length + media.length)).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: (file.type.startsWith("video/") ? "video" : "image") as
        | "image"
        | "video",
    }));
    setMedia((prev) => [...prev, ...items]);
    if (errors.media) setErrors((prev) => ({ ...prev, media: null }));
  };

  const removeMedia = (idx: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== idx));
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
        const item = media[i];
        const presigned = await getPresignedUrl(
          item.file.name,
          item.file.type,
          { fileSize: item.file.size, uploadType: "post" }
        );
        const uploadUrl = presigned?.uploadUrl || presigned?.data?.uploadUrl;
        const fileUrl = presigned?.fileUrl || presigned?.data?.fileUrl;
        if (!uploadUrl || !fileUrl) throw new Error("Upload URL failed");
        await uploadFileToS3(uploadUrl, item.file);

        if (item.type === "image") {
          uploadedPhotos.push({ url: fileUrl, caption: title });
        } else {
          uploadedVideos.push({ url: fileUrl, title });
        }
        setProgress(Math.round(10 + ((i + 1) / media.length) * 75));
      }

      const finalDiscounts =
        showDiscountInputs && discounts.length > 0
          ? discounts
              .filter((d) => Number(d.percentage) > 0)
              .map((d) => ({
                threshold: Number(d.threshold),
                percentage: Number(d.percentage),
              }))
          : [];

      const payload: Record<string, any> = {
        title: title.trim(),
        description: description.trim(),
        longDescription: longDescription.trim(),
        price: {
          perPerson: Number(price),
          period: period,
        },
        duration: {
          [period === "minute" ? "minutes" : period === "day" ? "days" : "hours"]:
            Number(duration),
        },
        discounts: finalDiscounts,
        season: {
          months: selectedMonths,
        },
        location: {
          city: city.trim(),
          state: stateField.trim(),
          country: country.trim(),
          address: address.trim(),
          startPoint: startPoint.trim(),
          endPoint: endPoint.trim(),
          coordinates:
            latitude && longitude
              ? {
                  type: "Point",
                  coordinates: [Number(longitude), Number(latitude)],
                }
              : undefined,
        },
        categories: [selectedType],
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
      } else {
        showToast(res?.message || "Failed to save experience", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="p-12 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4 shadow-xl">
        <FiCheckCircle size={56} className="text-[#C59A2F] mx-auto animate-bounce" />
        <h3 className="text-2xl font-black uppercase tracking-tight">
          Experience Submitted!
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          Your Himalayan experience is pending admin verification and will be published live once reviewed.
        </p>
        <button
          type="button"
          onClick={() => (window.location.href = "/profile")}
          className="mt-6 px-8 py-3 rounded-2xl bg-[#C59A2F] text-white font-black text-xs uppercase tracking-widest hover:bg-[#A67F26] transition shadow-md cursor-pointer"
        >
          View My Profile
        </button>
      </div>
    );
  }

  const basePriceNum = Number(price) || 0;
  const platformFeeRate = getPlatformFeeRate(basePriceNum);
  const platformFee = Math.round(basePriceNum * platformFeeRate);
  const totalGuestPrice = basePriceNum + platformFee;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Wizard Step Tabs matching athithya-app */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {steps.map((s) => (
          <div
            key={s.id}
            onClick={() => {
              if (s.id < currentStep) setCurrentStep(s.id);
            }}
            className={`flex-1 py-3 px-3 rounded-2xl text-center text-xs font-black uppercase tracking-wider border transition-all ${
              currentStep >= s.id
                ? "bg-[#C59A2F] text-white border-[#C59A2F] shadow-sm"
                : "bg-white dark:bg-neutral-900 text-neutral-400 border-neutral-200 dark:border-neutral-800"
            } ${s.id < currentStep ? "cursor-pointer" : ""}`}
          >
            {s.id}. {s.label}
          </div>
        ))}
      </div>

      {/* ================= STEP 1: BASIC DETAILS ================= */}
      {currentStep === 1 && (
        <div className="space-y-5">
          {/* Uttarakhand Strict Policy Alert matching athithya-app */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 rounded-2xl p-4 flex gap-3 shadow-xs select-none">
            <FiAlertTriangle className="text-yellow-600 dark:text-yellow-400 shrink-0 text-xl mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-yellow-800 dark:text-yellow-300 uppercase tracking-wider">
                Uttarakhand Region
              </h4>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1 font-medium leading-relaxed">
                Athithya is a dedicated local experiences platform strictly for Uttarakhand only. Please ensure all details relate strictly to Uttarakhand. Experiences outside this region will not be approved.
              </p>
            </div>
          </div>

          <FormSection title="Basic Details">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Invitation title *</label>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                  }}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none transition"
                  placeholder="Invitation title *"
                />
                <ErrorMsg error={errors.title} />
              </div>

              <div className="relative">
                <label className="text-xs font-bold block mb-1">
                  Short description (Experience name, duration, short intro) *
                </label>
                <textarea
                  rows={3}
                  maxLength={150}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value.slice(0, 150));
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: null }));
                  }}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 pt-3 pb-7 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none transition"
                  placeholder="Short description (Experience name, duration, short intro) *"
                />
                <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-neutral-400 pointer-events-none select-none">
                  {description.length}/150 characters
                </div>
                <ErrorMsg error={errors.description} />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Full description *</label>
                <textarea
                  rows={6}
                  value={longDescription}
                  onChange={(e) => {
                    setLongDescription(e.target.value);
                    if (errors.longDescription)
                      setErrors((prev) => ({ ...prev, longDescription: null }));
                  }}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none transition"
                  placeholder="Full description *"
                />
                <ErrorMsg error={errors.longDescription} />
              </div>

              {/* Experience Type */}
              <div className="pt-2">
                <label className="text-xs font-black uppercase tracking-wider text-[#C59A2F] block mb-2.5">
                  Experience Type *
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_TYPES.map((type) => {
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedType(type);
                          if (errors.selectedType)
                            setErrors((prev) => ({ ...prev, selectedType: null }));
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#C59A2F] text-white shadow-sm"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
                <ErrorMsg error={errors.selectedType} />
              </div>
            </div>
          </FormSection>
        </div>
      )}

      {/* ================= STEP 2: LOCATION & PRICING ================= */}
      {currentStep === 2 && (
        <div className="space-y-5">
          <FormSection title="Location (Pin on Map) *">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
              Click/tap on the map to pin the exact location. The address will be auto-filled.
            </p>
            <p className="text-[11px] font-bold text-red-500 mb-3">
              * Note: Wherever the experience is hosted, please specify or choose that exact location.
            </p>

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
                if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
              }}
            />
            <ErrorMsg error={errors.location} />

            <div className="mt-4">
              <label className="text-xs font-bold block mb-1">
                Specific Location / Address *
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: null }));
                }}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none"
                placeholder="Full address will appear here..."
              />
              <ErrorMsg error={errors.address} />
            </div>

            {/* Route Details matching athithya-app */}
            <div className="mt-4 border border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 bg-neutral-50/50 dark:bg-neutral-800/20 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#C59A2F]">
                Route Details
              </h4>
              <p className="text-[11px] text-neutral-400">
                If this experience involves travelling between different locations, specify the starting and ending points.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-xs font-bold block mb-1">Starting Point *</label>
                  <input
                    value={startPoint}
                    autoComplete="off"
                    onFocus={() => setShowStartSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowStartSuggestions(false), 200)}
                    onChange={(e) => {
                      setStartPoint(e.target.value);
                      setShowStartSuggestions(true);
                      if (errors.startPoint)
                        setErrors((prev) => ({ ...prev, startPoint: null }));
                    }}
                    placeholder="e.g. Dehradun"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none"
                  />
                  {showStartSuggestions && (
                    <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                      {routeSuggestions
                        .filter(
                          (s) =>
                            !startPoint.trim() ||
                            (s.toLowerCase().includes(startPoint.toLowerCase()) &&
                              s.toLowerCase() !== startPoint.toLowerCase())
                        )
                        .map((s) => (
                          <li
                            key={s}
                            onMouseDown={() => {
                              setStartPoint(s);
                              setShowStartSuggestions(false);
                              if (errors.startPoint)
                                setErrors((prev) => ({ ...prev, startPoint: null }));
                            }}
                            className="px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-[#FFF9EC] dark:hover:bg-neutral-800 cursor-pointer border-b border-neutral-100 dark:border-neutral-800 last:border-0 transition-colors"
                          >
                            {s}
                          </li>
                        ))}
                    </ul>
                  )}
                  <ErrorMsg error={errors.startPoint} />
                </div>
                <div className="relative">
                  <label className="text-xs font-bold block mb-1">Ending Point *</label>
                  <input
                    value={endPoint}
                    autoComplete="off"
                    onFocus={() => setShowEndSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowEndSuggestions(false), 200)}
                    onChange={(e) => {
                      setEndPoint(e.target.value);
                      setShowEndSuggestions(true);
                      if (errors.endPoint)
                        setErrors((prev) => ({ ...prev, endPoint: null }));
                    }}
                    placeholder="e.g. Rishikesh"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none"
                  />
                  {showEndSuggestions && (
                    <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                      {routeSuggestions
                        .filter(
                          (s) =>
                            !endPoint.trim() ||
                            (s.toLowerCase().includes(endPoint.toLowerCase()) &&
                              s.toLowerCase() !== endPoint.toLowerCase())
                        )
                        .map((s) => (
                          <li
                            key={s}
                            onMouseDown={() => {
                              setEndPoint(s);
                              setShowEndSuggestions(false);
                              if (errors.endPoint)
                                setErrors((prev) => ({ ...prev, endPoint: null }));
                            }}
                            className="px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-[#FFF9EC] dark:hover:bg-neutral-800 cursor-pointer border-b border-neutral-100 dark:border-neutral-800 last:border-0 transition-colors"
                          >
                            {s}
                          </li>
                        ))}
                    </ul>
                  )}
                  <ErrorMsg error={errors.endPoint} />
                </div>
              </div>

              <div className="bg-[#FFF9EC] dark:bg-neutral-800/40 border border-yellow-100 dark:border-neutral-800 rounded-xl p-3 text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
                <span className="font-bold text-[#C59A2F]">📍 Route Guidelines:</span>
                <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-neutral-500 dark:text-neutral-400">
                  <li>Starting point is the pick up point from where the host begins the experience.</li>
                  <li>Ending point is the last point where the experience concludes, the drop point.</li>
                </ul>
              </div>
            </div>
          </FormSection>

          {/* Pricing & Scheduling Section */}
          <FormSection title="Pricing & Duration *">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-xs font-bold block mb-1">Price per person (₹) *</label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
                  }}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#C59A2F] outline-none"
                  placeholder="0"
                />
                <ErrorMsg error={errors.price} />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Duration Unit</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#C59A2F] outline-none"
                >
                  <option value="minute">Minute(s)</option>
                  <option value="hour">Hour(s)</option>
                  <option value="day">Day(s)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">
                  Duration ({period === "minute" ? "Minutes" : period === "day" ? "Days" : "Hours"})
                </label>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#C59A2F] outline-none"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowDiscountInputs((v) => !v)}
                  className={`w-full py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    showDiscountInputs
                      ? "bg-[#C59A2F] text-white border-[#C59A2F] shadow-sm"
                      : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <FiPercent size={14} /> Group Discount
                </button>
              </div>
            </div>

            {/* Per-Person Discount List Area matching athithya-app */}
            {showDiscountInputs && (
              <div className="mt-8 mb-6 p-6 bg-[#fbf6ea]/40 dark:bg-[#C59A2F]/5 rounded-[2rem] border border-[#C59A2F]/20 shadow-sm animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-black text-[#C59A2F] uppercase tracking-[0.2em]">
                      Discounting
                    </h4>
                    <p className="text-xs text-gray-500 italic mt-1 font-medium dark:text-neutral-400">
                      Encourage larger groups by offering better per-person rates
                    </p>
                  </div>
                  <div className="bg-[#C59A2F]/10 px-3 py-1.5 rounded-lg border border-[#C59A2F]/20">
                    <span className="text-xs font-black text-[#C59A2F] uppercase">
                      Base Price: ₹{price || 0}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {[2, 3].map((personNum) => {
                    const existing = discounts.find(
                      (d) => Number(d.threshold) === personNum
                    );
                    const basePricePerPerson = Number(price) || 0;

                    const handlePriceInput = (val: string) => {
                      setDiscountPriceInputs((prev) => ({ ...prev, [personNum]: val }));
                      if (basePricePerPerson <= 0) return;
                      if (val === "" || val === null) {
                        setDiscountPercentageInputs((prev) => ({ ...prev, [personNum]: "" }));
                        handleDiscountChange(personNum, "");
                        return;
                      }
                      const discPricePerPerson = Number(val);
                      let pct = ((basePricePerPerson - discPricePerPerson) / basePricePerPerson) * 100;
                      pct = Math.max(0, Math.min(100, pct));
                      setDiscountPercentageInputs((prev) => ({
                        ...prev,
                        [personNum]: Math.round(pct).toString(),
                      }));
                      handleDiscountChange(personNum, Math.round(pct * 100) / 100);
                    };

                    const handlePercentageInput = (val: string) => {
                      setDiscountPercentageInputs((prev) => ({ ...prev, [personNum]: val }));
                      if (basePricePerPerson <= 0) return;
                      if (val === "" || val === null) {
                        setDiscountPriceInputs((prev) => ({ ...prev, [personNum]: "" }));
                        handleDiscountChange(personNum, "");
                        return;
                      }
                      let pct = Number(val);
                      pct = Math.max(0, Math.min(100, pct));
                      const derivedPrice = Math.round(basePricePerPerson * (1 - pct / 100));
                      setDiscountPriceInputs((prev) => ({
                        ...prev,
                        [personNum]: derivedPrice.toString(),
                      }));
                      handleDiscountChange(personNum, pct);
                    };

                    const currentPriceInputValue = discountPriceInputs[personNum] || "";
                    const currentPctInputValue = discountPercentageInputs[personNum] || "";

                    let priceError = null;
                    if (
                      currentPriceInputValue !== "" &&
                      basePricePerPerson > 0 &&
                      Number(currentPriceInputValue) >= basePricePerPerson
                    ) {
                      priceError = `Discounted price must be less than ₹${basePricePerPerson.toLocaleString()}`;
                    }

                    return (
                      <div
                        key={personNum}
                        className={`p-5 rounded-3xl border shadow-sm relative overflow-hidden group transition-all ${
                          priceError
                            ? "bg-red-50/40 border-red-200 dark:bg-red-950/20"
                            : "bg-white/80 border-[#C59A2F]/10 hover:border-[#C59A2F]/30 dark:bg-neutral-900/60 dark:border-neutral-800"
                        }`}
                      >
                        <div
                          className={`absolute top-0 left-0 w-1 h-full transition-all ${
                            priceError ? "bg-red-400" : "bg-[#C59A2F]/10 group-hover:bg-[#C59A2F]"
                          }`}
                        />

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-neutral-900 uppercase tracking-widest dark:text-neutral-100">
                              Group of {personNum}
                            </span>
                            {existing && !priceError && (
                              <span className="text-[10px] font-black text-[#C59A2F] bg-[#C59A2F]/5 dark:bg-[#C59A2F]/10 px-2.5 py-1 rounded-full uppercase border border-[#C59A2F]/20">
                                ✓ Applied
                              </span>
                            )}
                          </div>
                          {basePricePerPerson > 0 && (
                            <span className="text-[11px] text-neutral-400 font-bold italic">
                              Standard: ₹{basePricePerPerson.toLocaleString()}
                            </span>
                          )}
                          {(() => {
                            const p =
                              activeDiscountField === personNum &&
                              currentPriceInputValue !== "" &&
                              basePricePerPerson > 0
                                ? ((basePricePerPerson - Number(currentPriceInputValue)) /
                                    basePricePerPerson) *
                                  100
                                : existing
                                ? existing.percentage
                                : 0;
                            if (p > 0) {
                              return (
                                <span className="text-[11px] font-black text-[#C59A2F] bg-[#C59A2F]/10 px-2.5 py-1 rounded-lg border border-[#C59A2F]/20 ml-2 animate-pulse">
                                  {Math.round(p)}% OFF
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                          <div>
                            <label className="text-[11px] text-[#C59A2F] font-black uppercase mb-1.5 block tracking-tight">
                              Price After Discount (₹)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-bold">
                                ₹
                              </span>
                              <input
                                type="number"
                                placeholder="0"
                                min="0"
                                max={basePricePerPerson > 0 ? basePricePerPerson - 1 : undefined}
                                value={currentPriceInputValue}
                                onFocus={() => setActiveDiscountField(personNum)}
                                onBlur={() => setActiveDiscountField(null)}
                                onChange={(e) => handlePriceInput(e.target.value)}
                                className={`w-full bg-white dark:bg-neutral-900 dark:text-neutral-100 rounded-xl border pl-8 pr-3 h-[52px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                                  priceError
                                    ? "border-red-200 dark:border-red-800 focus:border-red-400"
                                    : "border-neutral-200 dark:border-neutral-800 focus:border-[#C59A2F]"
                                }`}
                              />
                            </div>
                            {priceError && (
                              <p className="text-[10px] text-red-500 font-black mt-2 leading-tight">
                                ⚠ {priceError}
                              </p>
                            )}
                          </div>

                          <div className="flex items-end gap-3 w-full">
                            <div className="flex-1">
                              <label className="text-[11px] text-[#C59A2F] font-black uppercase mb-1.5 block tracking-tight">
                                Percentage (%)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="0"
                                  value={currentPctInputValue}
                                  onFocus={() => setActiveDiscountField(personNum)}
                                  onBlur={() => setActiveDiscountField(null)}
                                  onChange={(e) => handlePercentageInput(e.target.value)}
                                  className="w-full bg-white dark:bg-neutral-900 dark:text-neutral-100 rounded-xl border pr-8 pl-4 h-[52px] text-sm font-medium focus:outline-none focus:ring-2 focus:border-[#C59A2F] border-neutral-200 dark:border-neutral-800 transition-all shadow-sm"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-black">
                                  %
                                </span>
                              </div>
                            </div>

                            <div className="pb-[1px]">
                              {existing ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDiscountChange(personNum, "");
                                    setDiscountPriceInputs((prev) => ({ ...prev, [personNum]: "" }));
                                    setDiscountPercentageInputs((prev) => ({
                                      ...prev,
                                      [personNum]: "",
                                    }));
                                  }}
                                  className="h-[52px] w-[52px] flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all border border-transparent hover:border-red-100 cursor-pointer"
                                  title="Remove Tier"
                                >
                                  <FiTrash2 size={20} />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const val = discountPercentageInputs[personNum];
                                    if (val) handlePercentageInput(val);
                                  }}
                                  className="px-6 h-[52px] flex items-center justify-center bg-[#C59A2F] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:shadow-xl transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                                >
                                  Add Discount
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Platform Fee & Total Guest Cost Breakdown */}
            {basePriceNum > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Host Base:</span>{" "}
                  <strong className="text-neutral-900 dark:text-neutral-100 font-bold">₹{basePriceNum}</strong>
                  <span className="mx-2 text-neutral-300 dark:text-neutral-600">•</span>
                  <span className="text-neutral-500 dark:text-neutral-400">Platform Fee ({(platformFeeRate * 100).toFixed(1)}%):</span>{" "}
                  <strong className="text-[#C59A2F] font-bold">₹{platformFee}</strong>
                </div>
                <div className="text-sm font-black text-neutral-900 dark:text-neutral-100">
                  Guest Total: <span className="text-[#C59A2F]">₹{totalGuestPrice}</span> / person
                </div>
              </div>
            )}

            {/* Best Season to Visit */}
            <div className="mt-5">
              <label className="text-xs font-black uppercase tracking-wider text-[#C59A2F] block mb-2">
                Best Season to Visit *
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_MONTHS.map((m) => {
                  const isSelected = selectedMonths.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMonth(m)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#C59A2F] text-white shadow-xs"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
              <ErrorMsg error={errors.season} />
            </div>
          </FormSection>
        </div>
      )}

      {/* ================= STEP 3: RULES & AMENITIES ================= */}
      {currentStep === 3 && (
        <div className="space-y-5">
          <FormSection title="Host Rules *">
            <p className="text-xs text-neutral-400 mb-3 font-semibold">
              Set clear rules for your guests (e.g. Carry valid ID, No smoking).
            </p>

            <div className="flex gap-2 mb-3">
              <input
                value={customRule}
                onChange={(e) => setCustomRule(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomRule())}
                placeholder="Type one policy sentence..."
                className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#C59A2F] outline-none"
              />
              <button
                type="button"
                onClick={addCustomRule}
                className="px-5 py-2.5 rounded-xl bg-[#C59A2F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#A67F26] transition cursor-pointer"
              >
                Add Rule
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {privacyPolicies.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200"
                >
                  <span>{rule}</span>
                  <button
                    type="button"
                    onClick={() => setPrivacyPolicies((p) => p.filter((_, i) => i !== idx))}
                    className="text-neutral-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <ErrorMsg error={errors.rules} />
          </FormSection>

          <FormSection title="Amenities *">
            <p className="text-xs text-neutral-400 mb-3 font-semibold">
              List all inclusions and services provided (e.g. Tent, Sleeping Bag, Bonfire, First Aid, Meals).
            </p>
            <InlineAdder
              placeholder="Add amenity (e.g. Guided Trek, Campfire, Mineral Water)"
              values={amenities}
              onAdd={(v) => {
                setAmenities((a) => [...a, v]);
                if (errors.amenities) setErrors((prev) => ({ ...prev, amenities: null }));
              }}
              onRemove={(v) => setAmenities((a) => a.filter((x) => x !== v))}
            />
            <ErrorMsg error={errors.amenities} />
          </FormSection>
        </div>
      )}

      {/* ================= STEP 4: MEDIA ================= */}
      {currentStep === 4 && (
        <div className="space-y-5">
          <FormSection title="Media">
            <label className="rounded-2xl p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-[#C59A2F] bg-neutral-50/50 dark:bg-neutral-800/30 transition flex flex-col items-center justify-center text-center cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-neutral-800 text-[#C59A2F] flex items-center justify-center mb-3">
                <FiUpload size={22} />
              </div>
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                Click or Drag photos here
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Upload up to 5 photos or 1 video max. High-resolution landscape photos recommended.
              </p>
            </label>
            <ErrorMsg error={errors.media} />

            {/* Media previews */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {existingPhotos.map((p, idx) => (
                <div key={`exist_${idx}`} className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 group">
                  <img src={p.url} alt="Photo" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setExistingPhotos((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              {media.map((m, idx) => (
                <div key={`new_${idx}`} className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 group">
                  {m.type === "image" ? (
                    <img src={m.preview} alt="New" className="w-full h-full object-cover" />
                  ) : (
                    <video src={m.preview} className="w-full h-full object-cover" controls />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>

            {loading && (
              <div className="mt-4 space-y-2">
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#C59A2F] h-2 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[11px] font-bold text-center text-neutral-500">
                  Uploading media & publishing: {progress}%
                </p>
              </div>
            )}
          </FormSection>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1 || loading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-black uppercase tracking-wider disabled:opacity-30 transition cursor-pointer"
        >
          <FiArrowLeft /> Back
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md cursor-pointer"
          >
            Next Step <FiArrowRight />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Publishing..." : editId ? "Update Experience" : "Publish Experience"}
          </button>
        )}
      </div>
    </form>
  );
}
