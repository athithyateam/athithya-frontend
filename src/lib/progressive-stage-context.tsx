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
const DEFAULT_STAGE_INTERVAL_MS = 600; // Watchdog interval: advances if network image hangs

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
  activeStage: -1,
  reportImageLoaded: () => {},
  shouldLoadImage: () => false,
});

export function ProgressiveStageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Start at -1 so text/HTML card details paint on screen before any image network requests start
  const [activeStage, setActiveStage] = useState(-1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial mount tick: ensure text content paints first, then kick off stage 0
  useEffect(() => {
    const t = setTimeout(() => {
      setActiveStage(0);
    }, 40);
    return () => clearTimeout(t);
  }, []);

  // Watchdog timer: progressively advances stages if a network image stalls
  useEffect(() => {
    if (activeStage < 0 || activeStage >= MAX_PROGRESSIVE_STAGE) return;

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
      // Priority cards (e.g. top 2 cards of Row 0) load as soon as pipeline starts (stage >= 0)
      if (priority) return activeStage >= 0;

      // Standalone images (not part of the home waterfall rows) load when in view
      if (rowIndex === undefined) return inView || activeStage >= 0;

      // A card is visible in the row if within the first 4 cards
      const isVisibleInRow = cardIndex === undefined || cardIndex < 4;

      if (isVisibleInRow) {
        // Visible cards only load when their row's turn arrives in the top-to-bottom waterfall
        // (Row 0 -> Row 1 -> Row 2 -> Row 3 -> Row 4 -> Hosts -> Reviews)
        return activeStage >= rowIndex;
      }

      // Off-screen cards (cardIndex >= 4, to the right side of the carousel):
      // Only load once ALL visible rows have finished (activeStage >= MAX_PROGRESSIVE_STAGE)
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

