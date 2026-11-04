let googleScriptPromise: Promise<boolean> | null = null;

export function loadGoogleScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).google?.accounts?.oauth2) return Promise.resolve(true);
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existing) {
      if ((window as any).google?.accounts?.oauth2) {
        resolve(true);
      } else {
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () => resolve(false));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      googleScriptPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export interface GoogleAuthOptions {
  onSuccess: (accessToken: string) => Promise<void> | void;
  onError?: (error: any) => void;
  scope?: string;
  prompt?: string;
}

export async function promptGoogleLogin({
  onSuccess,
  onError,
  scope = "email profile openid",
  prompt,
}: GoogleAuthOptions): Promise<void> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    onError?.(new Error("Google OAuth is not configured on this environment."));
    return;
  }

  const loaded = await loadGoogleScript();
  const googleAccounts = (window as any).google?.accounts?.oauth2;

  if (!loaded || !googleAccounts) {
    onError?.(new Error("Failed to load Google Sign-In SDK. Please check your network."));
    return;
  }

  try {
    const tokenClient = googleAccounts.initTokenClient({
      client_id: clientId,
      scope,
      callback: async (response: any) => {
        if (response?.error) {
          onError?.(response);
          return;
        }
        if (response?.access_token) {
          try {
            await onSuccess(response.access_token);
          } catch (err) {
            onError?.(err);
          }
        } else {
          onError?.(new Error("No access token returned by Google."));
        }
      },
      error_callback: (err: any) => {
        onError?.(err);
      },
    });

    tokenClient.requestAccessToken(prompt ? { prompt } : undefined);
  } catch (err) {
    onError?.(err);
  }
}

