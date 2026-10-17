"use client";

import Image from "next/image";
import type { SocialButtonProps } from "./types";

const defaultIcons: Record<string, string> = {
  google: "/auth/google.svg",
};

export function SocialButton({
  provider,
  label,
  iconSrc,
  onClick,
  className = "",
}: SocialButtonProps) {
  const icon = iconSrc || defaultIcons[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#121215] hover:bg-[#18181D] border border-[#222226] hover:border-[#383840] text-sm font-medium text-neutral-200 hover:text-white transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] ${className}`}
      aria-label={label}
    >
      {icon && (
        <Image
          src={icon}
          alt={`${provider} icon`}
          width={18}
          height={18}
          className="w-4 h-4 flex-shrink-0"
        />
      )}
      <span>{label}</span>
    </button>
  );
}
