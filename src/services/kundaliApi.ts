import type {
  KundaliDashaResponse,
  KundaliDoshaResponse,
  KundaliGenerateRequest,
  KundaliGenerateResponse,
  KundaliHouseResponse,
  KundaliNavamsaResponse,
  KundaliParasharaReportResponse,
  KundaliPlanetsResponse,
  KundaliSummaryResponse,
} from "../types/kundali";

const API_BASE_URL =
  import.meta.env.VITE_KKC_BACKEND_URL || "http://localhost:8080";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function cleanOrderId(orderId: string) {
  return orderId.trim().toUpperCase();
}

function orderQuery(orderId: string) {
  return `orderId=${encodeURIComponent(cleanOrderId(orderId))}`;
}

export function generateKundali(
  payload: KundaliGenerateRequest
): Promise<KundaliGenerateResponse> {
  return request<KundaliGenerateResponse>("/api/kundali/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getSummary(
  reportId: number,
  orderId: string
): Promise<KundaliSummaryResponse> {
  return request<KundaliSummaryResponse>(
    `/api/kundali/reports/${reportId}/summary?${orderQuery(orderId)}`
  );
}

export function getReportByOrderId(
  orderId: string
): Promise<KundaliSummaryResponse> {
  return request<KundaliSummaryResponse>(
    `/api/kundali/orders/${encodeURIComponent(cleanOrderId(orderId))}/summary`
  );
}

export function getPlanets(
  reportId: number,
  orderId: string
): Promise<KundaliPlanetsResponse> {
  return request<KundaliPlanetsResponse>(
    `/api/kundali/reports/${reportId}/planets?${orderQuery(orderId)}`
  );
}

export function getDasha(
  reportId: number,
  orderId: string
): Promise<KundaliDashaResponse> {
  return request<KundaliDashaResponse>(
    `/api/kundali/reports/${reportId}/dasha?${orderQuery(orderId)}`
  );
}

export function getDosha(
  reportId: number,
  orderId: string
): Promise<KundaliDoshaResponse> {
  return request<KundaliDoshaResponse>(
    `/api/kundali/reports/${reportId}/dosha?${orderQuery(orderId)}`
  );
}

export async function downloadKundaliPdf(reportId: number, orderId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/kundali/reports/${reportId}/pdf?${orderQuery(orderId)}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Unable to download Kundali PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `kkc-kundali-report-${cleanOrderId(orderId)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

export async function getHouses(
  reportId: number,
  orderId: string
): Promise<KundaliHouseResponse> {
  return request<KundaliHouseResponse>(
    `/api/kundali/reports/${reportId}/houses?${orderQuery(orderId)}`
  );
}

export async function getNavamsa(
  reportId: number,
  orderId: string
): Promise<KundaliNavamsaResponse> {
  return request<KundaliNavamsaResponse>(
    `/api/kundali/reports/${reportId}/navamsa?${orderQuery(orderId)}`
  );
}

export async function getParashara(
  reportId: number,
  orderId: string
): Promise<KundaliParasharaReportResponse> {
  return request<KundaliParasharaReportResponse>(
    `/api/kundali/reports/${reportId}/parashara?${orderQuery(orderId)}`
  );
}
