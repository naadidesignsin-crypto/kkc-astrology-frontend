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

function BlackWhiteCosmicBackground() {
  return (
    <div className="bw-cosmic-bg" aria-hidden="true">
      <div className="bw-stars bw-stars-one" />
      <div className="bw-stars bw-stars-two" />

      <div className="bw-orbit-system">
        <span className="bw-orbit bw-orbit-one" />
        <span className="bw-orbit bw-orbit-two" />
        <span className="bw-orbit bw-orbit-three" />

        <span className="bw-om">ॐ</span>

        {planets.map((planet, index) => (
          <span className={`bw-planet bw-planet-${index + 1}`} key={planet.name}>
            <img src={planet.image} alt="" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default BlackWhiteCosmicBackground;