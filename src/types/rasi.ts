export type DailyRasiSection = {
  title?: string;
  overview?: string;
  career?: string;
  finance?: string;
  health?: string;
  family?: string;
  love?: string;
  luckyColor?: string;
  luckyNumber?: string;
  luckyDirection?: string;
  remedy?: string;
  rawSummary?: string;
};

export type DailyRasiOption = {
  key: string;
  teluguName: string;
  englishName: string;
  zodiacName: string;
  symbol: string;
};

export type DailyRasiPlaceOption = {
  key: string;
  label: string;
  state: string;
};

export type DailyRasiResponse = {
  date: string;
  place: string;
  cityKey: string;

  rasiKey: string;
  displayName: string;
  teluguName: string;
  englishName: string;
  zodiacName: string;
  symbol: string;

  language?: string;
  source?: string;
  note?: string;
  generatedAt?: string;

  daily?: DailyRasiSection;
  weekly?: DailyRasiSection;
  monthly?: DailyRasiSection;

  overview?: string;
  prediction?: string;
  career?: string;
  finance?: string;
  health?: string;
  family?: string;
  love?: string;
  luckyColor?: string;
  luckyNumber?: string;
  luckyDirection?: string;
  remedy?: string;

  supportedRasis?: DailyRasiOption[];
  supportedPlaces?: DailyRasiPlaceOption[];
};