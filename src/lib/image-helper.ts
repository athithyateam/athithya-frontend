export const getHighResGoogleAvatar = (url: string): string => {
  if (typeof url === "string" && url.includes("googleusercontent.com")) {
    return url
      .replace(/=s\d+(-[a-zA-Z0-9_-]+)?$/, "=s512-c")
      .replace(/\/s\d+(-[a-zA-Z0-9_-]+)?\//, "/s512-c/");
  }
  return url;
};

export const getPlaceholderAvatar = (name?: string): string => {
  const char = (name?.charAt(0) || "U").toUpperCase();
  const bgColor = "%23C59A2F";
  const textColor = "%23ffffff";
  const borderColor = "%23b48820";

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/><text x="50" y="55" font-family="'Inter', 'Poppins', sans-serif" font-size="40" font-weight="900" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${char}</text></svg>`;
};

export interface ImageOptimizeOptions {
  width?: number;
  height?: number;
  quality?: number | "auto";
  format?: string;
  crop?: string;
}

export const getOptimizedImage = (
  inputUrl: unknown,
  options: ImageOptimizeOptions = {},
  fallbackName = "U"
): string => {
  let url = "";
  if (inputUrl && typeof inputUrl === "object") {
    const obj = inputUrl as Record<string, any>;
    url = obj.url || obj.path || obj.src || "";
  } else if (typeof inputUrl === "string") {
    url = inputUrl;
  }

  if (!url) {
    return getPlaceholderAvatar(fallbackName);
  }

  if (url.includes("ui-avatars.com")) {
    const nameMatch = url.match(/[?&]name=([^&]+)/);
    const name = nameMatch ? decodeURIComponent(nameMatch[1]) : fallbackName;
    return getPlaceholderAvatar(name);
  }

  url = getHighResGoogleAvatar(url);

  if (url.includes("res.cloudinary.com")) {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      const { width, height, quality = "auto", format = "auto", crop = "fill" } = options;
      const transformations: string[] = [];
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      if (quality) transformations.push(`q_${quality}`);
      if (format) transformations.push(`f_${format}`);
      if (crop && (width || height)) transformations.push(`c_${crop}`);
      return `${parts[0]}/upload/${transformations.join(",")}/${parts[1]}`;
    }
  }

  return url;
};

export const compressImage = async (
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<File> => {
  if (!file || !file.type?.startsWith("image/") || typeof window === "undefined") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const webpName = (file.name || "image").replace(/\.[^/.]+$/, "") + ".webp";
          resolve(new File([blob], webpName, { type: "image/webp", lastModified: Date.now() }));
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
};

