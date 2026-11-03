import { apiRequest, decodeJwtPayload, type NormalizedApiResponse } from "./client";
import { ENDPOINTS } from "./endpoints";

export interface SignupInitiatePayload {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role?: "guest" | "host";
}

export interface SignupCompletePayload extends SignupInitiatePayload {
  otp: string;
}

export async function signupInitiateApi(
  payload: SignupInitiatePayload
): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.SIGNUP_INITIATE, { method: "POST", body: payload });
}

export async function signupCompleteApi(
  payload: SignupCompletePayload
): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.SIGNUP_COMPLETE, { method: "POST", body: payload });
}

export async function signinApi(payload: {
  email: string;
  password: string;
}): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.SIGNIN, { method: "POST", body: payload });
}

export async function logoutApi(): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.LOGOUT, { method: "POST" });
}

export async function forgotPasswordApi(payload: {
  email: string;
}): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.FORGOT_PASSWORD, { method: "POST", body: payload });
}

export async function resetPasswordApi(payload: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.RESET_PASSWORD, { method: "POST", body: payload });
}

export async function googleSigninApi(payload: {
  token: string;
  role?: "guest" | "host";
}): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.GOOGLE_AUTH, { method: "POST", body: payload });
}

export async function getUserDetailsApi(): Promise<NormalizedApiResponse> {
  const res = await apiRequest(ENDPOINTS.ME, { method: "GET" });
  if (res.ok && (res.data?.data?.user || res.data?.user)) {
    return res;
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const decoded = decodeJwtPayload(token);
      if (decoded?.userId) {
        return apiRequest(ENDPOINTS.USER_PROFILE(decoded.userId), { method: "GET" });
      }
    }
  }
  return res;
}

export async function submitHostVerificationApi(
  payload: Record<string, any>
): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.VERIFY_HOST, { method: "POST", body: payload });
}

export async function sendPhoneOtpApi(phone: string): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.SEND_PHONE_OTP, { method: "POST", body: { phone } });
}

export async function verifyPhoneOtpApi(
  phone: string,
  otp: string
): Promise<NormalizedApiResponse> {
  return apiRequest(ENDPOINTS.VERIFY_PHONE_OTP, { method: "POST", body: { phone, otp } });
}

