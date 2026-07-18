import { astrologyServices } from "../data/astrologyServices";

const whatsappNumber =
  import.meta.env.VITE_KKC_WHATSAPP_NUMBER || "919700051668";

const comSiteUrl = import.meta.env.VITE_KKC_COM_SITE || "https://kkcorg.com";

function AstrologyServices() {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Namaste KKC, I need astrology/Kundali consultation details."
  )}`;

  return (
    <section className="services-section" id="services">
      <div className="section-heading">
        <p className="eyebrow">జ్యోతిష్య సేవలు</p>
        <h2>Astrology & Kundali Services</h2>
        <p>
          ఈ .in పేజీ జాతకం, జ్యోతిష్యం మరియు సంప్రదింపుల కోసం మాత్రమే. Donation,
          Events, Video Gallery వివరాలు .com సైట్‌లో ఉంటాయి.
        </p>
      </div>

      <div className="services-grid">
        {astrologyServices.map((service) => (
          <article className="service-card" key={service.id}>
            <span className="service-icon">✦</span>
            <h3>{service.title}</h3>
            <small>{service.subtitle}</small>
            <p>{service.description}</p>

            <div className="service-tags">
              {service.points.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="consultation-card" id="contact">
        <div>
          <p className="eyebrow">సంప్రదించండి</p>
          <h2>జ్యోతిష్య సంప్రదింపుల కోసం మాట్లాడండి</h2>
          <p>
            జాతక వివరాలు, వివాహ సరిపోలిక, మంగళ దోషం లేదా దశా మార్గదర్శనం కోసం
            WhatsApp ద్వారా సంప్రదించండి.
          </p>
        </div>

        <div className="consultation-actions">
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp ద్వారా సంప్రదించండి
          </a>

          <a href={comSiteUrl} target="_blank" rel="noreferrer" className="ghost-link">
            Events / Donation కోసం .com చూడండి
          </a>
        </div>
      </div>
    </section>
  );
}

export default AstrologyServices;