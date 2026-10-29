"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "gold"
  | "black"
  | "blue"
  | "danger"
  | "outline"
  | "ghost"
  | "subtle";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  pill?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  gold: "bg-[#C59A2F] hover:bg-[#A67F26] text-white shadow-sm",
  black:
    "bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 shadow-sm",
  blue: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  outline:
    "border border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200",
  ghost:
    "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
  subtle:
    "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "px-3 py-1.5 text-[11px]",
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-xs sm:text-sm",
  lg: "px-6 py-3.5 text-sm",
};

export function Button({
  variant = "gold",
  size = "md",
  fullWidth = false,
  loading = false,
  pill = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none",
        pill ? "rounded-full" : "rounded-2xl",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
