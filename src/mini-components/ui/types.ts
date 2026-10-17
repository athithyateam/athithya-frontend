/**
 * Types and interfaces for UI mini-components.
 */

export interface BrandLogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  href?: string;
}

export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isActive: boolean) => React.ReactNode;
  intervalMs?: number;
  autoPlay?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  trackClassName?: string;
  indicatorsClassName?: string;
  showIndicators?: boolean;
  renderIndicator?: (
    index: number,
    isActive: boolean,
    goTo: (i: number) => void
  ) => React.ReactNode;
  onSlideChange?: (index: number) => void;
  "aria-label"?: string;
}

export interface SocialButtonProps {
  provider: "google";
  label: string;
  iconSrc?: string;
  onClick?: () => void;
  className?: string;
}
