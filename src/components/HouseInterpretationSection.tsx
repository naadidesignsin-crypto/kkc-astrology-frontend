import type {
  HouseInterpretationResponse,
  KundaliHouseResponse,
} from "../types/kundali";
import type { UiLanguage } from "../types/language";
import { toTeluguValue } from "../utils/kundaliTranslations";

type HouseInterpretationSectionProps = {
  houses: KundaliHouseResponse;
  language: UiLanguage;
};

type HouseCopy = {
  houseNameEn: string;
  houseNameTe: string;
  mainAreaEn: string;
  mainAreaTe: string;
  meaningEn: string;
  meaningTe: string;
};

const HOUSE_COPY: Record<number, HouseCopy> = {
  1: {
    houseNameEn: "First House",
    houseNameTe: "మొదటి భవం",
    mainAreaEn: "Self, personality, body, life direction",
    mainAreaTe: "వ్యక్తిత్వం, శరీరం, ఆరోగ్యం, జీవిత దిశ",
    meaningEn:
      "The first house shows personality, physical body, confidence, general health, and the overall direction of life.",
    meaningTe:
      "మొదటి భవం వ్యక్తిత్వం, శరీరం, ఆత్మవిశ్వాసం, సాధారణ ఆరోగ్యం మరియు జీవిత దిశను సూచిస్తుంది.",
  },
  2: {
    houseNameEn: "Second House",
    houseNameTe: "రెండవ భవం",
    mainAreaEn: "Family, speech, wealth, food habits",
    mainAreaTe: "కుటుంబం, మాట, సంపద, ఆహార అలవాట్లు",
    meaningEn:
      "The second house shows family background, accumulated wealth, speech, food habits, and value system.",
    meaningTe:
      "రెండవ భవం కుటుంబ నేపథ్యం, సంపాదించిన ధనం, మాట, ఆహార అలవాట్లు మరియు విలువలను సూచిస్తుంది.",
  },
  3: {
    houseNameEn: "Third House",
    houseNameTe: "మూడవ భవం",
    mainAreaEn: "Courage, communication, siblings, efforts",
    mainAreaTe: "ధైర్యం, సంభాషణ, సహోదరులు, ప్రయత్నం",
    meaningEn:
      "The third house shows courage, communication skills, younger siblings, short travel, and self-effort.",
    meaningTe:
      "మూడవ భవం ధైర్యం, సంభాషణ నైపుణ్యం, తమ్ముళ్లు/చెల్లెళ్లు, చిన్న ప్రయాణాలు మరియు స్వప్రయత్నాన్ని సూచిస్తుంది.",
  },
  4: {
    houseNameEn: "Fourth House",
    houseNameTe: "నాలుగవ భవం",
    mainAreaEn: "Mother, home, property, comfort, inner peace",
    mainAreaTe: "తల్లి, ఇల్లు, ఆస్తి, సౌఖ్యం, మానసిక శాంతి",
    meaningEn:
      "The fourth house shows mother, home, property, vehicles, emotional security, and domestic comfort.",
    meaningTe:
      "నాలుగవ భవం తల్లి, ఇల్లు, ఆస్తి, వాహనాలు, భావోద్వేగ భద్రత మరియు గృహ సౌఖ్యాన్ని సూచిస్తుంది.",
  },
  5: {
    houseNameEn: "Fifth House",
    houseNameTe: "ఐదవ భవం",
    mainAreaEn: "Education, intelligence, children, creativity",
    mainAreaTe: "విద్య, బుద్ధి, సంతానం, సృజనాత్మకత",
    meaningEn:
      "The fifth house shows intelligence, education, creativity, children, mantra, past-life merit, and decision-making ability.",
    meaningTe:
      "ఐదవ భవం బుద్ధి, విద్య, సృజనాత్మకత, సంతానం, మంత్రం, పూర్వ పుణ్యం మరియు నిర్ణయ సామర్థ్యాన్ని సూచిస్తుంది.",
  },
  6: {
    houseNameEn: "Sixth House",
    houseNameTe: "ఆరవ భవం",
    mainAreaEn: "Health issues, debts, enemies, service",
    mainAreaTe: "ఆరోగ్య సమస్యలు, అప్పులు, శత్రువులు, సేవ",
    meaningEn:
      "The sixth house shows diseases, debts, enemies, competition, daily work, service, and ability to overcome obstacles.",
    meaningTe:
      "ఆరవ భవం వ్యాధులు, అప్పులు, శత్రువులు, పోటీ, రోజువారీ పని, సేవ మరియు అడ్డంకులను అధిగమించే శక్తిని సూచిస్తుంది.",
  },
  7: {
    houseNameEn: "Seventh House",
    houseNameTe: "ఏడవ భవం",
    mainAreaEn: "Marriage, partnerships, public dealing",
    mainAreaTe: "వివాహం, భాగస్వామ్యం, ప్రజలతో సంబంధాలు",
    meaningEn:
      "The seventh house shows marriage, spouse, business partnerships, agreements, and public interactions.",
    meaningTe:
      "ఏడవ భవం వివాహం, జీవిత భాగస్వామి, వ్యాపార భాగస్వామ్యం, ఒప్పందాలు మరియు ప్రజలతో సంబంధాలను సూచిస్తుంది.",
  },
  8: {
    houseNameEn: "Eighth House",
    houseNameTe: "ఎనిమిదవ భవం",
    mainAreaEn: "Longevity, transformation, secrets, sudden events",
    mainAreaTe: "ఆయుష్షు, మార్పు, రహస్యాలు, ఆకస్మిక సంఘటనలు",
    meaningEn:
      "The eighth house shows longevity, sudden events, hidden matters, transformation, inheritance, and deep research.",
    meaningTe:
      "ఎనిమిదవ భవం ఆయుష్షు, ఆకస్మిక సంఘటనలు, రహస్య విషయాలు, మార్పు, వారసత్వం మరియు లోతైన పరిశోధనను సూచిస్తుంది.",
  },
  9: {
    houseNameEn: "Ninth House",
    houseNameTe: "తొమ్మిదవ భవం",
    mainAreaEn: "Fortune, dharma, father, higher wisdom",
    mainAreaTe: "భాగ్యం, ధర్మం, తండ్రి, ఉన్నత జ్ఞానం",
    meaningEn:
      "The ninth house shows fortune, dharma, father, teachers, blessings, higher learning, and long-distance travel.",
    meaningTe:
      "తొమ్మిదవ భవం భాగ్యం, ధర్మం, తండ్రి, గురువులు, ఆశీర్వాదం, ఉన్నత విద్య మరియు దూర ప్రయాణాన్ని సూచిస్తుంది.",
  },
  10: {
    houseNameEn: "Tenth House",
    houseNameTe: "పదవ భవం",
    mainAreaEn: "Career, profession, karma, public status",
    mainAreaTe: "వృత్తి, ఉద్యోగం, కర్మ, సామాజిక స్థానం",
    meaningEn:
      "The tenth house shows career, profession, authority, social status, responsibilities, and public actions.",
    meaningTe:
      "పదవ భవం వృత్తి, ఉద్యోగం, అధికారం, సామాజిక స్థానం, బాధ్యతలు మరియు బాహ్య కార్యాలను సూచిస్తుంది.",
  },
  11: {
    houseNameEn: "Eleventh House",
    houseNameTe: "పదకొండవ భవం",
    mainAreaEn: "Income, gains, network, fulfilment of desires",
    mainAreaTe: "ఆదాయం, లాభాలు, పరిచయ వర్గం, కోరికల నెరవేర్పు",
    meaningEn:
      "The eleventh house shows income, gains, elder siblings, social network, achievements, and fulfilment of desires.",
    meaningTe:
      "పదకొండవ భవం ఆదాయం, లాభాలు, పెద్ద సహోదరులు, పరిచయ వర్గం, విజయాలు మరియు కోరికల నెరవేర్పును సూచిస్తుంది.",
  },
  12: {
    houseNameEn: "Twelfth House",
    houseNameTe: "పన్నెండవ భవం",
    mainAreaEn: "Expenses, foreign lands, sleep, spirituality, isolation",
    mainAreaTe: "ఖర్చులు, విదేశాలు, నిద్ర, ఆధ్యాత్మికత, ఏకాంతం",
    meaningEn:
      "The twelfth house shows expenses, foreign residence, sleep, isolation, losses, moksha, and spiritual withdrawal.",
    meaningTe:
      "పన్నెండవ భవం ఖర్చులు, విదేశ నివాసం, నిద్ర, ఏకాంతం, నష్టాలు, మోక్షం మరియు ఆధ్యాత్మిక విరక్తిని సూచిస్తుంది.",
  },
};

function HouseInterpretationSection({
  houses,
  language,
}: HouseInterpretationSectionProps) {
  const isTelugu = language === "te";

  const sortedHouses = [...houses.houses].sort(
    (left, right) => left.houseNumber - right.houseNumber
  );

  return (
    <div className="result-card house-interpretation-section" id="houses">
      <div className="house-section-heading">
        <div>
          <p className="eyebrow">
            {isTelugu ? "పరాశర జ్యోతిష్యం" : "Parāśara Astrology"}
          </p>

          <h2>
            {isTelugu
              ? "భవాల వారీగా జాతక విశ్లేషణ"
              : "House-wise Kundali Interpretation"}
          </h2>

          <p>
            {isTelugu
              ? "ప్రతి భవం జీవితంలోని ఒక ముఖ్యమైన విభాగాన్ని సూచిస్తుంది. ఈ విభాగం API నుంచి వచ్చిన గ్రహ స్థానాల ఆధారంగా చూపించబడుతుంది."
              : "Each house represents a key life area. This section is generated using the house-wise planetary positions returned by the backend."}
          </p>
        </div>

        <span className="house-section-badge">
          {isTelugu ? "12 భవాలు" : "12 Houses"}
        </span>
      </div>

      <div className="house-interpretation-grid">
        {sortedHouses.map((house) => (
          <HouseCard key={house.houseNumber} house={house} language={language} />
        ))}
      </div>
    </div>
  );
}

function HouseCard({
  house,
  language,
}: {
  house: HouseInterpretationResponse;
  language: UiLanguage;
}) {
  const isTelugu = language === "te";
  const copy = HOUSE_COPY[house.houseNumber];
  const planets = house.planets || [];

  return (
    <article className="house-interpretation-card">
      <div className="house-card-top">
        <span>
          {isTelugu
            ? `${house.houseNumber}వ భవం`
            : `House ${house.houseNumber}`}
        </span>

        <strong>{isTelugu ? copy.houseNameTe : copy.houseNameEn}</strong>
      </div>

      <div className="house-main-area">
        {isTelugu ? copy.mainAreaTe : copy.mainAreaEn}
      </div>

      <p>{isTelugu ? copy.meaningTe : copy.meaningEn}</p>

      <div className="house-planets-block">
        <small>{isTelugu ? "ఈ భవంలోని గ్రహాలు" : "Planets in this house"}</small>

        {planets.length > 0 ? (
          <div className="house-planet-list">
            {planets.map((planet) => (
              <span
                className="house-planet-chip"
                key={`${planet.name}-${planet.degree}`}
              >
                {displayValue(planet.name, language)}
              </span>
            ))}
          </div>
        ) : (
          <div className="house-empty-text">
            {isTelugu
              ? "ఈ భవంలో ప్రత్యక్ష గ్రహ స్థానం లేదు."
              : "No direct planet placement in this house."}
          </div>
        )}
      </div>

      <div className="house-interpretation-text">
        {buildInterpretation(house, language)}
      </div>
    </article>
  );
}

function buildInterpretation(
  house: HouseInterpretationResponse,
  language: UiLanguage
) {
  const isTelugu = language === "te";
  const planets = house.planets || [];

  if (planets.length === 0) {
    return isTelugu
      ? "ఈ భవానికి తుది ఫలితాన్ని భవాధిపతి, దృష్టులు, గ్రహ బలం మరియు నడుస్తున్న దశ ఆధారంగా పరిశీలించాలి."
      : "Final prediction for this house should be checked through the house lord, aspects, planetary strength, and running Dasha.";
  }

  const planetNames = planets
    .map((planet) => displayValue(planet.name, language))
    .filter(Boolean)
    .join(", ");

  return isTelugu
    ? `${planetNames} ఈ భవాన్ని చురుకుగా చేస్తాయి. తుది ఫలితానికి భవాధిపతి, దృష్టులు, నక్షత్రం మరియు ప్రస్తుత దశను కూడా పరిశీలించాలి.`
    : `${planetNames} activate this house. Final prediction should also consider the house lord, aspects, Nakshatra, and current Dasha.`;
}

function displayValue(
  value: string | number | boolean | null | undefined,
  language: UiLanguage
) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return language === "te" ? toTeluguValue(value) : String(value);
}

export default HouseInterpretationSection;