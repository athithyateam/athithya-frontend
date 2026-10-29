"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { signinApi, forgotPasswordApi, resetPasswordApi, googleSigninApi } from "@/lib/api/auth-api";
import { GoogleIcon } from "./google-icon";

const GOLD = "#d4af37";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

export function LoginForm({ onSwitchToRegister, onClose }: LoginFormProps) {
  const { setUser, fetchUser } = useAuthStore();
  const [view, setView] = useState<"login" | "forgot-email" | "reset-password">("login");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [otp, setOtp] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErr("");
    setLoading(true);
    try {
      const res = await signinApi({ email, password: pwd });
      if (!res?.ok) {
        setErr(res?.message || "Invalid email or password");
        return;
      }
      const token = res?.data?.token || res?.data?.data?.token;
      const userObj = res?.data?.user || res?.data?.data?.user;
      if (!token) {
        setErr("Authentication token not received");
        return;
      }
      localStorage.setItem("auth_token", token);
      if (userObj) setUser(userObj, token);
      await fetchUser();
      onClose();
    } catch {
      setErr("Unexpected login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setErr("");
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setErr("Google OAuth is not configured on this environment. Please login with email & password.");
      return;
    }
    setLoading(true);
    try {
      const res = await googleSigninApi({ token: clientId });
      if (!res?.ok) {
        setErr(res?.message || "Google login failed");
        return;
      }
      const token = res?.data?.token || res?.data?.data?.token;
      if (token) {
        localStorage.setItem("auth_token", token);
        await fetchUser();
        onClose();
      }
    } catch {
      setErr("Google login error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErr("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await forgotPasswordApi({ email });
      if (!res?.ok) {
        setErr(res?.message || "Failed to send OTP");
        return;
      }
      setSuccessMsg("OTP sent successfully to your email.");
      setTimeout(() => {
        setView("reset-password");
        setSuccessMsg("");
      }, 1200);
    } catch {
      setErr("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (pwd !== confirmPwd) return setErr("Passwords do not match");
    setErr("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await resetPasswordApi({ email, otp, newPassword: pwd });
      if (!res?.ok) {
        setErr(res?.message || "Failed to reset password");
        return;
      }
      setSuccessMsg("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        setView("login");
        setPwd("");
        setConfirmPwd("");
        setOtp("");
        setSuccessMsg("");
      }, 1500);
    } catch {
      setErr("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {err && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">{err}</div>}
      {successMsg && <div className="mb-4 text-sm bg-green-50 text-green-700 border border-green-200 rounded px-3 py-2">{successMsg}</div>}

      {view === "login" && (
        <>
          <div className="flex border-b mb-6" style={{ borderColor: `${GOLD}66` }}>
            <button type="button" className="w-1/2 py-2 text-center font-semibold border-b-2" style={{ color: GOLD, borderColor: GOLD }}>Login</button>
            <button type="button" className="w-1/2 py-2 text-center font-semibold text-gray-400 dark:text-neutral-500 hover:opacity-80 transition-colors cursor-pointer" onClick={onSwitchToRegister}>Create an account</button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 w-full py-2 border rounded-lg transition hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer" style={{ borderColor: GOLD, color: GOLD }}>
              <GoogleIcon className="w-4 h-4" /><span>Login with Google</span>
            </button>
            <div className="text-center text-gray-400 text-sm">OR</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full border rounded-lg p-2 focus:outline-none bg-white text-neutral-900 placeholder:text-neutral-400 dark:bg-neutral-800 dark:text-neutral-100" style={{ borderColor: GOLD }} />
            <div>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" required className="w-full border rounded-lg p-2 pr-10 focus:outline-none bg-white text-neutral-900 placeholder:text-neutral-400 dark:bg-neutral-800 dark:text-neutral-100" style={{ borderColor: GOLD }} />
                <button type="button" className="absolute right-3 top-2.5 cursor-pointer" style={{ color: GOLD }} onClick={() => setShowPwd((v) => !v)} aria-label="Toggle password">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-left mt-3">
                <button type="button" onClick={() => { setErr(""); setView("forgot-email"); }} className="text-sm hover:underline cursor-pointer" style={{ color: GOLD }}>Forgot Password?</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="cursor-pointer w-full text-white py-2 rounded-lg disabled:opacity-70 transition font-medium" style={{ backgroundColor: GOLD }}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </>
      )}

      {view === "forgot-email" && (
        <>
          <div className="flex items-center mb-6">
            <button type="button" onClick={() => { setErr(""); setView("login"); }} className="mr-3 hover:opacity-80 transition cursor-pointer" style={{ color: GOLD }}><ArrowLeft size={18} /></button>
            <h2 className="text-xl font-semibold" style={{ color: GOLD }}>Forgot Password</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4 dark:text-neutral-400">Enter your email address to reset your password.</p>
          <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full border rounded-lg p-2 focus:outline-none bg-white text-neutral-900 placeholder:text-neutral-400 dark:bg-neutral-800 dark:text-neutral-100" style={{ borderColor: GOLD }} />
            <button type="submit" disabled={loading} className="cursor-pointer w-full text-white py-2 rounded-lg disabled:opacity-70 transition font-medium" style={{ backgroundColor: GOLD }}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </>
      )}

      {view === "reset-password" && (
        <>
          <div className="flex items-center mb-6">
            <button type="button" onClick={() => { setErr(""); setView("forgot-email"); }} className="mr-3 hover:opacity-80 transition cursor-pointer" style={{ color: GOLD }}><ArrowLeft size={18} /></button>
            <h2 className="text-xl font-semibold" style={{ color: GOLD }}>Reset Password</h2>
          </div>
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1 dark:text-neutral-400">OTP Code</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" required className="w-full border rounded-lg p-2 focus:outline-none bg-white text-neutral-900 placeholder:text-neutral-400 dark:bg-neutral-800 dark:text-neutral-100" style={{ borderColor: GOLD }} />
            </div>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="New Password" required className="w-full border rounded-lg p-2 pr-10 focus:outline-none bg-white text-neutral-900 placeholder:text-neutral-400 dark:bg-neutral-800 dark:text-neutral-100" style={{ borderColor: GOLD }} />
              <button type="button" className="absolute right-3 top-2.5 cursor-pointer" style={{ color: GOLD }} onClick={() => setShowPwd((v) => !v)}>{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <div className="relative">
              <input type={showConfirmPwd ? "text" : "password"} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Confirm New Password" required className="w-full border rounded-lg p-2 pr-10 focus:outline-none bg-white text-neutral-900 placeholder:text-neutral-400 dark:bg-neutral-800 dark:text-neutral-100" style={{ borderColor: GOLD }} />
              <button type="button" className="absolute right-3 top-2.5 cursor-pointer" style={{ color: GOLD }} onClick={() => setShowConfirmPwd((v) => !v)}>{showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <button type="submit" disabled={loading} className="cursor-pointer w-full text-white py-2 rounded-lg disabled:opacity-70 transition font-medium" style={{ backgroundColor: GOLD }}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </>
      )}
    </>
  );
}
