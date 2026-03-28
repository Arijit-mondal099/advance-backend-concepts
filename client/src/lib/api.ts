import axios from "axios";

const CSRF_COOKIE        = "csrf_token";
const CSRF_HEADER_OPTION = "x-csrf-token"
const API_URL            = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) throw new Error("Api url not provided");

function getCookie(key: string): string {
  const cookie = document.cookie.split("; ").find((cookie) => cookie.startsWith(`${key}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

/**
 * CSRF protection
 */

api.interceptors.request.use((config) => {
  const method = (config.method || "GET").toUpperCase();

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const CSRF_TOKEN = getCookie(CSRF_COOKIE);
    if (CSRF_TOKEN) config.headers[CSRF_HEADER_OPTION] = CSRF_TOKEN;
  }

  return config;
});


/**
 * Handle refresh token
 */

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (error: unknown) => void }> = [];

function processQueue(error: unknown) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
}

api.interceptors.response.use((response) => 
  response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Queue concurrent requests until refresh completes
    if (isRefreshing) {
      return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }) }).then(() => api(original));
    }

    original._retry  = true;
    isRefreshing     = true;

    try {
      await api.post("/auth/refresh"); // refresh cookie sent automatically
      processQueue(null);
      return api(original);            // retry original request
    } catch (err) {
      processQueue(err);
      window.location.href = "/login"; // refresh failed, force logout
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
