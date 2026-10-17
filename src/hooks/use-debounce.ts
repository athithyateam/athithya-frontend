/**
 * Cross-cutting hook: debounces a value by a given delay.
 * Use for search inputs, API filters, etc.
 */
"use client";

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
