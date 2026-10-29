"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, X, FileText } from "lucide-react";
import { submitHostVerificationApi, sendPhoneOtpApi, verifyPhoneOtpApi } from "@/lib/api/auth-api";
import { getPresignedUrl } from "@/lib/api/posts-api";
import { uploadFileToS3 } from "@/lib/api/client";
import { STATE_DISTRICT_MAPPING, CITY_MAPPING } from "@/data/location-data";
import { compressImage } from "@/lib/image-helper";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";

const GOLD = "#d4af37";

export function HostVerificationModal({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const { showToast } = useFeedbackStore();
  const { fetchUser } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [customState, setCustomState] = useState("");
  const [customDistrict, setCustomDistrict] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Array<{ url: string; type: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [agreed, setAgreed] = useState(false);

  const handleSendOTP = async () => {
    if (!phone.trim()) return setErr("Please enter a phone number first");
    setErr("");
    setOtpMessage("");
    setOtpLoading(true);
    const res = await sendPhoneOtpApi(phone);
    setOtpLoading(false);
    if (res.ok) {
      if (otpSent) setOtpMessage("OTP has been successfully resent to your phone number!");
      setOtpSent(true);
    } else setErr(res.message || "Failed to send OTP. Check number format.");
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) return setErr("Please enter the verification code");
    setErr("");
    setVerifyLoading(true);
    const res = await verifyPhoneOtpApi(phone, otp);
    setVerifyLoading(false);
    if (res.ok) {
      setIsPhoneVerified(true);
      setOtpSent(false);
    } else setErr(res.message || "Invalid or expired OTP");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      const nextFiles = [...files, ...selected].slice(0, 5);
      setFiles(nextFiles);
      setPreviews(nextFiles.map((f) => ({ url: URL.createObjectURL(f), type: f.type })));
    }
  };

  const removeFile = (index: number) => {
    if (previews[index]) URL.revokeObjectURL(previews[index].url);
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalState = state === "Other" ? customState : state;
    const finalDistrict = district === "Other" ? customDistrict : district;
    const finalCity = city === "Other" ? customCity : city;

    if (!phone.trim()) return setErr("Please enter your phone number");
    if (!isPhoneVerified) return setErr("Please verify your phone number via OTP first");
    if (!address.trim()) return setErr("Please enter your current address");
    if (!finalState.trim()) return setErr("Please select or enter your state");
    if (!finalDistrict.trim()) return setErr("Please select or enter your district");
    if (!finalCity.trim()) return setErr("Please select or enter your city");
    if (!pincode.trim()) return setErr("Please enter your pin code");
    if (yearsOfExperience === "") return setErr("Please select your years of experience as a host");
    if (files.length === 0) return setErr("Please upload your adhar card");

    setErr("");
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token") || undefined;
      const uploadedAadhaar: Array<{ url: string; public_id: string }> = [];
      for (const file of files) {
        let uploadFile = file;
        if (file.type.startsWith("image/")) {
          try {
            uploadFile = await compressImage(file);
          } catch {
            showToast(`Image compression failed for ${file.name}. Uploading original.`, "info");
          }
        }
        const presignedRes = await getPresignedUrl(uploadFile.name, uploadFile.type, { token, type: "verification" });
        if (!presignedRes?.success && !presignedRes?.uploadUrl) {
          throw new Error("Failed to get presigned upload URL for " + uploadFile.name);
        }
        await uploadFileToS3(presignedRes.uploadUrl, uploadFile);
        uploadedAadhaar.push({ url: presignedRes.fileUrl, public_id: presignedRes.key });
      }

      const res = await submitHostVerificationApi({
        phone,
        physicalAddress: address,
        district: finalDistrict,
        state: finalState,
        city: finalCity,
        pincode,
        yearsOfExperience: Number(yearsOfExperience),
        aadhaar: uploadedAadhaar,
      });

      if (res.ok) {
        await fetchUser();
        setStep(2);
        onSuccess?.();
      } else setErr(res.message || "Failed to submit verification details");
    } catch (error: any) {
      setErr(error?.message || "An error occurred while uploading documents.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center relative border border-gray-100 dark:border-neutral-800">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="text-white w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-3 dark:text-white" style={{ color: GOLD }}>Application Submitted!</h2>
          <p className="text-gray-600 dark:text-neutral-400 mb-2">Your verification details have been sent to our team.</p>
          <p className="text-gray-500 dark:text-neutral-500 text-sm mb-8">We&apos;ll review them and notify you within 24–48 hours.</p>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-white shadow-lg cursor-pointer" style={{ backgroundColor: GOLD }}>Got it</button>
        </div>
      </div>
    );
  }

  const districts = state && state !== "Other" ? STATE_DISTRICT_MAPPING[state] || [] : state === "Other" ? ["Other"] : [];
  const cities = state && district && state !== "Other" && district !== "Other" ? CITY_MAPPING[district] || [district, "Other"] : state === "Other" || district === "Other" ? ["Other"] : [];

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-gray-100 dark:border-neutral-800 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6 border-b dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold dark:text-white" style={{ color: GOLD }}>Host Verification</h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400">Complete these steps to start hosting</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full cursor-pointer"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {err && <div className="p-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl">{err}</div>}
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-neutral-300">Phone Number <span className="text-red-500">*</span></label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 00000 00000" required disabled={isPhoneVerified} className="flex-1 bg-gray-50 dark:bg-neutral-800 rounded-xl p-3 text-neutral-900 dark:text-white disabled:opacity-75" />
              {isPhoneVerified ? (
                <div className="flex items-center justify-center gap-1.5 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl font-bold text-sm"><CheckCircle2 size={16} /> Verified</div>
              ) : !otpSent && (
                <button type="button" onClick={handleSendOTP} disabled={otpLoading || !phone.trim()} className="px-4 py-3 rounded-xl font-bold text-white shadow-md disabled:opacity-50 cursor-pointer" style={{ backgroundColor: GOLD }}>{otpLoading ? "Sending..." : "Send OTP"}</button>
              )}
            </div>
          </div>
          {otpSent && !isPhoneVerified && (
            <div className="bg-[#d4af37]/5 dark:bg-neutral-800/40 p-4 rounded-xl border border-[#d4af37]/20 space-y-3">
              <label className="block text-sm font-semibold dark:text-neutral-300">Enter 6-Digit OTP <span className="text-red-500">*</span></label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="******" maxLength={6} className="flex-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-3 text-center font-mono tracking-[0.5em] text-lg" />
                <button type="button" onClick={handleVerifyOTP} disabled={verifyLoading || otp.length < 6} className="px-5 py-3 rounded-xl font-bold text-white shadow-md disabled:opacity-50 cursor-pointer" style={{ backgroundColor: GOLD }}>{verifyLoading ? "Verifying..." : "Verify"}</button>
              </div>
              {otpMessage && <p className="text-xs text-green-600 font-bold">{otpMessage}</p>}
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">An OTP has been sent to {phone}</span>
                <button type="button" onClick={handleSendOTP} disabled={otpLoading} className="font-bold hover:underline cursor-pointer" style={{ color: GOLD }}>Resend</button>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-neutral-300">Current Address <span className="text-red-500">*</span></label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your full address..." required rows={2} className="w-full bg-gray-50 dark:bg-neutral-800 rounded-xl p-3 text-neutral-900 dark:text-white resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">State *</label>
              <select value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); setCity(""); }} className="w-full bg-gray-50 dark:bg-neutral-800 rounded-xl p-2.5 text-sm">
                <option value="">Select State</option>
                {Object.keys(STATE_DISTRICT_MAPPING).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {state === "Other" && <input type="text" placeholder="Enter State *" value={customState} onChange={(e) => setCustomState(e.target.value)} className="w-full mt-2 bg-gray-50 dark:bg-neutral-800 rounded-xl p-2.5 text-sm" required />}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">District *</label>
              <select value={district} onChange={(e) => { setDistrict(e.target.value); setCity(""); }} className="w-full bg-gray-50 dark:bg-neutral-800 rounded-xl p-2.5 text-sm">
                <option value="">Select District</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {district === "Other" && <input type="text" placeholder="Enter District *" value={customDistrict} onChange={(e) => setCustomDistrict(e.target.value)} className="w-full mt-2 bg-gray-50 dark:bg-neutral-800 rounded-xl p-2.5 text-sm" required />}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">City *</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-800 rounded-xl p-2.5 text-sm">
                <option value="">Select City</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {city === "Other" && <input type="text" placeholder="Enter City *" value={customCity} onChange={(e) => setCustomCity(e.target.value)} className="w-full mt-2 bg-gray-50 dark:bg-neutral-800 rounded-xl p-2.5 text-sm" required />}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Pin Code *</label>
              <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit PIN code" required className="w-full bg-gray-50 dark:bg-neutral-800 rounded-xl p-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Years of Experience *</label>
              <select value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-800 rounded-xl p-2.5 text-sm">
                <option value="">Select experience</option>
                {Array.from({ length: 31 }, (_, i) => <option key={i} value={String(i)}>{i}+ years experience</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-neutral-300">Aadhaar Card (Front & Back) <span className="text-red-500">*</span></label>
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {previews.map((prev, i) => (
                  <div key={i} className="relative h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
                    {prev.type === "application/pdf" ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400"><FileText className="text-[#d4af37] mb-1" /><span className="text-[10px] font-bold">PDF Document</span></div>
                    ) : <img src={prev.url} alt="" className="w-full h-full object-cover" />}
                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full text-white cursor-pointer"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            {files.length < 5 && (
              <label className="w-full h-24 bg-gray-50 dark:bg-neutral-800 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#d4af37]/50">
                <UploadCloud className="text-gray-400 mb-1" size={24} />
                <span className="text-xs text-gray-500">Click to upload documents (PDF, JPG, PNG)</span>
                <input type="file" className="hidden" accept="image/*,.pdf" multiple onChange={handleFileChange} />
              </label>
            )}
          </div>
          <div className="flex items-start gap-3">
            <input type="checkbox" id="agreeTerms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4" required />
            <label htmlFor="agreeTerms" className="text-xs text-gray-600 dark:text-neutral-400 leading-tight">I agree to Athithya&apos;s Terms and Conditions regarding verification, and I confirm that I am willingly providing these details.</label>
          </div>
          <button type="submit" disabled={loading || !agreed || !isPhoneVerified} className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg disabled:opacity-60 cursor-pointer" style={{ backgroundColor: GOLD }}>
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default HostVerificationModal;
