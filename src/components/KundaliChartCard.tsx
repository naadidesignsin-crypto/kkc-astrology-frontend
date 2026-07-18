import type { KundaliPlanetsResponse, PlanetPosition } from "../types/kundali";
import type { UiLanguage } from "../types/language";
import { toTeluguValue } from "../utils/kundaliTranslations";

type KundaliChartCardProps = {
  planets: KundaliPlanetsResponse;
  language: UiLanguage;
};

const HOUSE_NUMBERS = Array.from({ length: 12 }, (_, index) => index + 1);

function KundaliChartCard({ planets, language }: KundaliChartCardProps) {
  const isTelugu = language === "te";

  const houseMap = HOUSE_NUMBERS.reduce<Record<number, PlanetPosition[]>>(
    (acc, house) => {
      acc[house] = planets.planets.filter((planet) => planet.house === house);
      return acc;
    },
    {}
  );

  function displayValue(value?: string | number | boolean | null) {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return isTelugu ? toTeluguValue(value) : String(value);
  }

  return (
    <div className="result-card kundali-chart-card" id="kundali-chart">
      <div className="chart-heading-row">
        <div>
          <p className="eyebrow">
            {isTelugu ? "జన్మ కుండలి" : "Birth Kundali"}
          </p>
          <h2>
            {isTelugu
              ? "భవాల వారీగా గ్రహ స్థానాలు"
              : "House-wise Planet Positions"}
          </h2>
        </div>

        <span className="chart-badge">
          {isTelugu ? "12 భవ చక్రం" : "12 House Chart"}
        </span>
      </div>

      <div className="south-chart-wrap">
        <div className="south-chart">
          {HOUSE_NUMBERS.map((house) => (
            <HouseCell
              key={house}
              house={house}
              planets={houseMap[house]}
              language={language}
              displayValue={displayValue}
            />
          ))}

          <div className="south-chart-center">
            <span>ॐ</span>
            <strong>{isTelugu ? "జాతక చక్రం" : "Kundali Chart"}</strong>
            <small>{isTelugu ? "జన్మ వివరాల ఆధారంగా" : "Based on birth details"}</small>
          </div>
        </div>
      </div>

      <p className="chart-note">
        {isTelugu
          ? "ఈ చార్ట్ API నుంచి వచ్చిన భవాల వారీ గ్రహ స్థానాల ఆధారంగా చూపించబడింది."
          : "This chart is rendered using the house-wise planet positions returned by the API."}
      </p>
    </div>
  );
}

function HouseCell({
  house,
  planets,
  language,
  displayValue,
}: {
  house: number;
  planets: PlanetPosition[];
  language: UiLanguage;
  displayValue: (value?: string | number | boolean | null) => string;
}) {
  const isTelugu = language === "te";

  return (
    <article className={`south-house south-house-${house}`}>
      <div className="south-house-top">
        <span>{isTelugu ? `${house}వ భవం` : `House ${house}`}</span>
      </div>

      <div className="south-house-planets">
        {planets.length > 0 ? (
          planets.map((planet) => {
            const isLagna =
              planet.name === "लग्न" ||
              planet.name === "లగ్నం" ||
              planet.name?.toLowerCase() === "lagna";

            return (
              <span
                className={isLagna ? "south-planet lagna-chip" : "south-planet"}
                key={`${planet.name}-${planet.longitude}`}
              >
                {displayValue(planet.name)}
              </span>
            );
          })
        ) : (
          <small>{isTelugu ? "ఖాళీ" : "Empty"}</small>
        )}
      </div>
    </article>
  );
}

export default KundaliChartCard;