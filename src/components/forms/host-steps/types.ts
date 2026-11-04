export interface MediaItem {
  file: File;
  preview: string;
  type: "image" | "video";
}

export interface ExistingMedia {
  url: string;
  caption?: string;
  title?: string;
}

export interface DiscountTier {
  threshold: number;
  percentage: number;
}

export interface FormErrors {
  [key: string]: string | null | undefined;
}
