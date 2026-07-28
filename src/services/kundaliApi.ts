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
  import.meta.env.VITE_KKC_BACKEND_URL || "http://localhost:8081";

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

export function generateKundali(
  payload: KundaliGenerateRequest
): Promise<KundaliGenerateResponse> {
  return request<KundaliGenerateResponse>("/api/kundali/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function generateSection(
  reportId: number,
  sectionType: "PLANETARY_POSITIONS" | "DASHA" | "DOSHA"
) {
  return request(`/api/kundali/reports/${reportId}/sections/${sectionType}/generate`, {
    method: "POST",
  });
}

export function getSummary(reportId: number): Promise<KundaliSummaryResponse> {
  return request<KundaliSummaryResponse>(
    `/api/kundali/reports/${reportId}/summary`
  );
}

export function getPlanets(reportId: number): Promise<KundaliPlanetsResponse> {
  return request<KundaliPlanetsResponse>(
    `/api/kundali/reports/${reportId}/planets`
  );
}

export function getDasha(reportId: number): Promise<KundaliDashaResponse> {
  return request<KundaliDashaResponse>(
    `/api/kundali/reports/${reportId}/dasha`
  );
}

export function getDosha(reportId: number): Promise<KundaliDoshaResponse> {
  return request<KundaliDoshaResponse>(
    `/api/kundali/reports/${reportId}/dosha`
  );
}

export async function downloadKundaliPdf(reportId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/kundali/reports/${reportId}/pdf`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Unable to download Kundali PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `kkc-kundali-report-${reportId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

export async function getHouses(
  reportId: number
): Promise<KundaliHouseResponse> {
  return request<KundaliHouseResponse>(
    `/api/kundali/reports/${reportId}/houses`
  );
}

export async function getNavamsa(
  reportId: number
): Promise<KundaliNavamsaResponse> {
  return request<KundaliNavamsaResponse>(
    `/api/kundali/reports/${reportId}/navamsa`
  );
}

export async function getParashara(
  reportId: number
): Promise<KundaliParasharaReportResponse> {
  return request<KundaliParasharaReportResponse>(
    `/api/kundali/reports/${reportId}/parashara`
  );
}