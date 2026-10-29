"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { routes } from "@/config/navigation";
import { BrandLogo } from "@/mini-components/ui/brand-logo";
import { SocialAuthButtons } from "./social-auth-buttons";
import type { AuthMode } from "./types";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("register");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Auth submit:", {
      mode,
      firstName,
      lastName,
      email,
      passwordLength: password.length,
      agreeTerms,
      rememberMe,
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const isRegister = mode === "register";

  return (
    <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 py-8 md:py-10 text-neutral-100">
      {/* Chrome/Safari Autofill Dark Inset Fix */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.08) inset !important;
              box-shadow: 0 0 0 1000px rgba(255,255,255,0.08) inset !important;
              -webkit-text-fill-color: #ffffff !important;
              caret-color: #ffffff !important;
              transition: background-color 5000000s ease-in-out 0s !important;
            }
          `,
        }}
      />

      {/* Mobile Brand Header (Visible on mobile screens) */}
      <div className="flex md:hidden items-center justify-start w-full pb-5 mb-5 border-b border-[#1F1F24]">
        <BrandLogo iconSize={26} />
      </div>

      {/* Title & Toggle Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
          {isRegister ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-[#DF9E26] hover:text-[#F3B336] font-medium underline underline-offset-4 cursor-pointer transition-colors"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-[#DF9E26] hover:text-[#F3B336] font-medium underline underline-offset-4 cursor-pointer transition-colors"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>

      {/* Main Authentication Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields (Sign-up only) */}
        {isRegister && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="firstName"
                className="block text-xs font-medium text-neutral-300"
              >
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required={isRegister}
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-[#222226] focus:border-[#DF9E26] focus:ring-1 focus:ring-[#DF9E26] text-sm text-white placeholder-neutral-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lastName"
                className="block text-xs font-medium text-neutral-300"
              >
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required={isRegister}
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-[#222226] focus:border-[#DF9E26] focus:ring-1 focus:ring-[#DF9E26] text-sm text-white placeholder-neutral-500 transition-all outline-none"
              />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-neutral-300"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#121215] border border-[#222226] focus:border-[#DF9E26] focus:ring-1 focus:ring-[#DF9E26] text-sm text-white placeholder-neutral-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-neutral-300"
          >
            {isRegister ? "Create password" : "Password"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#121215] border border-[#222226] focus:border-[#DF9E26] focus:ring-1 focus:ring-[#DF9E26] text-sm text-white placeholder-neutral-500 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Conditional Options: Terms (Register) or Remember/Forgot (Login) */}
        {isRegister ? (
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="terms"
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[#222226] bg-[#121215] text-[#DF9E26] focus:ring-[#DF9E26] focus:ring-offset-0 cursor-pointer accent-[#DF9E26]"
            />
            <label
              htmlFor="terms"
              className="text-xs text-neutral-400 cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-neutral-300 hover:text-white underline underline-offset-2"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-neutral-300 hover:text-white underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-neutral-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#222226] bg-[#121215] text-[#DF9E26] focus:ring-[#DF9E26] focus:ring-offset-0 cursor-pointer accent-[#DF9E26]"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[#DF9E26] hover:text-[#F3B336] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {/* Athithya Golden Primary Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-[#08080A] bg-[#DF9E26] hover:bg-[#ECAE36] active:scale-[0.99] transition-all duration-200 shadow-[0_4px_20px_rgba(223,158,38,0.28)] hover:shadow-[0_6px_26px_rgba(223,158,38,0.4)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-[#08080A] border-t-transparent rounded-full animate-spin" />
          ) : isRegister ? (
            "Create account"
          ) : (
            "Sign In to Athithya"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#1F1F24]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-[#0D0D10] px-3 text-neutral-500 font-medium">
            {isRegister ? "Or register with" : "Or continue with"}
          </span>
        </div>
      </div>

      {/* Social Logins */}
      <SocialAuthButtons mode={mode} />
    </div>
  );
}
