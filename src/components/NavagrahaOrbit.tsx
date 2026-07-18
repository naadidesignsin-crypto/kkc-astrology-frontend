import {
  getGrahaName,
  getGrahaRole,
  getGrahaShort,
  navagrahaItems,
} from "../data/navagraha";
import type { UiLanguage } from "../types/language";

type NavagrahaOrbitProps = {
  language: UiLanguage;
};

function NavagrahaOrbit({ language }: NavagrahaOrbitProps) {
  const isTelugu = language === "te";

  return (
    <section className="navagraha-section" id="navagraha">
      <div className="navagraha-copy">
        <p className="eyebrow">
          {isTelugu ? "నవగ్రహ శక్తులు" : "Navagraha Energies"}
        </p>

        <h2>
          {isTelugu
            ? "జాతకంలో గ్రహ స్థానాల ప్రభావం"
            : "Planetary influence in Kundali"}
        </h2>

        <p>
          {isTelugu
            ? "వేద జ్యోతిష్యంలో సూర్యుడు నుంచి కేతువరకు ప్రతి గ్రహం వ్యక్తి స్వభావం, కాలదశ, నిర్ణయాలు మరియు జీవన మార్గంపై ప్రత్యేక ప్రభావాన్ని చూపుతుంది."
            : "In Vedic astrology, each graha from Surya to Ketu influences temperament, timing, decisions, and life direction."}
        </p>

        <a href="#kundali-form" className="navagraha-cta">
          {isTelugu ? "జాతకం రూపొందించండి" : "Generate Kundali"}
        </a>
      </div>

      <div className="navagraha-orbit-wrap" aria-label="Navagraha orbit visual">
        <div className="orbit-glow" />

        <div className="orbit-center">
          <span>ॐ</span>
          <strong>{isTelugu ? "జాతకం" : "Kundali"}</strong>
        </div>

        <div className="orbit-ring orbit-ring-large" />
        <div className="orbit-ring orbit-ring-small" />

        {navagrahaItems.map((item, index) => (
          <button
            type="button"
            className={`graha-node graha-node-${index + 1}`}
            key={item.id}
            title={getGrahaName(item, language)}
          >
            <span>{item.symbol}</span>
            <small>{getGrahaName(item, language)}</small>
          </button>
        ))}
      </div>

      <div className="navagraha-grid">
        {navagrahaItems.map((item) => (
          <article className="graha-card" key={item.id}>
            <span className="graha-card-symbol">{item.symbol}</span>

            <div>
              <h3>{getGrahaName(item, language)}</h3>
              <strong>{getGrahaRole(item, language)}</strong>
              <p>{getGrahaShort(item, language)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NavagrahaOrbit;