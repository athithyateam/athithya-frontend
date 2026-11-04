import React from "react";

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-2xl ${className}`}
      {...props}
    />
  );
}

