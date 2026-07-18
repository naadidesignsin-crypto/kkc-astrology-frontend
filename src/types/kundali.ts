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

export type HousePlanetResponse = {
  name: string;
  rashi: string;
  nakshatra: string;
  degree: string;
  retrograde: boolean | null;
  combust: boolean | null;
};

export type HouseInterpretationResponse = {
  houseNumber: number;
  houseName: string;
  mainArea: string;
  meaning: string;
  interpretation: string;
  planets: HousePlanetResponse[];
};

export type KundaliHouseResponse = {
  reportId: number;
  sectionType: string;
  status: string;
  houses: HouseInterpretationResponse[];
};

export type NavamsaPlanetResponse = {
  planetName: string;
  birthRashi: string;
  birthHouse: number | null;
  birthLongitude: number | null;
  birthNakshatra: string;
  navamsaNumber: number;
  navamsaRashi: string;
  navamsaHouse: number | null;
};

export type KundaliNavamsaResponse = {
  reportId: number;
  sectionType: string;
  status: string;
  navamsaAscendant: string | null;
  planets: NavamsaPlanetResponse[];
};

export type ParasharaSectionResponse = {
  sectionKey: string;
  title: string;
  summary: string;
  focusAreas: string[];
  observations: string[];
  guidance: string;
  caution: string;
};

export type KundaliParasharaReportResponse = {
  reportId: number;
  sectionType: string;
  status: string;

  lagna: string | null;
  rashi: string | null;
  nakshatra: string | null;
  currentDasha: string | null;
  navamsaAscendant: string | null;

  sections: ParasharaSectionResponse[];
};