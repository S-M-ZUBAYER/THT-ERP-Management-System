import axios from "axios";

const configuredErpApiBaseUrl =
  import.meta.env.VITE_ERP_API_BASE_URL || "http://localhost:5000/api/v1";

const ERP_API_BASE_URL =
  import.meta.env.DEV && configuredErpApiBaseUrl.includes("localhost:5000")
    ? "/erp-api"
    : configuredErpApiBaseUrl;

export const ERP_SESSION_KEYS = {
  accessToken: "erpAccessToken",
  refreshToken: "erpRefreshToken",
  user: "erpUser",
};

const erpApi = axios.create({
  baseURL: ERP_API_BASE_URL,
  timeout: 45000,
});

export const getErpAccessToken = () =>
  localStorage.getItem(ERP_SESSION_KEYS.accessToken);

export const hasErpSession = () => Boolean(getErpAccessToken());

export const clearErpSession = () => {
  localStorage.removeItem(ERP_SESSION_KEYS.accessToken);
  localStorage.removeItem(ERP_SESSION_KEYS.refreshToken);
  localStorage.removeItem(ERP_SESSION_KEYS.user);
};

export const saveErpSession = ({ accessToken, refreshToken, user }) => {
  localStorage.setItem(ERP_SESSION_KEYS.accessToken, accessToken);

  if (refreshToken) {
    localStorage.setItem(ERP_SESSION_KEYS.refreshToken, refreshToken);
  }

  if (user) {
    localStorage.setItem(ERP_SESSION_KEYS.user, JSON.stringify(user));
  }
};

erpApi.interceptors.request.use((config) => {
  const token = getErpAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

erpApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearErpSession();
    }

    return Promise.reject(error);
  },
);

export const loginToErp = async ({ email, password }) => {
  const response = await erpApi.post("/auth/login", { email, password });
  const payload = response.data?.data || response.data || {};
  const accessToken =
    payload.accessToken || payload.access_token || payload.token;
  const refreshToken = payload.refreshToken || payload.refresh_token;
  const user = payload.user || null;

  if (!accessToken) {
    throw new Error("ERP login did not return an access token");
  }

  saveErpSession({ accessToken, refreshToken, user });

  return { accessToken, refreshToken, user };
};

export const logoutFromErp = async () => {
  if (!hasErpSession()) return;

  try {
    await erpApi.post("/auth/logout");
  } catch (error) {
    console.error("ERP logout failed:", error);
  } finally {
    clearErpSession();
  }
};

export default erpApi;
