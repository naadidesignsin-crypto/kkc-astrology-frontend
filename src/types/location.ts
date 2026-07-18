export type LocationSearchResponse = {
  id: string;
  displayName: string;
  birthPlace: string;

  latitude: number;
  longitude: number;
  timezone: string;

  city: string;
  state: string;
  country: string;
  countryCode: string;

  source: string;
};