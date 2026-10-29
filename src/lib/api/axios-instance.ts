import { apiRequest } from "./client";

export const apiClient = {
  get: async (url: string, config?: any) => {
    const res = await apiRequest(url, {
      method: "GET",
      params: config?.params,
      headers: config?.headers,
    });
    return { data: res.data, status: res.status, ok: res.ok };
  },
  post: async (url: string, data?: any, config?: any) => {
    const res = await apiRequest(url, {
      method: "POST",
      body: data,
      params: config?.params,
      headers: config?.headers,
    });
    return { data: res.data, status: res.status, ok: res.ok };
  },
  put: async (url: string, data?: any, config?: any) => {
    const res = await apiRequest(url, {
      method: "PUT",
      body: data,
      params: config?.params,
      headers: config?.headers,
    });
    return { data: res.data, status: res.status, ok: res.ok };
  },
  patch: async (url: string, data?: any, config?: any) => {
    const res = await apiRequest(url, {
      method: "PATCH",
      body: data,
      params: config?.params,
      headers: config?.headers,
    });
    return { data: res.data, status: res.status, ok: res.ok };
  },
  delete: async (url: string, config?: any) => {
    const res = await apiRequest(url, {
      method: "DELETE",
      params: config?.params,
      headers: config?.headers,
    });
    return { data: res.data, status: res.status, ok: res.ok };
  },
};

export const axiosInstance = apiClient;
export default apiClient;
