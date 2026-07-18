import type {
  KundaliNavamsaResponse,
  NavamsaPlanetResponse,
} from "../types/kundali";
import type { UiLanguage } from "../types/language";
import { toTeluguValue } from "../utils/kundaliTranslations";

type NavamsaChartCardProps = {
  navamsa: KundaliNavamsaResponse;
  language: UiLanguage;
};

const HOUSE_NUMBERS = Array.from({ length: 12 }, (_, index) => index + 1);

function NavamsaChartCard({ navamsa, language }: NavamsaChartCardProps) {
  const isTelugu = language === "te";

  const houseMap = HOUSE_NUMBERS.reduce<Record<number, NavamsaPlanetResponse[]>>(
    (acc, house) => {
      acc[house] = navamsa.planets.filter(
        (planet) => planet.navamsaHouse === house
      );
      return acc;
    },
    {}
  );

  return (
    <div className="result-card navamsa-card" id="navamsa">
      <div className="chart-heading-row">
        <div>
          <p className="eyebrow">
            {isTelugu ? "నవాంశ చార్ట్" : "Navamsa Chart"}
          </p>

          <h2>
            {isTelugu
              ? "D9 నవాంశ గ్రహ స్థానాలు"
              : "D9 Navamsa Planet Positions"}
          </h2>

          <p>
            {isTelugu
              ? "నవాంశం వివాహం, ధర్మం మరియు గ్రహాల అంతర్గత బలాన్ని పరిశీలించడానికి ఉపయోగిస్తారు."
              : "Navamsa is used to study marriage, dharma, and the inner strength of planets."}
          </p>
        </div>

        <span className="chart-badge">
          {isTelugu ? "లగ్నం" : "Ascendant"}:{" "}
          {displayValue(navamsa.navamsaAscendant, language)}
        </span>
      </div>

      <div className="south-chart-wrap">
        <div className="south-chart">
          {HOUSE_NUMBERS.map((house) => (
            <article className={`south-house south-house-${house}`} key={house}>
              <div className="south-house-top">
                <span>
                  {isTelugu ? `${house}వ భవం` : `House ${house}`}
                </span>
              </div>

              <div className="south-house-planets">
                {houseMap[house].length > 0 ? (
                  houseMap[house].map((planet) => (
                    <span
                      className="south-planet"
                      key={`${planet.planetName}-${planet.birthLongitude}`}
                    >
                      {displayValue(planet.planetName, language)}
                    </span>
                  ))
                ) : (
                  <small>{isTelugu ? "ఖాళీ" : "Empty"}</small>
                )}
              </div>
            </article>
          ))}

          <div className="south-chart-center">
            <span>ॐ</span>
            <strong>{isTelugu ? "నవాంశం" : "Navamsa"}</strong>
            <small>{isTelugu ? "D9 చార్ట్" : "D9 Chart"}</small>
          </div>
        </div>
      </div>

      <div className="table-wrap navamsa-table-wrap">
        <table>
          <thead>
            <tr>
              <th>{isTelugu ? "గ్రహం" : "Planet"}</th>
              <th>{isTelugu ? "జన్మ రాశి" : "Birth Rashi"}</th>
              <th>{isTelugu ? "జన్మ భవం" : "Birth House"}</th>
              <th>{isTelugu ? "నక్షత్రం" : "Nakshatra"}</th>
              <th>{isTelugu ? "నవాంశ రాశి" : "Navamsa Rashi"}</th>
              <th>{isTelugu ? "నవాంశ భవం" : "Navamsa House"}</th>
            </tr>
          </thead>

          <tbody>
            {navamsa.planets.map((planet) => (
              <tr key={`${planet.planetName}-${planet.birthLongitude}`}>
                <td>{displayValue(planet.planetName, language)}</td>
                <td>{displayValue(planet.birthRashi, language)}</td>
                <td>{planet.birthHouse ?? "-"}</td>
                <td>{displayValue(planet.birthNakshatra, language)}</td>
                <td>{displayValue(planet.navamsaRashi, language)}</td>
                <td>{planet.navamsaHouse ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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

export default NavamsaChartCard;