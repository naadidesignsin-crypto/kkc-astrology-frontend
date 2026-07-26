import PlanetBadge from "./PlanetBadge";
import type { KundaliPlanetsResponse } from "../types/kundali";

type SouthIndianBirthChartProps = {
  planets: KundaliPlanetsResponse;
};

const housePositions = [
  { house: 1, className: "chart-house-1" },
  { house: 2, className: "chart-house-2" },
  { house: 3, className: "chart-house-3" },
  { house: 4, className: "chart-house-4" },
  { house: 5, className: "chart-house-5" },
  { house: 6, className: "chart-house-6" },
  { house: 7, className: "chart-house-7" },
  { house: 8, className: "chart-house-8" },
  { house: 9, className: "chart-house-9" },
  { house: 10, className: "chart-house-10" },
  { house: 11, className: "chart-house-11" },
  { house: 12, className: "chart-house-12" },
];

function SouthIndianBirthChart({ planets }: SouthIndianBirthChartProps) {
  return (
    <div className="south-chart-shell">
      <div className="south-chart-title">
        <span>ॐ</span>
        <div>
          <h4>South Indian Birth Chart</h4>
          <p>12-house planetary placement</p>
        </div>
      </div>

      <div className="south-chart">
        <div className="south-chart-center">
          <span>KKC</span>
          <strong>Kundali</strong>
        </div>

        {housePositions.map((item) => {
          const housePlanets = planets.planets.filter(
            (planet) => planet.house === item.house
          );

          return (
            <div className={`south-chart-house ${item.className}`} key={item.house}>
              <span className="south-house-number">House {item.house}</span>

              <div className="south-house-planets">
                {housePlanets.length === 0 ? (
                  <small>No planet</small>
                ) : (
                  housePlanets.map((planet) => (
                    <PlanetBadge
                      key={`${item.house}-${planet.name}`}
                      name={planet.name}
                      compact
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SouthIndianBirthChart;