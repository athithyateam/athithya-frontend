"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MessageSquare, User } from "lucide-react";
import { routes } from "@/config/navigation";

const navItems = [
  { name: "Home", href: routes.home, icon: Compass },
  { name: "Chat", href: routes.chat, icon: MessageSquare },
  { name: "Profile", href: routes.profile, icon: User },
];

function MobileFooterContent() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-neutral-800 z-[9999] md:hidden pt-2.5 pb-7 px-4 shadow-[0_-6px_24px_rgba(0,0,0,0.12)] transition-colors">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center text-center transition-all ${
                active
                  ? "text-[#C59A2F] font-bold"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1 leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function MobileFooter() {
  return (
    <Suspense fallback={null}>
      <MobileFooterContent />
    </Suspense>
  );
}
