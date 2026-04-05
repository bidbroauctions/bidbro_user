/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { refreshTokenService } from "../auth/api/AuthService";
import { UserState } from "@/store/useUserStore";

// Create an axios instance with a timeout and base URL from environment variables
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // API base URL
  timeout: 100000, // Timeout set to 10 seconds
});

// Add request interceptor to include Authorization header if accessToken is present
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<AxiosRequestConfig>) => {
    const store = localStorage.getItem("user-storage");

    const parseStore = (store ? JSON.parse(store) : (null as unknown)) as {
      state: UserState;
    };
    if (!parseStore) return config;
    const {
      state: { accessToken },
    } = parseStore;
    if (accessToken && !config.headers.Authorization) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      } as AxiosRequestHeaders;
    }
    /*
    else if (!accessToken && !config.url?.includes("/auth")) {
      window.location.href = "/auth/login";
    }
    */

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors and refresh token logic
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    const { status } = error.response as AxiosResponse;
    const originalRequest =
      error.config as InternalAxiosRequestConfig<AxiosRequestConfig>;
    if (status === 401) {
      const store = localStorage.getItem("user-storage");
      const parseStore = (store ? JSON.parse(store) : (null as unknown)) as {
        state: UserState;
      };
      if (!parseStore) return Promise.reject(error);
      const {
        state: { accessToken, refreshToken },
      } = parseStore;

      if (!accessToken || !refreshToken) return Promise.reject(error);
      const {
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      } = await refreshTokenService(refreshToken);
      if (!newAccessToken || !newRefreshToken) return Promise.reject(error);
      parseStore.state.accessToken = newAccessToken;
      parseStore.state.refreshToken = newRefreshToken;
      localStorage.setItem("user-storage", JSON.stringify(parseStore));
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    }

    // const originalRequest = error.config;

    return Promise.reject(error);
  }
);

export default axiosInstance;
