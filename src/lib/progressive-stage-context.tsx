"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

export const MAX_PROGRESSIVE_STAGE = 7;
const DEFAULT_STAGE_INTERVAL_MS = 120; // Watchdog interval to advance waterfall

interface ProgressiveStageContextValue {
  activeStage: number;
  reportImageLoaded: (rowIndex?: number, cardIndex?: number) => void;
  shouldLoadImage: (
    rowIndex?: number,
    cardIndex?: number,
    inView?: boolean,
    priority?: boolean
  ) => boolean;
}

const ProgressiveStageContext = createContext<ProgressiveStageContextValue>({
  activeStage: 0,
  reportImageLoaded: () => {},
  shouldLoadImage: () => true,
});

export function ProgressiveStageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeStage, setActiveStage] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Watchdog timer: progressively advances stages from 0 to MAX_PROGRESSIVE_STAGE
  useEffect(() => {
    if (activeStage >= MAX_PROGRESSIVE_STAGE) return;

    timerRef.current = setTimeout(() => {
      setActiveStage((prev) => Math.min(prev + 1, MAX_PROGRESSIVE_STAGE));
    }, DEFAULT_STAGE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeStage]);

  // When a visible image in the current active stage finishes loading, advance immediately
  const reportImageLoaded = useCallback(
    (rowIndex?: number, cardIndex?: number) => {
      if (rowIndex === undefined) return;
      if (cardIndex !== undefined && cardIndex >= 4) return; // Only visible cards advance stages

      setActiveStage((current) => {
        if (rowIndex >= current && current < MAX_PROGRESSIVE_STAGE) {
          if (timerRef.current) clearTimeout(timerRef.current);
          return current + 1;
        }
        return current;
      });
    },
    []
  );

  const shouldLoadImage = useCallback(
    (
      rowIndex?: number,
      cardIndex?: number,
      inView = false,
      priority = false
    ): boolean => {
      // Tier 1: Forced priority or directly visible in viewport via IntersectionObserver
      if (priority || inView) return true;

      // If no row index provided, allow loading once stage starts
      if (rowIndex === undefined) return activeStage >= 0;

      const isVisibleInRow = cardIndex === undefined || cardIndex < 4;

      if (isVisibleInRow) {
        // Visible cards load when their row's turn comes in the waterfall
        return activeStage >= rowIndex;
      }

      // Off-screen cards (cardIndex >= 4) only load once all visible stages are complete
      return activeStage >= MAX_PROGRESSIVE_STAGE;
    },
    [activeStage]
  );

  return (
    <ProgressiveStageContext.Provider
      value={{ activeStage, reportImageLoaded, shouldLoadImage }}
    >
      {children}
    </ProgressiveStageContext.Provider>
  );
}

export function useProgressiveStage() {
  return useContext(ProgressiveStageContext);
}
