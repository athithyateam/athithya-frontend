"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TestimonialCardProps {
  image: string;
  name: string;
  trip: string;
  text: string;
}

export function TestimonialCard({ image, name, trip, text }: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="w-80 bg-white rounded-2xl overflow-hidden shadow-md shrink-0 border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 transition-colors"
    >
      <div className="h-32 overflow-hidden">
        <img loading="lazy" decoding="async" src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-sm text-gray-700 line-clamp-3 dark:text-neutral-300 transition-colors">“{text}”</p>
        <div className="mt-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100 transition-colors">{name}</p>
          <p className="text-xs text-gray-500 dark:text-neutral-400 transition-colors">{trip}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default TestimonialCard;

