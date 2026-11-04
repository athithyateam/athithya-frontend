import React from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import type { CategoryItem } from "@/data/categories";

interface CategoryCardProps {
  category: CategoryItem;
  isNew?: boolean;
}

export function CategoryCard({ category, isNew = false }: CategoryCardProps) {
  const tagline = category.tagline || category.count;

  return (
    <Link
      href={`/${category.slug}`}
      className={`group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col aspect-[4/5] sm:aspect-[3/4] border border-neutral-100 dark:border-neutral-800 ${
        isNew ? "ring-2 ring-[#C59A2F]" : ""
      }`}
    >
      {category.isCollage && Array.isArray(category.images) ? (
        <div className="w-full h-full relative overflow-hidden">
          <div className="w-full h-full flex overflow-hidden opacity-85 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-1/2 h-full overflow-hidden relative border-r border-white/30">
              <img
                src={category.images[0]}
                alt={category.label}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-1/2 h-full overflow-hidden relative">
              <img
                src={category.images[1]}
                alt={category.label}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-center p-4 z-10 bg-black/40 group-hover:bg-black/30 transition-colors">
            <div className="w-13 h-13 rounded-full bg-black/75 border border-[#C59A2F]/80 flex items-center justify-center text-[#C59A2F] shadow-md">
              <HelpCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      ) : (
        <img
          src={category.image}
          alt={category.label}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      )}

      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:from-black/95" />

      {isNew && (
        <div className="absolute top-3.5 right-3.5 z-20">
          <span className="px-2.5 py-1 rounded-full bg-[#C59A2F] text-white text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-md border border-white dark:border-neutral-950">
            New
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white flex flex-col justify-end text-left">
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#C59A2F] transition-colors leading-tight">
          {category.label}
        </h3>
        {tagline && (
          <p className="text-xs sm:text-sm font-extrabold text-[#C59A2F] tracking-wide mt-1 mb-3">
            {tagline}
          </p>
        )}
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C59A2F] uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-200">
          <span>Explore {category.label}</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

