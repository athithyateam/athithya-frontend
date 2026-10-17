import Link from "next/link";
import { routes } from "@/config/navigation";
import type { BrandLogoProps } from "./types";

export function BrandLogo({
  className = "",
  iconSize = 28,
  showText = true,
  href = routes.home,
}: BrandLogoProps) {
  const content = (
    <div className={`flex items-center gap-2 group select-none ${className}`}>
      {/* Athithya Golden Namaste / Prayer Hands Logo Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-[#DF9E26] group-hover:scale-105 transition-transform flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M12.001 2.5c-.4 0-.8.3-1 .7L8.5 7.6c-.6 1.2-.4 2.7.5 3.7l2.5 2.7c.3.3.7.5 1.1.5h.001c.4 0 .8-.2 1.1-.5l2.5-2.7c.9-1 1.1-2.5.5-3.7L14.2 3.2c-.2-.4-.6-.7-1-.7zM6.5 11c-.3 0-.6.1-.8.4L3.2 14c-.6.8-.6 1.9-.1 2.7l3.2 4.9c.3.5.9.8 1.5.8h.4c.7 0 1.3-.4 1.6-1.1l1.5-3.5-3.8-6.1c-.3-.5-.7-.7-1-.7zm11 0c-.3 0-.7.2-1 .7l-3.8 6.1 1.5 3.5c.3.7.9 1.1 1.6 1.1h.4c.6 0 1.2-.3 1.5-.8l3.2-4.9c.5-.8.5-1.9-.1-2.7l-2.5-2.6c-.2-.3-.5-.4-.8-.4z" />
      </svg>
      {showText && (
        <span className="font-serif text-2xl font-medium tracking-wide text-[#DF9E26]">
          thithya
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="focus:outline-none">
      {content}
    </Link>
  );
}
