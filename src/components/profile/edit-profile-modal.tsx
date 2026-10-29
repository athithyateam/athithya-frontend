"use client";

import { useState } from "react";
import { X, Camera, Check, Loader2 } from "lucide-react";
import { PROFILE_THEMES } from "@/data/profile-themes";
import { updateProfileApi } from "@/lib/api/users-api";
import { sendPhoneOtpApi, verifyPhoneOtpApi } from "@/lib/api/auth-api";
import { getPresignedUrl, uploadFileToS3 } from "@/lib/api/posts-api";
import { useFeedbackStore } from "@/stores/feedback-store";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: Record<string, any>;
  onSaved: (updated: Record<string, any>) => void;
}

export function EditProfileModal({ open, onClose, user, onSaved }: EditProfileModalProps) {
  const { showToast } = useFeedbackStore();
  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [city, setCity] = useState(user?.location?.city || user?.city || "");
  const [stateName, setStateName] = useState(user?.location?.state || user?.state || "Uttarakhand");
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears || "");
  const [profileTheme, setProfileTheme] = useState(user?.profileTheme || "mountain");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || user?.avatar || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [phone, setPhone] = useState(user?.phone || "");
  const [phoneVerified, setPhoneVerified] = useState(Boolean(user?.phoneVerified));
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;
  const isHost = user?.role === "host" || user?.role === "admin";

  const handleAvatarUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const presigned = await getPresignedUrl(file.name, file.type, {
        fileSize: file.size,
        uploadType: "avatars",
      });
      const uploadUrl = presigned?.uploadUrl || presigned?.data?.uploadUrl;
      const fileUrl = presigned?.fileUrl || presigned?.data?.fileUrl;
      if (!uploadUrl || !fileUrl) throw new Error("Failed to get upload URL");
      await uploadFileToS3(uploadUrl, file);
      setAvatarUrl(fileUrl);
      showToast("Profile photo uploaded!", "success");
    } catch (err: any) {
      showToast(err?.message || "Avatar upload failed", "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) return showToast("Enter a valid 10-digit phone number", "warning");
    const res = await sendPhoneOtpApi(phone);
    if (res.ok) {
      setOtpSent(true);
      showToast("OTP sent to your phone", "success");
    } else {
      showToast(res.message || "Failed to send OTP", "error");
    }
  };

  const handleVerifyOtp = async () => {
    const res = await verifyPhoneOtpApi(phone, otp);
    if (res.ok) {
      setPhoneVerified(true);
      setOtpSent(false);
      showToast("Phone verified!", "success");
    } else {
      showToast(res.message || "Invalid OTP", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        firstname,
        lastname,
        bio,
        profileTheme,
        phone,
        location: { city, state: stateName, country: "India" },
      };
      if (avatarUrl) payload.avatar = { url: avatarUrl };
      if (isHost && experienceYears !== "") payload.experienceYears = Number(experienceYears);

      const res = await updateProfileApi(payload);
      const updatedUser = res?.user || res?.data?.user || { ...user, ...payload };
      showToast("Profile updated successfully!", "success");
      onSaved(updatedUser);
      onClose();
    } catch (err: any) {
      showToast(err?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSave}
        className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <h3 className="text-xl font-black">Edit Profile</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <X size={18} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#C59A2F] text-white flex items-center justify-center font-black text-2xl shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (firstname?.charAt(0) || "U").toUpperCase()
            )}
            <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center cursor-pointer">
              {uploadingAvatar ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarUpload(e.target.files?.[0])} />
            </label>
          </div>
          <div className="text-xs text-neutral-500">
            <p className="font-bold text-neutral-800 dark:text-neutral-200">Profile Picture</p>
            <p>Click avatar to upload a JPG, PNG, or WEBP photo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">First Name</label>
            <input value={firstname} onChange={(e) => setFirstname(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Last Name</label>
            <input value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Share your love for travel and mountain culture..." className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">City / Town</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Rishikesh" className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">State</label>
            <input value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm" />
          </div>
        </div>

        {isHost && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Years of Experience</label>
              <input type="number" min={0} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Phone Verification</label>
              <div className="flex gap-2">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit phone" className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm" />
                {!phoneVerified && (
                  <button type="button" onClick={handleSendOtp} className="px-3 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold">
                    OTP
                  </button>
                )}
              </div>
              {otpSent && (
                <div className="flex gap-2 mt-2">
                  <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="flex-1 px-3 py-1.5 rounded-xl border text-xs" />
                  <button type="button" onClick={handleVerifyOtp} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                    Verify
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Profile Banner Theme</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {PROFILE_THEMES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setProfileTheme(t.key)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition ${
                  profileTheme === t.key ? "border-[#C59A2F] bg-[#C59A2F]/10 text-[#C59A2F]" : "border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <span>{t.emoji} {t.label}</span>
                {profileTheme === t.key && <Check size={12} />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs font-bold">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
