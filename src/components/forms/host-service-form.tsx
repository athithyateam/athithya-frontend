"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import {
  getExperience,
  createExperience,
  updateExperience,
  getPresignedUrl,
  uploadFileToS3,
} from "@/lib/api/experiences-api";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { Step1BasicDetails } from "./host-steps/step1-basic-details";
import { Step2LocationPricing } from "./host-steps/step2-location-pricing";
import { Step3RulesAmenities } from "./host-steps/step3-rules-amenities";
import { Step4MediaUpload } from "./host-steps/step4-media-upload";
import type { MediaItem, ExistingMedia, DiscountTier, FormErrors } from "./host-steps/types";

const STEPS = [
  { id: 1, label: "Basic Details" },
  { id: 2, label: "Location & Pricing" },
  { id: 3, label: "Rules & Categories" },
  { id: 4, label: "Media" },
];

export function HostServiceForm({ editId }: { editId?: string | null }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Trek"]);

  const toggleCategory = (type: string) => {
    setSelectedCategories((prev) =>
      prev.includes(type)
        ? prev.length > 1
          ? prev.filter((t) => t !== type)
          : prev
        : [...prev, type]
    );
    clearError("selectedCategories");
  };

  // Step 2: Location & Pricing
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("Uttarakhand");
  const [country, setCountry] = useState("India");
  const [address, setAddress] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");

  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("hour");
  const [duration, setDuration] = useState<number | string>(1);
  const [showDiscountInputs, setShowDiscountInputs] = useState(false);
  const [discounts, setDiscounts] = useState<DiscountTier[]>([]);
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

  // Sync discount price and percentage inputs when price changes
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
  }, [discounts, price, activeDiscountField]);

  const toggleMonth = (m: string) => {
    setSelectedMonths((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
    clearError("season");
  };

  // Step 3: Rules & Amenities
  const [privacyPolicies, setPrivacyPolicies] = useState<string[]>([]);
  const [customRule, setCustomRule] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const addCustomRule = () => {
    if (!customRule.trim()) return;
    if (!privacyPolicies.includes(customRule.trim())) {
      setPrivacyPolicies((prev) => [...prev, customRule.trim()]);
    }
    setCustomRule("");
    clearError("rules");
  };

  // Step 4: Media
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<ExistingMedia[]>([]);
  const [existingVideos, setExistingVideos] = useState<ExistingMedia[]>([]);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: string) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev));
  };

  // Edit mode pre-population
  useEffect(() => {
    if (editId) {
      getExperience(editId)
        .then((res: any) => {
          const basePost = res?.experience || res?.data || res;
          if (!basePost?._id) return;
          const s = basePost.pendingUpdate
            ? { ...basePost, ...basePost.pendingUpdate }
            : basePost;
          setTitle(s.title || "");
          setDescription(s.description || "");
          setLongDescription(s.longDescription || "");
          if (s.categories && Array.isArray(s.categories) && s.categories.length > 0) {
            setSelectedCategories(s.categories);
          } else if (s.category) {
            setSelectedCategories([s.category]);
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
    const err: FormErrors = {};
    if (step === 1) {
      if (!title.trim()) err.title = "Title is required";
      if (!description.trim()) err.description = "Short description is required";
      if (!longDescription.trim()) err.longDescription = "Full description is required";
      if (!selectedCategories || selectedCategories.length === 0)
        err.selectedCategories = "Please select at least one Experience Type";
    } else if (step === 2) {
      if (!latitude || !longitude) err.location = "Please pin your location on the map";
      if (!price || Number(price) <= 0) err.price = "Valid price per person is required";
      if (!address.trim()) err.address = "Specific location / address is required";
      if (!startPoint.trim()) err.startPoint = "Starting point is required";
      if (!endPoint.trim()) err.endPoint = "Ending point is required";
      if (selectedMonths.length === 0) err.season = "Select at least one available month";
    } else if (step === 3) {
      if (privacyPolicies.length === 0) err.rules = "Please add at least one host rule";
      if (amenities.length === 0) err.amenities = "Please add at least one amenity";
    } else if (step === 4) {
      if (existingPhotos.length === 0 && media.length === 0) {
        err.media = "Please upload at least one photo or video";
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateAll = () => {
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const items = files.slice(0, 5 - (existingPhotos.length + media.length)).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: (file.type.startsWith("video/") ? "video" : "image") as "image" | "video",
    }));
    setMedia((prev) => [...prev, ...items]);
    clearError("media");
  };

  const removeMedia = (idx: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingPhoto = (idx: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingVideo = (idx: number) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (currentStep !== 4) return;
    if (!validateAll()) return;

    setLoading(true);
    setProgress(10);
    try {
      const uploadedPhotos: ExistingMedia[] = [];
      const uploadedVideos: ExistingMedia[] = [];

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
        categories: selectedCategories,
        amenities,
        privacyPolicy: privacyPolicies,
        photos: [...existingPhotos, ...uploadedPhotos],
        videos: [...existingVideos, ...uploadedVideos],
      };

      const res = editId
        ? await updateExperience(editId, { ...payload, status: "pending" })
        : await createExperience(payload);

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
        <FiCheckCircle size={56} className="text-[#C59A2F] mx-auto" />
        <h3 className="text-2xl font-black uppercase tracking-tight">
          Experience Submitted!
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto font-medium">
          Your Himalayan experience is pending admin verification and will be published live once reviewed.
        </p>
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="mt-6 px-8 py-3 rounded-2xl bg-[#C59A2F] text-white font-black text-xs uppercase tracking-widest hover:bg-[#A67F26] transition shadow-md cursor-pointer"
        >
          View My Profile
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (
          e.key === "Enter" &&
          currentStep < 4 &&
          (e.target as HTMLElement)?.tagName === "INPUT"
        ) {
          e.preventDefault();
        }
      }}
      className="space-y-6"
    >
      {/* Wizard Step Tabs */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {STEPS.map((s) => (
          <div
            key={s.id}
            onClick={() => {
              if (s.id < currentStep) {
                setCurrentStep(s.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
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

      {/* Step 1: Basic Details */}
      {currentStep === 1 && (
        <Step1BasicDetails
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          longDescription={longDescription}
          setLongDescription={setLongDescription}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          errors={errors}
          clearError={clearError}
        />
      )}

      {/* Step 2: Location & Pricing */}
      {currentStep === 2 && (
        <Step2LocationPricing
          latitude={latitude}
          longitude={longitude}
          setCoordinates={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
          city={city}
          setCity={setCity}
          stateField={stateField}
          setStateField={setStateField}
          address={address}
          setAddress={setAddress}
          startPoint={startPoint}
          setStartPoint={setStartPoint}
          endPoint={endPoint}
          setEndPoint={setEndPoint}
          price={price}
          setPrice={setPrice}
          period={period}
          setPeriod={setPeriod}
          duration={duration}
          setDuration={setDuration}
          showDiscountInputs={showDiscountInputs}
          setShowDiscountInputs={setShowDiscountInputs}
          discounts={discounts}
          handleDiscountChange={handleDiscountChange}
          discountPriceInputs={discountPriceInputs}
          setDiscountPriceInputs={setDiscountPriceInputs}
          discountPercentageInputs={discountPercentageInputs}
          setDiscountPercentageInputs={setDiscountPercentageInputs}
          activeDiscountField={activeDiscountField}
          setActiveDiscountField={setActiveDiscountField}
          selectedMonths={selectedMonths}
          toggleMonth={toggleMonth}
          errors={errors}
          clearError={clearError}
        />
      )}

      {/* Step 3: Rules & Amenities */}
      {currentStep === 3 && (
        <Step3RulesAmenities
          privacyPolicies={privacyPolicies}
          setPrivacyPolicies={setPrivacyPolicies}
          customRule={customRule}
          setCustomRule={setCustomRule}
          addCustomRule={addCustomRule}
          amenities={amenities}
          setAmenities={setAmenities}
          errors={errors}
          clearError={clearError}
        />
      )}

      {/* Step 4: Media Uploads */}
      {currentStep === 4 && (
        <Step4MediaUpload
          media={media}
          existingPhotos={existingPhotos}
          existingVideos={existingVideos}
          handleFileChange={handleFileChange}
          removeMedia={removeMedia}
          removeExistingPhoto={removeExistingPhoto}
          removeExistingVideo={removeExistingVideo}
          loading={loading}
          progress={progress}
          errors={errors}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
        <button
          key="btn-prev-step"
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1 || loading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-black uppercase tracking-wider disabled:opacity-30 transition cursor-pointer"
        >
          <FiArrowLeft /> Back
        </button>

        {currentStep < 4 ? (
          <button
            key={`btn-next-step-${currentStep}`}
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md cursor-pointer"
          >
            Next Step <FiArrowRight />
          </button>
        ) : (
          <button
            key="btn-submit-experience"
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
