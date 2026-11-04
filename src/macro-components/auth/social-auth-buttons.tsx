"use client";

import { useRouter } from "next/navigation";
import { SocialButton } from "@/mini-components/ui/social-button";
import { promptGoogleLogin } from "@/lib/google-auth";
import { googleSigninApi } from "@/lib/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";
import type { SocialAuthButtonsProps } from "./types";

export function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  const router = useRouter();
  const { setUser, fetchUser } = useAuthStore();
  const actionText =
    mode === "login" ? "Sign in with Google" : "Sign up with Google";

  const handleGoogle = async () => {
    await promptGoogleLogin({
      onSuccess: async (accessToken) => {
        const role = mode === "register" ? "guest" : undefined;
        const res = await googleSigninApi({ token: accessToken, role });
        if (res?.ok) {
          const token = res?.data?.token || res?.data?.data?.token;
          const userObj = res?.data?.user || res?.data?.data?.user;
          if (token) {
            localStorage.setItem("auth_token", token);
            if (userObj) setUser(userObj, token);
            await fetchUser();
            router.push("/");
          }
        }
      },
    });
  };

  return (
    <div className="w-full">
      <SocialButton
        provider="google"
        label={actionText}
        onClick={handleGoogle}
      />
    </div>
  );
}
