import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ChecklistSectionProps {
  id: string;
  title: string;
  items: string[];
  iconColor?: string;
}

export function ChecklistSection({
  id,
  title,
  items,
  iconColor = "text-[#C59A2F]",
}: ChecklistSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-32">
      <h3 className="text-base md:text-xl font-black uppercase tracking-tight mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 p-3.5 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-100 dark:border-neutral-800"
          >
            <CheckCircle2 size={14} className={`${iconColor} shrink-0`} />
            <span className="text-xs md:text-sm font-semibold">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

