"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseInViewOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [React.RefCallback<T>, boolean] {
  const {
    root = null,
    rootMargin = "80px",
    threshold = 0.05,
    triggerOnce = true,
  } = options;

  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: T | null) => {
      elementRef.current = node;

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || typeof window === "undefined" || !("IntersectionObserver" in window)) {
        if (node) setIsInView(true);
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsInView(true);
            if (triggerOnce && observerRef.current) {
              observerRef.current.disconnect();
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        },
        { root, rootMargin, threshold }
      );

      observerRef.current.observe(node);
    },
    [root, rootMargin, threshold, triggerOnce]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [ref, isInView];
}
