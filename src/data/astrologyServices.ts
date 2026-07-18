import type { UiLanguage } from "../types/language";

export type AstrologyService = {
  id: string;
  titleTe: string;
  titleEn: string;
  subtitleTe: string;
  subtitleEn: string;
  descriptionTe: string;
  descriptionEn: string;
  pointsTe: string[];
  pointsEn: string[];
};

export const astrologyServices: AstrologyService[] = [
  {
    id: "kundali-analysis",
    titleTe: "జాతక విశ్లేషణ",
    titleEn: "Kundali Analysis",
    subtitleTe: "జన్మ జాతక పరిశీలన",
    subtitleEn: "Birth chart reading",
    descriptionTe:
      "జనన వివరాల ఆధారంగా లగ్నం, రాశి, నక్షత్రం, గ్రహ స్థానాలు మరియు దశలను పరిశీలించే జ్యోతిష్య విశ్లేషణ.",
    descriptionEn:
      "Astrology analysis based on birth details, Lagna, Rashi, Nakshatra, planetary positions, and Dasha periods.",
    pointsTe: ["లగ్నం", "రాశి", "నక్షత్రం", "గ్రహ స్థానాలు"],
    pointsEn: ["Lagna", "Rashi", "Nakshatra", "Planet positions"],
  },
  {
    id: "marriage-matching",
    titleTe: "వివాహ జాతక సరిపోలిక",
    titleEn: "Marriage Matching",
    subtitleTe: "వివాహ అనుకూలత పరిశీలన",
    subtitleEn: "Compatibility analysis",
    descriptionTe:
      "వివాహానికి ముందు జాతక సరిపోలిక, గుణమేళనం, దోష విశ్లేషణ మరియు అనుకూలత పరిశీలన.",
    descriptionEn:
      "Kundali matching, compatibility checking, Guna matching, and dosha analysis before marriage.",
    pointsTe: ["గుణమేళనం", "మంగళ దోషం", "అనుకూలత", "జాతక సరిపోలిక"],
    pointsEn: ["Guna matching", "Mangal Dosha", "Compatibility", "Matching"],
  },
  {
    id: "mangal-dosha",
    titleTe: "మంగళ దోష విశ్లేషణ",
    titleEn: "Mangal Dosha Analysis",
    subtitleTe: "మంగళ స్థానం మరియు ప్రభావం",
    subtitleEn: "Mars placement and impact",
    descriptionTe:
      "జాతకంలో మంగళుడి స్థానం ఆధారంగా మంగళ దోషం, తీవ్రత మరియు ప్రభావాన్ని పరిశీలించడం.",
    descriptionEn:
      "Analysis of Mangal Dosha based on Mars placement, dosha intensity, and possible impact.",
    pointsTe: ["మంగళ స్థానం", "దోష తీవ్రత", "వివాహ ప్రభావం", "సూచనలు"],
    pointsEn: ["Mars placement", "Dosha intensity", "Marriage impact", "Guidance"],
  },
  {
    id: "dasha-guidance",
    titleTe: "దశా భుక్తి మార్గదర్శనం",
    titleEn: "Dasha Guidance",
    subtitleTe: "ప్రస్తుత మరియు రాబోయే దశలు",
    subtitleEn: "Current and upcoming periods",
    descriptionTe:
      "ప్రస్తుత మహాదశ, రాబోయే దశలు మరియు జీవన దశల ఆధారంగా జ్యోతిష్య మార్గదర్శనం.",
    descriptionEn:
      "Guidance based on current Mahadasha, upcoming periods, and major life timing indicators.",
    pointsTe: ["మహాదశ", "అంతర్దశ", "ప్రస్తుత దశ", "రాబోయే కాలం"],
    pointsEn: ["Mahadasha", "Antardasha", "Current period", "Upcoming phase"],
  },
];

export function getServiceTitle(service: AstrologyService, language: UiLanguage) {
  return language === "te" ? service.titleTe : service.titleEn;
}

export function getServiceSubtitle(
  service: AstrologyService,
  language: UiLanguage
) {
  return language === "te" ? service.subtitleTe : service.subtitleEn;
}

export function getServiceDescription(
  service: AstrologyService,
  language: UiLanguage
) {
  return language === "te" ? service.descriptionTe : service.descriptionEn;
}

export function getServicePoints(
  service: AstrologyService,
  language: UiLanguage
) {
  return language === "te" ? service.pointsTe : service.pointsEn;
}