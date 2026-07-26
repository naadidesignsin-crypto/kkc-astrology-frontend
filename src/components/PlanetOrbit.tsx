import sunIcon from "../assets/planets/sun.png";
import moonIcon from "../assets/planets/moon.png";
import marsIcon from "../assets/planets/mars.png";
import mercuryIcon from "../assets/planets/mercury.png";
import jupiterIcon from "../assets/planets/jupiter.png";
import venusIcon from "../assets/planets/venus.png";
import saturnIcon from "../assets/planets/saturn.png";
import rahuIcon from "../assets/planets/rahu.png";
import ketuIcon from "../assets/planets/ketu.png";

const planets = [
  { name: "Sun", image: sunIcon },
  { name: "Moon", image: moonIcon },
  { name: "Mars", image: marsIcon },
  { name: "Mercury", image: mercuryIcon },
  { name: "Jupiter", image: jupiterIcon },
  { name: "Venus", image: venusIcon },
  { name: "Saturn", image: saturnIcon },
  { name: "Rahu", image: rahuIcon },
  { name: "Ketu", image: ketuIcon },
];

function PlanetOrbit() {
  return (
    <div className="kkc-planet-orbit" aria-label="Navagraha orbit animation">
      <span className="kkc-planet-ring kkc-planet-ring-one" />
      <span className="kkc-planet-ring kkc-planet-ring-two" />
      <span className="kkc-planet-ring kkc-planet-ring-three" />

      <div className="kkc-planet-center">
        <span>ॐ</span>
      </div>

      <div className="kkc-planet-track">
        {planets.map((planet, index) => (
          <span
            className="kkc-planet-item"
            style={
              {
                "--planet-index": index,
                "--planet-count": planets.length,
              } as React.CSSProperties
            }
            key={planet.name}
          >
            <img src={planet.image} alt={planet.name} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default PlanetOrbit;