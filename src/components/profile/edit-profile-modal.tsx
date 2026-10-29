"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCamera,
  FiUpload,
  FiFileText,
  FiAlertTriangle,
} from "react-icons/fi";
import { updateProfileApi } from "@/lib/api/users-api";
import { sendPhoneOtpApi, verifyPhoneOtpApi } from "@/lib/api/auth-api";
import { getPresignedUrl, uploadFileToS3 } from "@/lib/api/posts-api";
import { PROFILE_THEMES, DEFAULT_THEME_KEY } from "./profile-shared";
import { STATE_DISTRICT_MAPPING, CITY_MAPPING } from "@/data/location-data";

interface EditProfileModalProps {
  open?: boolean;
  user: Record<string, any>;
  onClose: () => void;
  onUpdate?: (updated: Record<string, any>, isPendingReview?: boolean) => void;
  onSaved?: (updated: Record<string, any>) => void;
  isThemed?: boolean;
}

export function EditProfileModal({
  open = true,
  user,
  onClose,
  onUpdate,
  onSaved,
  isThemed: isThemedProp,
}: EditProfileModalProps) {
  const activeThemed =
    isThemedProp !== undefined
      ? isThemedProp
      : Boolean(
          typeof document !== "undefined" &&
            document.querySelector(".is-themed, .profile-theme-active")
        );

  const [showUnverifiedPopup, setShowUnverifiedPopup] = useState(false);
  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [description, setDescription] = useState(
    user?.description || user?.bio || ""
  );
  const [avatar, setAvatar] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [preview, setPreview] = useState(
    (typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url) || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");

  // Guest location state
  const [guestCity, setGuestCity] = useState(
    user?.location?.city || user?.hostDetails?.city || ""
  );
  const [guestState, setGuestState] = useState(
    user?.location?.state || user?.hostDetails?.state || ""
  );

  // Host details state
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(
    user?.hostDetails?.yearsOfExperience !== undefined
      ? Number(user.hostDetails.yearsOfExperience)
      : user?.yearsOfExperience !== undefined
      ? Number(user.yearsOfExperience)
      : 0
  );
  const [phone, setPhone] = useState(
    user?.hostDetails?.phone || user?.phone || ""
  );
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  // Profile theme state
  const userIdStr = user?._id || user?.id || "x";
  const themeKey =
    user?.role === "host"
      ? `host_profile_theme_v2_${userIdStr}`
      : `guest_profile_theme_v2_${userIdStr}`;

  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    try {
      return localStorage.getItem(themeKey) || DEFAULT_THEME_KEY;
    } catch {
      return DEFAULT_THEME_KEY;
    }
  });

  const handlePhoneChange = (newVal: string) => {
    setPhone(newVal);
    const originalPhone = user?.hostDetails?.phone || user?.phone || "";
    if (newVal.trim() === originalPhone.trim()) {
      setIsPhoneVerified(true);
      setOtpSent(false);
      setOtp("");
      setOtpMessage("");
    } else {
      setIsPhoneVerified(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setError("Please enter a phone number first");
      return;
    }
    setError("");
    setOtpMessage("");
    setOtpLoading(true);
    const res = await sendPhoneOtpApi(phone);
    setOtpLoading(false);
    if (res.ok) {
      setOtpSent(true);
      setError("");
      if (otpSent) {
        setOtpMessage(
          "OTP has been successfully resent to your phone number!"
        );
      }
    } else {
      setError(res.message || "Failed to send OTP. Check number format.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError("Please enter the verification code");
      return;
    }
    setError("");
    setVerifyLoading(true);
    const res = await verifyPhoneOtpApi(phone, otp);
    setVerifyLoading(false);
    if (res.ok) {
      setIsPhoneVerified(true);
      setOtpSent(false);
      setOtp("");
      setError("");
    } else {
      setError(res.message || "Invalid or expired OTP");
    }
  };

  const [physicalAddress, setPhysicalAddress] = useState(
    user?.hostDetails?.physicalAddress || ""
  );

  const initialRawState = user?.hostDetails?.state || "";
  const isStatePredefined =
    Object.keys(STATE_DISTRICT_MAPPING).includes(initialRawState);
  const initialDropdownState = initialRawState
    ? isStatePredefined
      ? initialRawState
      : "Other"
    : "";
  const [state, setState] = useState(initialDropdownState);
  const [customState, setCustomState] = useState(
    !isStatePredefined ? initialRawState : ""
  );

  const initialRawDistrict = user?.hostDetails?.district || "";
  const isDistrictPredefined = Boolean(
    isStatePredefined &&
      initialRawState &&
      STATE_DISTRICT_MAPPING[initialRawState] &&
      STATE_DISTRICT_MAPPING[initialRawState].includes(initialRawDistrict)
  );
  const initialDropdownDistrict = initialRawDistrict
    ? isDistrictPredefined
      ? initialRawDistrict
      : "Other"
    : "";
  const [district, setDistrict] = useState(initialDropdownDistrict);
  const [customDistrict, setCustomDistrict] = useState(
    !isDistrictPredefined ? initialRawDistrict : ""
  );

  const initialRawCity = user?.hostDetails?.city || "";
  const isCityPredefined = Boolean(
    isDistrictPredefined &&
      (CITY_MAPPING[initialRawDistrict]
        ? CITY_MAPPING[initialRawDistrict].includes(initialRawCity)
        : [initialRawDistrict, "Other"].includes(initialRawCity))
  );
  const initialDropdownCity = initialRawCity
    ? isCityPredefined
      ? initialRawCity
      : "Other"
    : "";
  const [city, setCity] = useState(initialDropdownCity);
  const [customCity, setCustomCity] = useState(
    !isCityPredefined ? initialRawCity : ""
  );

  const [pincode, setPincode] = useState(user?.hostDetails?.pincode || "");
  const [aadhaarFiles, setAadhaarFiles] = useState<File[]>([]);
  const [existingAadhaar, setExistingAadhaar] = useState<any[]>(
    user?.hostDetails?.aadhaarCard || []
  );
  const [aadhaarPreviews, setAadhaarPreviews] = useState<any[]>(
    user?.hostDetails?.aadhaarCard || []
  );

  if (!open) return null;

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      const newFiles = [...aadhaarFiles, ...selected].slice(0, 5);
      setAadhaarFiles(newFiles);
      const newPreviews = newFiles.map((f) => ({
        url: URL.createObjectURL(f),
        type: f.type,
      }));
      setAadhaarPreviews([...existingAadhaar, ...newPreviews]);
      setError("");
      setAadhaarError("");
    }
  };

  const removeAadhaarFile = (index: number) => {
    let updatedExisting = existingAadhaar;
    let updatedFiles = aadhaarFiles;
    if (index < existingAadhaar.length) {
      updatedExisting = existingAadhaar.filter((_, i) => i !== index);
      setExistingAadhaar(updatedExisting);
      setAadhaarPreviews([
        ...updatedExisting,
        ...aadhaarFiles.map((f) => ({
          url: URL.createObjectURL(f),
          type: f.type,
        })),
      ]);
    } else {
      const localIndex = index - existingAadhaar.length;
      updatedFiles = aadhaarFiles.filter((_, i) => i !== localIndex);
      setAadhaarFiles(updatedFiles);
      setAadhaarPreviews([
        ...existingAadhaar,
        ...updatedFiles.map((f) => ({
          url: URL.createObjectURL(f),
          type: f.type,
        })),
      ]);
    }

    const total = updatedExisting.length + updatedFiles.length;
    if (total === 0) {
      setAadhaarError("Please upload your Aadhaar card");
    } else {
      setAadhaarError("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError("File size must be less than 20MB");
        return;
      }
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
      setRemoveAvatar(false);
      setError("");
    }
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    setPreview("");
    setRemoveAvatar(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.role === "host" && user?.hostStatus !== "approved") {
      setShowUnverifiedPopup(true);
      return;
    }

    if (user?.role === "host" && user?.hostStatus === "approved") {
      if (!isPhoneVerified) {
        setError("Please verify your updated phone number first");
        return;
      }
      const finalState = state === "Other" ? customState : state;
      const finalDistrict = district === "Other" ? customDistrict : district;
      const finalCity = city === "Other" ? customCity : city;

      if (!finalState.trim()) {
        setError("Please select or enter your state");
        return;
      }
      if (!finalDistrict.trim()) {
        setError("Please select or enter your district");
        return;
      }
      if (!finalCity.trim()) {
        setError("Please select or enter your city");
        return;
      }
      const totalAadhaarCount = existingAadhaar.length + aadhaarFiles.length;
      if (totalAadhaarCount === 0) {
        setAadhaarError("Please upload your Aadhaar card");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      let avatarS3: { url: string; public_id: string } | null = null;
      if (avatar) {
        const presignedRes = await getPresignedUrl(avatar.name, avatar.type, {
          uploadType: "avatars",
          fileSize: avatar.size,
        });
        const uploadUrl =
          presignedRes?.uploadUrl || presignedRes?.data?.uploadUrl;
        const fileUrl = presignedRes?.fileUrl || presignedRes?.data?.fileUrl;
        const key = presignedRes?.key || presignedRes?.data?.key || "";
        if (!uploadUrl || !fileUrl) {
          throw new Error("Failed to get upload URL for avatar");
        }
        await uploadFileToS3(uploadUrl, avatar);
        avatarS3 = { url: fileUrl, public_id: key };
      }

      const uploadedAadhaar: Array<{ url: string; public_id: string }> = [];
      for (const file of aadhaarFiles) {
        const presignedRes = await getPresignedUrl(file.name, file.type, {
          uploadType: "verification",
          fileSize: file.size,
        });
        const uploadUrl =
          presignedRes?.uploadUrl || presignedRes?.data?.uploadUrl;
        const fileUrl = presignedRes?.fileUrl || presignedRes?.data?.fileUrl;
        const key = presignedRes?.key || presignedRes?.data?.key || "";
        if (!uploadUrl || !fileUrl) {
          throw new Error(
            "Failed to get presigned upload URL for " + file.name
          );
        }
        await uploadFileToS3(uploadUrl, file);
        uploadedAadhaar.push({
          url: fileUrl,
          public_id: key,
        });
      }

      const payload: Record<string, any> = {
        firstname,
        lastname,
        description,
        removeAvatar,
        city: guestCity,
        state: guestState,
        locationCity: guestCity,
        locationState: guestState,
        ...(avatarS3
          ? { avatarUrl: avatarS3.url, avatarPublicId: avatarS3.public_id }
          : {}),
      };

      if (user?.role === "host" && user?.hostStatus === "approved") {
        const finalState = state === "Other" ? customState : state;
        const finalDistrict = district === "Other" ? customDistrict : district;
        const finalCity = city === "Other" ? customCity : city;

        if (
          yearsOfExperience !== undefined &&
          yearsOfExperience !== null &&
          !isNaN(Number(yearsOfExperience))
        ) {
          payload.yearsOfExperience = Math.min(
            30,
            Math.max(0, parseInt(String(yearsOfExperience)))
          );
        }
        payload.phone = phone;
        payload.physicalAddress = physicalAddress;
        payload.district = finalDistrict;
        payload.state = finalState;
        payload.city = finalCity;
        payload.pincode = pincode;
        payload.existingAadhaar = existingAadhaar;
        payload.aadhaar = uploadedAadhaar;
      }

      // Always persist the selected profile theme immediately in localStorage and notify profile page
      try {
        localStorage.setItem(themeKey, selectedTheme);
        window.dispatchEvent(
          new CustomEvent("profile_theme_changed", { detail: selectedTheme })
        );
      } catch {}

      const res = await updateProfileApi(payload);
      if (res?.success || res?.user || res?.data?.user) {
        const updatedUser = res?.user || res?.data?.user || { ...user, ...payload };
        onUpdate?.(updatedUser, res?.isPendingReview);
        onSaved?.(updatedUser);
        onClose();
      } else if (res?.isUnverifiedHost) {
        setShowUnverifiedPopup(true);
      } else {
        setError(res?.message || "Failed to update profile");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "An error occurred while updating profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = activeThemed
    ? "w-full px-5 py-3.5 bg-transparent border border-white/20 rounded-2xl focus:bg-white/5 focus:ring-4 focus:ring-[#C59A2F]/20 focus:border-[#C59A2F] outline-none transition-all font-semibold text-white placeholder-white/40"
    : "w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#C59A2F]/10 focus:border-[#C59A2F] outline-none transition-all font-semibold text-gray-800 dark:bg-neutral-900 dark:text-neutral-200";

  const textareaClass = activeThemed
    ? "w-full px-6 py-4 bg-transparent border border-white/20 rounded-2xl focus:bg-white/5 focus:ring-4 focus:ring-[#C59A2F]/20 focus:border-[#C59A2F] outline-none transition-all resize-none font-medium text-white placeholder-white/40 leading-relaxed"
    : "w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#C59A2F]/10 focus:border-[#C59A2F] outline-none transition-all resize-none font-medium text-gray-700 leading-relaxed dark:bg-neutral-900 dark:text-neutral-300";

  const labelClass = `text-[10px] font-bold uppercase tracking-widest ml-1 ${
    activeThemed ? "text-white" : "text-neutral-800 dark:text-neutral-400"
  }`;

  return (
    <div
      className={`fixed inset-0 z-[1001] flex items-center justify-center p-4 overflow-y-auto ${
        activeThemed
          ? "bg-black/35 backdrop-blur-sm"
          : "bg-black/60 backdrop-blur-sm"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-lg rounded-[2.5rem] relative my-auto overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          activeThemed
            ? ""
            : "bg-white dark:bg-neutral-900 shadow-[0_30px_70px_rgba(0,0,0,0.2)]"
        }`}
        style={
          activeThemed
            ? {
                background: "transparent",
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
              }
            : undefined
        }
      >
        {/* Header */}
        <div
          className={`px-8 py-6 border-b flex items-center justify-between shrink-0 transition-colors ${
            activeThemed
              ? "border-white/15 bg-transparent text-white"
              : "border-gray-50 bg-white dark:bg-neutral-900"
          }`}
        >
          <div className="flex flex-col">
            <h3
              className="text-xl font-bold text-gray-900 dark:text-neutral-100 transition-colors"
              style={activeThemed ? { color: "#ffffff" } : undefined}
            >
              Edit Profile
            </h3>
            <p
              className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5"
              style={
                activeThemed ? { color: "rgba(255,255,255,0.70)" } : undefined
              }
            >
              Customize your public presence
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              activeThemed
                ? "hover:bg-white/10 text-white"
                : "hover:bg-gray-100 text-gray-400 hover:text-gray-900"
            }`}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          <form onSubmit={handleSubmit} className="p-8 pb-20 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-widest border border-red-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-tr from-[#C59A2F] via-[#E6B84D] to-[#C59A2F] rounded-full blur-[2px] opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-32 h-32 rounded-full ring-4 ring-white overflow-hidden shadow-xl bg-white dark:bg-neutral-900 transition-colors">
                  {preview ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-extrabold uppercase tracking-tight bg-[#C59A2F]">
                      {firstname?.charAt(0) || ""}
                      {lastname?.charAt(0) || (!firstname ? "U" : "")}
                    </div>
                  )}
                </div>
                <label
                  className={`absolute inset-0 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 z-10 ${
                    preview
                      ? ""
                      : "bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-none group-hover:backdrop-blur-[2px]"
                  }`}
                >
                  {!preview && (
                    <FiCamera className="text-white w-8 h-8 transform group-hover:scale-110 transition-transform" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {preview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-1 -right-1 w-9 h-9 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-all z-20 border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 cursor-pointer"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="text-center mt-1">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    activeThemed ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  Change Profile Photo
                </p>
                <p className="text-[9px] text-[#C59A2F]/80 dark:text-[#C59A2F]/90 font-bold tracking-wide mt-1 max-w-[240px] mx-auto uppercase">
                  * Please upload a real profile photo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Bio / Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Share your travel stories..."
                className={textareaClass}
              />
            </div>

            {!(user?.role === "host" && user?.hostStatus === "approved") && (
              <div
                className={`space-y-4 pt-4 border-t ${
                  activeThemed
                    ? "border-white/15"
                    : "border-gray-100 dark:border-neutral-800"
                }`}
              >
                <h4
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 ${
                    activeThemed
                      ? "text-white/80"
                      : "text-gray-400 dark:text-neutral-500"
                  }`}
                >
                  Your Location
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>City / Town</label>
                    <input
                      type="text"
                      value={guestCity}
                      onChange={(e) => setGuestCity(e.target.value)}
                      placeholder="e.g. Dehradun, Rishikesh, Manali"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>State / Region</label>
                    <input
                      type="text"
                      value={guestState}
                      onChange={(e) => setGuestState(e.target.value)}
                      placeholder="e.g. Uttarakhand, Himachal Pradesh"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {user?.role === "host" && user?.hostStatus === "approved" && (
              <div
                className={`space-y-6 pt-4 border-t ${
                  activeThemed
                    ? "border-white/15"
                    : "border-gray-100 dark:border-neutral-800"
                }`}
              >
                <div className="space-y-2">
                  <label className={labelClass}>
                    How many experience you have as a host{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={yearsOfExperience}
                    onChange={(e) =>
                      setYearsOfExperience(Number(e.target.value))
                    }
                    className={inputClass}
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option
                        key={i}
                        value={i}
                        className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                      >
                        {i === 0
                          ? "0+ years experience"
                          : `${i}+ years experience`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Current Address</label>
                  <textarea
                    value={physicalAddress}
                    onChange={(e) => setPhysicalAddress(e.target.value)}
                    rows={2}
                    className={textareaClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setDistrict("");
                        setCity("");
                        setCustomState("");
                        setCustomDistrict("");
                        setCustomCity("");
                      }}
                      className={inputClass}
                    >
                      <option
                        value=""
                        className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                      >
                        Select State
                      </option>
                      {Object.keys(STATE_DISTRICT_MAPPING).map((s) => (
                        <option
                          key={s}
                          value={s}
                          className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                    {state === "Other" && (
                      <input
                        type="text"
                        placeholder="Enter custom State *"
                        value={customState}
                        onChange={(e) => setCustomState(e.target.value)}
                        required
                        className={inputClass}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setCity("");
                        setCustomDistrict("");
                        setCustomCity("");
                      }}
                      className={inputClass}
                    >
                      <option
                        value=""
                        className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                      >
                        Select District
                      </option>
                      {state &&
                        state !== "Other" &&
                        STATE_DISTRICT_MAPPING[state]?.map((d) => (
                          <option
                            key={d}
                            value={d}
                            className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                          >
                            {d}
                          </option>
                        ))}
                      {state === "Other" && (
                        <option
                          value="Other"
                          className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                        >
                          Other
                        </option>
                      )}
                    </select>
                    {district === "Other" && (
                      <input
                        type="text"
                        placeholder="Enter custom District *"
                        value={customDistrict}
                        onChange={(e) => setCustomDistrict(e.target.value)}
                        required
                        className={inputClass}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClass}>
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setCustomCity("");
                      }}
                      className={inputClass}
                    >
                      <option
                        value=""
                        className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                      >
                        Select City
                      </option>
                      {state &&
                        district &&
                        state !== "Other" &&
                        district !== "Other" &&
                        (CITY_MAPPING[district]
                          ? CITY_MAPPING[district]
                          : [district, "Other"]
                        ).map((c) => (
                          <option
                            key={c}
                            value={c}
                            className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                          >
                            {c}
                          </option>
                        ))}
                      {(state === "Other" || district === "Other") && (
                        <option
                          value="Other"
                          className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                        >
                          Other
                        </option>
                      )}
                    </select>
                    {city === "Other" && (
                      <input
                        type="text"
                        placeholder="Enter custom City *"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        required
                        className={inputClass}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Pin code</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Phone number</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`flex-1 ${inputClass}`}
                    />
                    {isPhoneVerified ? (
                      <div className="px-4 py-3.5 flex items-center justify-center text-green-600 font-bold bg-green-50 dark:bg-green-950/20 border border-green-150 rounded-2xl text-xs whitespace-nowrap">
                        ✔️ Verified
                      </div>
                    ) : (
                      !otpSent && (
                        <button
                          type="button"
                          disabled={otpLoading || !phone.trim()}
                          onClick={handleSendOTP}
                          className="px-5 py-3.5 bg-[#C59A2F] text-white rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-50 text-xs whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {otpLoading ? "Sending..." : "Send OTP"}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {otpSent && !isPhoneVerified && (
                  <div
                    className={`p-4 rounded-2xl border space-y-3 ${
                      activeThemed
                        ? "bg-white/5 border-white/20"
                        : "bg-[#C59A2F]/5 border-[#C59A2F]/20"
                    }`}
                  >
                    <label className={labelClass}>
                      Enter 6-Digit OTP <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="******"
                        maxLength={6}
                        className={`flex-1 w-full px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 ring-[#C59A2F]/20 font-bold transition-colors text-center font-mono tracking-[0.5em] text-lg ${
                          activeThemed
                            ? "bg-transparent border border-white/25 text-white placeholder-white/40"
                            : "bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-neutral-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={verifyLoading || otp.length < 6}
                        className="px-5 py-3.5 bg-[#C59A2F] text-white rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-50 text-xs whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {verifyLoading ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                    {otpMessage && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-bold transition-all ml-1">
                        {otpMessage}
                      </p>
                    )}
                    <div
                      className={`flex justify-between items-center text-[10px] font-bold uppercase tracking-wide px-1 ${
                        activeThemed ? "text-white/70" : "text-neutral-400"
                      }`}
                    >
                      <span>OTP sent to {phone}</span>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={otpLoading}
                        className="text-[#C59A2F] hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className={labelClass}>Aadhaar Card Documents</label>
                  {aadhaarPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {aadhaarPreviews.map((doc, idx) => {
                        const isPdf =
                          doc.type === "application/pdf" ||
                          (typeof doc.url === "string" &&
                            (doc.url.toLowerCase().endsWith(".pdf") ||
                              doc.url.toLowerCase().includes(".pdf?") ||
                              doc.url.toLowerCase().includes("/pdf")));
                        return (
                          <div
                            key={idx}
                            className={`relative w-full h-24 rounded-xl overflow-hidden border group cursor-pointer ${
                              activeThemed
                                ? "border-white/20 bg-white/5 text-white"
                                : "border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900"
                            }`}
                            onClick={() =>
                              doc.url && window.open(doc.url, "_blank")
                            }
                          >
                            {isPdf ? (
                              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-2">
                                <FiFileText className="text-3xl text-[#C59A2F] mb-1" />
                                <p className="text-[10px] font-bold truncate max-w-full">
                                  PDF Document
                                </p>
                              </div>
                            ) : (
                              <img
                                loading="lazy"
                                decoding="async"
                                src={doc.url}
                                alt={`Aadhaar ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeAadhaarFile(idx);
                              }}
                              className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-10 cursor-pointer"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div
                    className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center ${
                      activeThemed
                        ? "border-white/20 hover:bg-white/5 hover:border-[#C59A2F]"
                        : "border-gray-200 dark:border-neutral-800 hover:bg-[#C59A2F]/5 hover:border-[#C59A2F]/50"
                    }`}
                  >
                    <FiUpload
                      className={`transition-colors text-2xl mb-2 ${
                        activeThemed
                          ? "text-white/60 group-hover:text-[#C59A2F]"
                          : "text-gray-300 group-hover:text-[#C59A2F]"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold ${
                        activeThemed
                          ? "text-white/80"
                          : "text-gray-500 dark:text-neutral-400"
                      }`}
                    >
                      Click to upload new Aadhaar cards
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleAadhaarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {aadhaarError && (
                    <p className="text-red-500 text-xs font-semibold mt-2 ml-1">
                      {aadhaarError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Profile Theme Picker */}
            <div
              className={`space-y-3 pt-4 border-t ${
                activeThemed
                  ? "border-white/15"
                  : "border-gray-100 dark:border-neutral-800"
              }`}
            >
              <label
                className={`${labelClass} flex items-center justify-between`}
              >
                <span>Profile Theme</span>
                <span className="text-[#C59A2F] text-xs font-semibold">
                  {PROFILE_THEMES.find((t) => t.key === selectedTheme)?.emoji}{" "}
                  {PROFILE_THEMES.find((t) => t.key === selectedTheme)?.label}
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                {PROFILE_THEMES.map((theme) => {
                  const isSelected = selectedTheme === theme.key;
                  return (
                    <button
                      key={theme.key}
                      type="button"
                      onClick={() => {
                        setSelectedTheme(theme.key);
                        try {
                          localStorage.setItem(themeKey, theme.key);
                          window.dispatchEvent(
                            new CustomEvent("profile_theme_changed", {
                              detail: theme.key,
                            })
                          );
                        } catch {}
                      }}
                      className={`relative p-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? "border-[#C59A2F] bg-[#C59A2F]/20 shadow-sm"
                          : activeThemed
                          ? "border-white/15 bg-transparent hover:bg-white/10"
                          : "border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-lg leading-none shrink-0">
                        {theme.emoji}
                      </span>
                      <span
                        className={`text-xs font-bold truncate ${
                          isSelected
                            ? "text-[#C59A2F]"
                            : activeThemed
                            ? "text-white"
                            : "text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        {theme.label}
                      </span>
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C59A2F]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-4 px-6 border font-bold rounded-2xl transition-all text-xs uppercase tracking-widest cursor-pointer ${
                  activeThemed
                    ? "border-white/20 text-white bg-transparent hover:bg-white/10"
                    : "border-gray-100 text-gray-500 hover:bg-gray-50 dark:border-neutral-800 dark:text-neutral-400"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  (user?.role === "host" &&
                    user?.hostStatus === "approved" &&
                    !isPhoneVerified)
                }
                className="flex-[2] py-4 px-6 bg-[#C59A2F] text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(197,154,47,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] cursor-pointer"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Unverified Host Profile Edit Restriction Popup Modal */}
      {showUnverifiedPopup && (
        <AnimatePresence>
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 ${
                activeThemed
                  ? "bg-black/35 backdrop-blur-sm"
                  : "bg-slate-900/60 backdrop-blur-md"
              }`}
              onClick={() => setShowUnverifiedPopup(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 text-center space-y-6 transition-colors ${
                activeThemed
                  ? ""
                  : "bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800"
              }`}
              style={
                activeThemed
                  ? {
                      background: "transparent",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.22)",
                      boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
                    }
                  : undefined
              }
            >
              <button
                type="button"
                onClick={() => setShowUnverifiedPopup(false)}
                className={`absolute top-5 right-5 w-9 h-9 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  activeThemed
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-slate-50 dark:bg-neutral-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FiX size={18} />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center mx-auto text-[#C59A2F] shadow-inner">
                <FiAlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-[#C59A2F] uppercase tracking-widest block">
                  Account Restricted
                </span>
                <h3
                  className="text-xl font-black text-slate-900 dark:text-neutral-100 tracking-tight"
                  style={activeThemed ? { color: "#ffffff" } : undefined}
                >
                  Host Verification Required
                </h3>
                <p
                  className="text-xs font-semibold text-slate-600 dark:text-neutral-300 leading-relaxed px-2"
                  style={
                    activeThemed
                      ? { color: "rgba(255,255,255,0.85)" }
                      : undefined
                  }
                >
                  You can&apos;t update your profile until your host account is
                  verified and approved by an admin. Once approved, you will be
                  able to update your profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUnverifiedPopup(false)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#C59A2F] text-white font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#C59A2F]/20"
              >
                Understood
              </button>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
