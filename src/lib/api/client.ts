export const getApiBase = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host.includes("192.168.");
    if (isLocal) return "";
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://api.athithya.in";
};

export const API_BASE = getApiBase();

export interface NormalizedApiResponse<T = any> {
  ok: boolean;
  status: number;
  message: string;
  data: T;
}

export function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof window !== "undefined" ? atob(base64) : Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined | null>;
  token?: string | null;
}

export async function apiRequest<T = any>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<NormalizedApiResponse<T>> {
  const { body, params, token, headers: customHeaders, ...rest } = options;

  let url = path.startsWith("http") ? path : `${getApiBase()}${path}`;
  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        search.append(k, String(v));
      }
    });
    const qs = search.toString();
    if (qs) url += (url.includes("?") ? "&" : "?") + qs;
  }

  const storedToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  try {
    const res = await fetch(url, {
      ...rest,
      headers,
      credentials: "include",
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (
      res.status === 401 &&
      typeof window !== "undefined" &&
      !url.includes("/logout") &&
      !url.includes("/me")
    ) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    const isSuccess = res.ok && data?.success !== false;
    return {
      ok: isSuccess,
      status: res.status,
      message: data?.message || data?.msg || (isSuccess ? "" : `Request failed (${res.status})`),
      data: data as T,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      message: err?.message || "Network error: could not reach server.",
      data: null as unknown as T,
    };
  }
}

export async function uploadFileToS3(
  uploadUrl: string,
  file: File | Blob,
  options: { onUploadProgress?: (percent: number) => void } = {}
): Promise<boolean> {
  const maxRetries = 2;
  const retryDelays = [1500, 3000];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, retryDelays[attempt - 1]));
    }
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.timeout = 180_000;
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable && options.onUploadProgress) {
            options.onUploadProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`S3 upload status ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("S3 network error"));
        xhr.ontimeout = () => reject(new Error("S3 upload timeout"));
        xhr.send(file);
      });
      return true;
    } catch (err) {
      if (attempt === maxRetries) throw err;
    }
  }
  return false;
}

