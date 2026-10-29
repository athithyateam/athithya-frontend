"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { signupInitiateApi, signupCompleteApi, googleSigninApi } from "@/lib/api/auth-api";
import { GoogleIcon } from "./google-icon";

const GOLD = "#d4af37";
const ROLE_TABS = [
  { value: "guest" as const, label: "Guest" },
  { value: "host" as const, label: "Host" },
];

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export function RegisterForm({ onSwitchToLogin, onClose }: RegisterFormProps) {
  const { setUser, fetchUser, authRole } = useAuthStore();
  const [role, setRole] = useState<"guest" | "host">(authRole || "guest");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [screen, setScreen] = useState<"register" | "otp">("register");
  const [otp, setOtp] = useState("");

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await signupInitiateApi({ firstname, lastname, email, password: pwd, role });
      if (!res.ok) {
        setErr(res.message || "Could not send OTP.");
        return;
      }
      setScreen("otp");
    } catch {
      setErr("Failed to initiate registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setErr("");
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setErr("Google OAuth is not configured on this environment. Please sign up with email.");
      return;
    }
    setLoading(true);
    try {
      const res = await googleSigninApi({ token: clientId, role });
      if (!res?.ok) {
        setErr(res?.message || "Google register failed");
        return;
      }
      const token = res?.data?.token || res?.data?.data?.token;
      if (token) {
        localStorage.setItem("auth_token", token);
        await fetchUser();
        onClose();
      }
    } catch {
      setErr("Google register error");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await signupCompleteApi({ firstname, lastname, email, password: pwd, role, otp: otp.trim() });
      if (!res.ok) {
        setErr(res.message || "Invalid OTP.");
        return;
      }
      const token = res.data?.token || res.data?.data?.token;
      const userObj = res.data?.user || res.data?.data?.user;
      if (token) {
        localStorage.setItem("auth_token", token);
        if (userObj) setUser(userObj, token);
        await fetchUser();
      }
      onClose();
    } catch {
      setErr("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setErr("");
    setInfo("");
    setLoading(true);
    try {
      const res = await signupInitiateApi({ firstname, lastname, email, password: pwd, role });
      if (!res.ok) setErr(res.message || "Could not resend OTP.");
      else setInfo("OTP resent to your email.");
    } catch {
      setErr("Could not resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (screen === "otp") {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: GOLD }}>Verify Email</h3>
        <p className="text-sm text-gray-500 mb-4 dark:text-neutral-400">
          Enter the 6-digit OTP sent to <span className="font-medium text-neutral-800 dark:text-neutral-200">{email}</span>.
        </p>
        {err && <div className="mb-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">{err}</div>}
        {info && <div className="mb-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded px-3 py-2">{info}</div>}
        <form onSubmit={submitOtp} className="space-y-4">
          <input
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full border rounded-lg p-2 dark:bg-neutral-800 dark:text-neutral-100 tracking-widest text-center text-lg font-bold"
            required
            style={{ borderColor: GOLD }}
          />
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => { setErr(""); setInfo(""); setScreen("register"); }} className="underline cursor-pointer" style={{ color: GOLD }}>Back</button>
            <button type="button" onClick={resendOtp} disabled={loading} className="underline cursor-pointer" style={{ color: GOLD }}>Resend OTP</button>
          </div>
          <button type="submit" disabled={loading || otp.length !== 6} className="w-full cursor-pointer text-white py-2 rounded-lg disabled:opacity-70 transition font-medium" style={{ backgroundColor: GOLD }}>
            {loading ? "Verifying..." : "Verify & Create Account"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="flex border-b mb-4" style={{ borderColor: `${GOLD}66` }}>
        <button type="button" className="w-1/2 py-2 cursor-pointer text-center font-semibold text-gray-400 dark:text-neutral-500 hover:opacity-80" onClick={onSwitchToLogin}>Login</button>
        <button type="button" className="w-1/2 py-2 cursor-pointer text-center font-semibold border-b-2" style={{ color: GOLD, borderColor: GOLD }}>Create an account</button>
      </div>
      <div className="flex mb-4 rounded-lg overflow-hidden border" style={{ borderColor: `${GOLD}66` }}>
        {ROLE_TABS.map((t) => (
          <button key={t.value} type="button" onClick={() => setRole(t.value)} className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${role === t.value ? "bg-[#d4af37] text-white" : "bg-white dark:bg-neutral-800 text-[#d4af37]"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {err && <div className="mb-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">{err}</div>}
      <form onSubmit={submitRegister} className="space-y-4">
        <button type="button" onClick={handleGoogleSignup} className="flex items-center justify-center gap-2 w-full py-2 border rounded-lg transition hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer" style={{ borderColor: GOLD, color: GOLD }}>
          <GoogleIcon className="w-4 h-4" /><span>Sign up with Google</span>
        </button>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="First name" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="border rounded-lg p-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 focus:outline-none" required />
          <input type="text" placeholder="Last name" value={lastname} onChange={(e) => setLastname(e.target.value)} className="border rounded-lg p-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 focus:outline-none" required />
        </div>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 focus:outline-none" required />
        <div className="relative">
          <input type={showPwd ? "text" : "password"} placeholder="Password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300 pr-10 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 focus:outline-none" required minLength={6} />
          <button type="button" className="absolute right-3 top-2.5 cursor-pointer" style={{ color: GOLD }} onClick={() => setShowPwd((v) => !v)}>{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        <button type="submit" disabled={loading} className="w-full cursor-pointer text-white py-2 rounded-lg disabled:opacity-70 transition font-medium" style={{ backgroundColor: GOLD }}>
          {loading ? "Sending OTP..." : "Continue"}
        </button>
      </form>
    </>
  );
}
