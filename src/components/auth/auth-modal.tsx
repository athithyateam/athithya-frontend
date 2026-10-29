"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

const GOLD = "#d4af37";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal } = useAuthStore();

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = "";
  }, []);

  const handleClose = useCallback(() => {
    unlockScroll();
    closeAuthModal();
  }, [unlockScroll, closeAuthModal]);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev || "";
    };
  }, [isAuthModalOpen, handleClose]);

  if (!isAuthModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-6 relative mx-4 dark:bg-neutral-900 transition-colors"
      >
        {/* Close Button matching athithya-app */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 cursor-pointer hover:opacity-80 font-bold text-lg select-none"
          style={{ color: GOLD }}
          aria-label="Close"
        >
          ✕
        </button>

        {authModalTab === "login" ? (
          <LoginForm
            onSwitchToRegister={() => openAuthModal("register")}
            onClose={handleClose}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => openAuthModal("login")}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}
