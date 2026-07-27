import PlanetBadge from "./PlanetBadge";
import type { KundaliPlanetsResponse } from "../types/kundali";

type PlanetPosition = KundaliPlanetsResponse["planets"][number];

type HouseMeta = {
  house: number;
  name: string;
  area: string;
  type: "kendra" | "trikona" | "regular";
  className: string;
};

const houseMeta: HouseMeta[] = [
  {
    house: 1,
    name: "Self",
    area: "Body / Identity",
    type: "kendra",
    className: "kundali-house-1",
  },
  {
    house: 2,
    name: "Wealth",
    area: "Family / Speech",
    type: "regular",
    className: "kundali-house-2",
  },
  {
    house: 3,
    name: "Courage",
    area: "Siblings / Effort",
    type: "regular",
    className: "kundali-house-3",
  },
  {
    house: 4,
    name: "Home",
    area: "Mother / Property",
    type: "kendra",
    className: "kundali-house-4",
  },
  {
    house: 5,
    name: "Intelligence",
    area: "Education / Children",
    type: "trikona",
    className: "kundali-house-5",
  },
  {
    house: 6,
    name: "Service",
    area: "Health / Enemies",
    type: "regular",
    className: "kundali-house-6",
  },
  {
    house: 7,
    name: "Marriage",
    area: "Spouse / Partnership",
    type: "kendra",
    className: "kundali-house-7",
  },
  {
    house: 8,
    name: "Transformation",
    area: "Longevity / Secrets",
    type: "regular",
    className: "kundali-house-8",
  },
  {
    house: 9,
    name: "Dharma",
    area: "Fortune / Father",
    type: "trikona",
    className: "kundali-house-9",
  },
  {
    house: 10,
    name: "Career",
    area: "Work / Status",
    type: "kendra",
    className: "kundali-house-10",
  },
  {
    house: 11,
    name: "Gains",
    area: "Income / Network",
    type: "regular",
    className: "kundali-house-11",
  },
  {
    house: 12,
    name: "Moksha",
    area: "Spirituality / Loss",
    type: "regular",
    className: "kundali-house-12",
  },
];

function getHousePlanets(planets: PlanetPosition[], houseNumber: number) {
  return planets.filter((planet) => Number(planet.house) === houseNumber);
}

function SouthIndianBirthChart({
  planets,
}: {
  planets: KundaliPlanetsResponse;
}) {
  const occupiedHouses = houseMeta.filter(
    (house) => getHousePlanets(planets.planets, house.house).length > 0
  );

  const totalPlanetPlacements = planets.planets.filter(
    (planet) => planet.house !== null && planet.house !== undefined
  ).length;

  const lagnaPlacement = planets.planets.find((planet) => {
    const name = planet.name.toLowerCase();
    return name.includes("lagna") || name.includes("ascendant");
  });

  const tenthHousePlanets = getHousePlanets(planets.planets, 10);
  const seventhHousePlanets = getHousePlanets(planets.planets, 7);

  return (
    <div className="kundali-chart-experience">
      <div className="kundali-chart-overview">
        <div className="kundali-chart-overview-copy">
          <p className="report-section-kicker">Visual Kundali</p>
          <h4>South Indian Rashi Chart</h4>
          <p>
            A 12-house layout showing where each graha is placed in the birth
            chart. Important houses are visually separated for easier reading.
          </p>
        </div>

        <div className="kundali-chart-stats">
          <div>
            <span>Occupied Houses</span>
            <strong>{occupiedHouses.length}/12</strong>
          </div>

          <div>
            <span>Planet Placements</span>
            <strong>{totalPlanetPlacements}</strong>
          </div>

          <div>
            <span>Lagna</span>
            <strong>{lagnaPlacement?.rashi || "Available in chart"}</strong>
          </div>
        </div>
      </div>

      <div className="kundali-chart-layout">
        <div className="kundali-chart-pro" aria-label="South Indian Kundali chart">
          <div className="kundali-chart-center">
            <span>ॐ</span>
            <strong>KKC</strong>
            <small>Kundali</small>
          </div>

          {houseMeta.map((house) => {
            const housePlanets = getHousePlanets(planets.planets, house.house);
            const hasPlanets = housePlanets.length > 0;

            return (
              <section
                className={[
                  "kundali-house-cell",
                  house.className,
                  `kundali-house-${house.type}`,
                  hasPlanets ? "has-planets" : "empty-house",
                ].join(" ")}
                key={house.house}
              >
                <div className="kundali-house-head">
                  <span>House {house.house}</span>
                  <strong>{house.name}</strong>
                </div>

                <small className="kundali-house-area">{house.area}</small>

                <div className="kundali-house-planets">
                  {hasPlanets ? (
                    housePlanets.map((planet) => (
                      <PlanetBadge
                        key={`${house.house}-${planet.name}`}
                        name={planet.name}
                        compact
                      />
                    ))
                  ) : (
                    <span className="empty-house-chip">No planet</span>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="kundali-chart-side-panel">
          <div>
            <span>Kendra Houses</span>
            <strong>1, 4, 7, 10</strong>
            <p>Core life pillars: self, home, marriage and career.</p>
          </div>

          <div>
            <span>Trikona Houses</span>
            <strong>1, 5, 9</strong>
            <p>Dharma houses connected with fortune, intelligence and purpose.</p>
          </div>

          <div>
            <span>Marriage Focus</span>
            <strong>
              {seventhHousePlanets.length > 0
                ? seventhHousePlanets.map((planet) => planet.name).join(", ")
                : "No planet"}
            </strong>
          </div>

          <div>
            <span>Career Focus</span>
            <strong>
              {tenthHousePlanets.length > 0
                ? tenthHousePlanets.map((planet) => planet.name).join(", ")
                : "No planet"}
            </strong>
          </div>
        </aside>
      </div>

      <div className="kundali-chart-legend">
        <span>
          <i className="legend-dot kendra" />
          Kendra house
        </span>

        <span>
          <i className="legend-dot trikona" />
          Trikona house
        </span>

        <span>
          <i className="legend-dot regular" />
          Regular house
        </span>

        <span>
          <i className="legend-dot planet" />
          Planet placement
        </span>
      </div>
    </div>
  );
}

export default SouthIndianBirthChart;