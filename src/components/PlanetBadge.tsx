import sunIcon from "../assets/planets/sun.png";
import moonIcon from "../assets/planets/moon.png";
import marsIcon from "../assets/planets/mars.png";
import mercuryIcon from "../assets/planets/mercury.png";
import jupiterIcon from "../assets/planets/jupiter.png";
import venusIcon from "../assets/planets/venus.png";
import saturnIcon from "../assets/planets/saturn.png";
import rahuIcon from "../assets/planets/rahu.png";
import ketuIcon from "../assets/planets/ketu.png";

const PLANET_IMAGES: Record<string, string> = {
  sun: sunIcon,
  surya: sunIcon,
  moon: moonIcon,
  chandra: moonIcon,
  mars: marsIcon,
  mangal: marsIcon,
  mangala: marsIcon,
  mercury: mercuryIcon,
  budh: mercuryIcon,
  budha: mercuryIcon,
  jupiter: jupiterIcon,
  guru: jupiterIcon,
  venus: venusIcon,
  shukra: venusIcon,
  saturn: saturnIcon,
  shani: saturnIcon,
  rahu: rahuIcon,
  ketu: ketuIcon,
};

type PlanetBadgeProps = {
  name: string;
  compact?: boolean;
};

function normalizePlanetName(name: string) {
  return name.trim().toLowerCase();
}

function PlanetBadge({ name, compact = false }: PlanetBadgeProps) {
  const planetKey = normalizePlanetName(name);
  const image = PLANET_IMAGES[planetKey];

  if (!image) {
    return (
      <span className={compact ? "planet-badge compact fallback" : "planet-badge fallback"}>
        <span>{name.slice(0, 2)}</span>
        <strong>{name}</strong>
      </span>
    );
  }

  return (
    <span className={compact ? "planet-badge compact" : "planet-badge"}>
      <img src={image} alt={name} />
      <strong>{name}</strong>
    </span>
  );
}

export default PlanetBadge;