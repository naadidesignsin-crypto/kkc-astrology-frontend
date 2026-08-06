export type DailyPanchangPlaceOption = {
  key: string;
  label: string;
  state: string;
};

export type DailyPanchangResponse = {
  date: string;
  place: string;
  cityKey: string;
  latitude: number;
  longitude: number;
  timezone: string;
  style: string;
  language: string;

  varam?: string | null;
  tithi?: string | null;
  nakshatram?: string | null;
  yogam?: string | null;
  karanam?: string | null;
  paksham?: string | null;
  masam?: string | null;
  samvatsaram?: string | null;
  ayanam?: string | null;
  ritu?: string | null;

  sunrise?: string | null;
  sunset?: string | null;
  moonrise?: string | null;
  moonset?: string | null;

  rahuKalam?: string | null;
  yamagandam?: string | null;
  gulikaKalam?: string | null;
  durmuhurtham?: string | null;
  varjyam?: string | null;
  amritaKalam?: string | null;
  abhijitMuhurtham?: string | null;

  source: string;
  note?: string | null;
  generatedAt?: string | null;
  supportedPlaces: DailyPanchangPlaceOption[];
};
