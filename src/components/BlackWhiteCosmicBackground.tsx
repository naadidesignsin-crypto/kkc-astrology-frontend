const planets = ["☉", "☽", "♂", "☿", "♃", "♀", "♄", "☊"];

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
          <span
            className={`bw-planet bw-planet-${index + 1}`}
            key={planet}
          >
            {planet}
          </span>
        ))}
      </div>
    </div>
  );
}

export default BlackWhiteCosmicBackground;