"use client";

import { SocialButton } from "@/mini-components/ui/social-button";
import type { SocialAuthButtonsProps } from "./types";

export function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  const actionText =
    mode === "login" ? "Sign in with Google" : "Sign up with Google";

  return (
    <div className="w-full">
      <SocialButton
        provider="google"
        label={actionText}
        onClick={() => console.log("Google auth triggered")}
      />
    </div>
  );
}
