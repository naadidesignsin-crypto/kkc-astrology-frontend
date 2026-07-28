import type {
  AdminDeleteKundaliReportResponse,
  AdminKundaliReportApprovalRequest,
  AdminKundaliReportPageResponse,
  KundaliGenerateResponse,
  KundaliStatus,
} from "../types/kundali";

const API_BASE_URL =
  import.meta.env.VITE_KKC_BACKEND_URL || "http://localhost:8081";

const ADMIN_AUTH_KEY = "kkc_admin_basic_auth";

export function createAdminAuthHeader(username: string, password: string) {
  return `Basic ${window.btoa(`${username}:${password}`)}`;
}

export function saveAdminAuth(authHeader: string) {
  sessionStorage.setItem(ADMIN_AUTH_KEY, authHeader);
}

export function getAdminAuth() {
  return sessionStorage.getItem(ADMIN_AUTH_KEY);
}

export function clearAdminAuth() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
}

async function adminRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const authHeader = getAdminAuth();

  if (!authHeader) {
    throw new Error("Admin login required.");
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...(options?.headers || {}),
    },
  });

  if (response.status === 401 || response.status === 403) {
    clearAdminAuth();
    throw new Error("Admin session expired or invalid.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Admin API failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function verifyAdminLogin(username: string, password: string) {
  const authHeader = createAdminAuthHeader(username, password);

  const response = await fetch(`${API_BASE_URL}/api/admin/auth/me`, {
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    throw new Error("Invalid admin username or password.");
  }

  saveAdminAuth(authHeader);

  return response.json();
}

export function getAdminKundaliReports(
  page = 0,
  size = 20,
  status?: KundaliStatus | "",
  search?: string
): Promise<AdminKundaliReportPageResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (status) {
    params.set("status", status);
  }

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  return adminRequest(`/api/admin/kundali/reports?${params.toString()}`);
}

export function updateAdminKundaliReportAccess(
  reportId: number,
  payload: AdminKundaliReportApprovalRequest
): Promise<KundaliGenerateResponse> {
  return adminRequest(`/api/admin/kundali/reports/${reportId}/access`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminKundaliReport(
  reportId: number
): Promise<AdminDeleteKundaliReportResponse> {
  return adminRequest(`/api/admin/kundali/reports/${reportId}`, {
    method: "DELETE",
  });
}

export function deleteAllAdminKundaliReports(): Promise<AdminDeleteKundaliReportResponse> {
  return adminRequest(
    "/api/admin/kundali/reports?confirm=DELETE_ALL_KUNDALI_REPORTS",
    {
      method: "DELETE",
    }
  );
}
