import type { UiLanguage } from "../types/language";

export type NavagrahaItem = {
  id: string;
  symbol: string;
  nameTe: string;
  nameEn: string;
  roleTe: string;
  roleEn: string;
  shortTe: string;
  shortEn: string;
};

export const navagrahaItems: NavagrahaItem[] = [
  {
    id: "surya",
    symbol: "☀",
    nameTe: "సూర్యుడు",
    nameEn: "Surya",
    roleTe: "ఆత్మబలం • అధికారం • ఆరోగ్యం",
    roleEn: "Soul strength • Authority • Health",
    shortTe: "జీవశక్తి మరియు నాయకత్వానికి సూచకం.",
    shortEn: "Represents vitality, confidence, and leadership.",
  },
  {
    id: "chandra",
    symbol: "☾",
    nameTe: "చంద్రుడు",
    nameEn: "Chandra",
    roleTe: "మనస్సు • భావోద్వేగం • శాంతి",
    roleEn: "Mind • Emotion • Peace",
    shortTe: "మనస్సు, భావాలు, మానసిక స్థితిని సూచిస్తుంది.",
    shortEn: "Represents the mind, emotions, and inner state.",
  },
  {
    id: "mangala",
    symbol: "♂",
    nameTe: "కుజుడు",
    nameEn: "Mangala",
    roleTe: "ధైర్యం • శక్తి • చర్య",
    roleEn: "Courage • Energy • Action",
    shortTe: "ధైర్యం, శక్తి, నిర్ణయం తీసుకునే స్వభావాన్ని సూచిస్తుంది.",
    shortEn: "Represents courage, action, and assertive energy.",
  },
  {
    id: "budha",
    symbol: "☿",
    nameTe: "బుధుడు",
    nameEn: "Budha",
    roleTe: "బుద్ధి • సంభాషణ • వ్యాపారం",
    roleEn: "Intellect • Communication • Trade",
    shortTe: "ఆలోచన, మాటతీరు, వ్యాపార నైపుణ్యాన్ని సూచిస్తుంది.",
    shortEn: "Represents intellect, communication, and analytical ability.",
  },
  {
    id: "guru",
    symbol: "♃",
    nameTe: "గురు",
    nameEn: "Guru",
    roleTe: "జ్ఞానం • ధర్మం • ఆశీర్వాదం",
    roleEn: "Wisdom • Dharma • Blessings",
    shortTe: "జ్ఞానం, గురుకృప, ఆధ్యాత్మిక మార్గాన్ని సూచిస్తుంది.",
    shortEn: "Represents wisdom, guidance, and spiritual growth.",
  },
  {
    id: "shukra",
    symbol: "♀",
    nameTe: "శుక్రుడు",
    nameEn: "Shukra",
    roleTe: "సౌందర్యం • సంబంధాలు • సుఖం",
    roleEn: "Beauty • Relationships • Comfort",
    shortTe: "ప్రేమ, కళ, సౌందర్యం, సుఖసౌకర్యాలను సూచిస్తుంది.",
    shortEn: "Represents love, beauty, art, and comfort.",
  },
  {
    id: "shani",
    symbol: "♄",
    nameTe: "శని",
    nameEn: "Shani",
    roleTe: "కర్మ • క్రమశిక్షణ • సహనం",
    roleEn: "Karma • Discipline • Patience",
    shortTe: "కర్మ, బాధ్యత, శ్రమ, క్రమశిక్షణను సూచిస్తుంది.",
    shortEn: "Represents karma, discipline, responsibility, and endurance.",
  },
  {
    id: "rahu",
    symbol: "☊",
    nameTe: "రాహు",
    nameEn: "Rahu",
    roleTe: "ఆకాంక్ష • మాయ • విదేశీ ప్రభావం",
    roleEn: "Ambition • Illusion • Foreign influence",
    shortTe: "అసాధారణ కోరికలు, మాయ, ఆకస్మిక మార్పులను సూచిస్తుంది.",
    shortEn: "Represents ambition, illusion, disruption, and unconventional paths.",
  },
  {
    id: "ketu",
    symbol: "☋",
    nameTe: "కేతు",
    nameEn: "Ketu",
    roleTe: "విముక్తి • ఆధ్యాత్మికత • గత కర్మ",
    roleEn: "Liberation • Spirituality • Past karma",
    shortTe: "వైరాగ్యం, ఆధ్యాత్మికత, అంతర్ముఖతను సూచిస్తుంది.",
    shortEn: "Represents detachment, spirituality, and inner realization.",
  },
];

export function getGrahaName(item: NavagrahaItem, language: UiLanguage) {
  return language === "te" ? item.nameTe : item.nameEn;
}

export function getGrahaRole(item: NavagrahaItem, language: UiLanguage) {
  return language === "te" ? item.roleTe : item.roleEn;
}

export function getGrahaShort(item: NavagrahaItem, language: UiLanguage) {
  return language === "te" ? item.shortTe : item.shortEn;
}