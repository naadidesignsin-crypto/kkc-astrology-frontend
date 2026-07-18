export type KundaliStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface KundaliGenerateRequest {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  language: string;
}

export interface KundaliGenerateResponse {
  id: number;
  fullName: string;
  status: KundaliStatus;
  provider: string;
  errorMessage?: string | null;
}

export interface KundaliSummaryResponse {
  id: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  provider: string;
  status: KundaliStatus;

  ascendant?: string | null;
  rashi?: string | null;
  signLord?: string | null;
  nakshatra?: string | null;
  nakshatraLord?: string | null;
  charan?: string | null;

  tithi?: string | null;
  yoga?: string | null;
  karan?: string | null;
  masa?: string | null;
  sunrise?: string | null;
  sunset?: string | null;

  errorMessage?: string | null;
}

export interface PlanetPosition {
  name: string;
  degree: string;
  latitude: number;
  longitude: number;
  rashi: string;
  rashiLord: string;
  nakshatra: string;
  nakshatraLord: string;
  charan: string;
  house: number;
  retrograde: boolean;
  combust: boolean;
  planetState: string;
}

export interface KundaliPlanetsResponse {
  reportId: number;
  sectionType: string;
  status: KundaliStatus;
  planets: PlanetPosition[];
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface KundaliDashaResponse {
  reportId: number;
  sectionType: string;
  status: KundaliStatus;
  currentDasha: DashaPeriod | null;
  dashaPeriods: DashaPeriod[];
}

export interface KundaliDoshaResponse {
  reportId: number;
  sectionType: string;
  status: KundaliStatus;
  mangalDoshaPresent: boolean;
  type: string;
  intensity: string;
  reason: string;
  info: string;
}