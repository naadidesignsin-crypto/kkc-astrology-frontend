export type LocationPreset = {
  id: string;
  labelTe: string;
  labelEn: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  searchTerms: string[];
};

export const locationPresets: LocationPreset[] = [
  {
    id: "hyderabad",
    labelTe: "హైదరాబాద్",
    labelEn: "Hyderabad",
    birthPlace: "Hyderabad, Telangana, India",
    latitude: 17.385,
    longitude: 78.4867,
    timezone: "Asia/Kolkata",
    searchTerms: ["hyderabad", "హైదరాబాద్", "telangana"],
  },
  {
    id: "vijayawada",
    labelTe: "విజయవాడ",
    labelEn: "Vijayawada",
    birthPlace: "Vijayawada, Andhra Pradesh, India",
    latitude: 16.5062,
    longitude: 80.648,
    timezone: "Asia/Kolkata",
    searchTerms: ["vijayawada", "విజయవాడ", "bezawada", "andhra"],
  },
  {
    id: "visakhapatnam",
    labelTe: "విశాఖపట్నం",
    labelEn: "Visakhapatnam",
    birthPlace: "Visakhapatnam, Andhra Pradesh, India",
    latitude: 17.6868,
    longitude: 83.2185,
    timezone: "Asia/Kolkata",
    searchTerms: ["visakhapatnam", "vizag", "విశాఖపట్నం", "andhra"],
  },
  {
    id: "tirupati",
    labelTe: "తిరుపతి",
    labelEn: "Tirupati",
    birthPlace: "Tirupati, Andhra Pradesh, India",
    latitude: 13.6288,
    longitude: 79.4192,
    timezone: "Asia/Kolkata",
    searchTerms: ["tirupati", "తిరుపతి", "andhra"],
  },
  {
    id: "rajahmundry",
    labelTe: "రాజమండ్రి",
    labelEn: "Rajahmundry",
    birthPlace: "Rajahmundry, Andhra Pradesh, India",
    latitude: 17.0005,
    longitude: 81.804,
    timezone: "Asia/Kolkata",
    searchTerms: ["rajahmundry", "rajamahendravaram", "రాజమండ్రి", "andhra"],
  },
  {
    id: "guntur",
    labelTe: "గుంటూరు",
    labelEn: "Guntur",
    birthPlace: "Guntur, Andhra Pradesh, India",
    latitude: 16.3067,
    longitude: 80.4365,
    timezone: "Asia/Kolkata",
    searchTerms: ["guntur", "గుంటూరు", "andhra"],
  },
  {
    id: "nellore",
    labelTe: "నెల్లూరు",
    labelEn: "Nellore",
    birthPlace: "Nellore, Andhra Pradesh, India",
    latitude: 14.4426,
    longitude: 79.9865,
    timezone: "Asia/Kolkata",
    searchTerms: ["nellore", "నెల్లూరు", "andhra"],
  },
  {
    id: "warangal",
    labelTe: "వరంగల్",
    labelEn: "Warangal",
    birthPlace: "Warangal, Telangana, India",
    latitude: 17.9689,
    longitude: 79.5941,
    timezone: "Asia/Kolkata",
    searchTerms: ["warangal", "వరంగల్", "telangana"],
  },
];

export function getLocationLabel(
  location: LocationPreset,
  language: "te" | "en"
) {
  return language === "te" ? location.labelTe : location.labelEn;
}

export function searchLocationPresets(query: string): LocationPreset[] {
  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery) {
    return locationPresets.slice(0, 8);
  }

  return locationPresets
    .filter((location) => {
      const searchableText = [
        location.labelTe,
        location.labelEn,
        location.birthPlace,
        ...location.searchTerms,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(cleanQuery);
    })
    .slice(0, 8);
}