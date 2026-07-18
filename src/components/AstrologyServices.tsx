import {
  astrologyServices,
  getServiceDescription,
  getServicePoints,
  getServiceSubtitle,
  getServiceTitle,
} from "../data/astrologyServices";
import type { UiLanguage } from "../types/language";

type AstrologyServicesProps = {
  language: UiLanguage;
};

const whatsappNumber =
  import.meta.env.VITE_KKC_WHATSAPP_NUMBER || "919999999999";

const comSiteUrl = import.meta.env.VITE_KKC_COM_SITE || "https://kkcorg.com";

function AstrologyServices({ language }: AstrologyServicesProps) {
  const isTelugu = language === "te";

  const whatsappMessage = isTelugu
    ? "Namaste KKC, నాకు జ్యోతిష్యం / జాతక సంప్రదింపుల వివరాలు కావాలి."
    : "Namaste KKC, I need astrology or Kundali consultation details.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section className="services-section" id="services">
      <div className="section-heading">
        <p className="eyebrow">
          {isTelugu ? "జ్యోతిష్య సేవలు" : "Astrology Services"}
        </p>

        <h2>
          {isTelugu
            ? "జాతకం మరియు జ్యోతిష్య సేవలు"
            : "Astrology & Kundali Services"}
        </h2>

        <p>
          {isTelugu
            ? "ఈ .in పేజీ జాతకం, జ్యోతిష్యం మరియు సంప్రదింపుల కోసం మాత్రమే. Donation, Events, Video Gallery వివరాలు .com సైట్‌లో ఉంటాయి."
            : "This .in portal is only for Kundali, astrology, and consultation services. Donation, Events, and Video Gallery will remain on the .com site."}
        </p>
      </div>

      <div className="services-grid">
        {astrologyServices.map((service) => (
          <article className="service-card" key={service.id}>
            <span className="service-icon">✦</span>

            <h3>{getServiceTitle(service, language)}</h3>
            <small>{getServiceSubtitle(service, language)}</small>

            <p>{getServiceDescription(service, language)}</p>

            <div className="service-tags">
              {getServicePoints(service, language).map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="consultation-card" id="contact">
        <div>
          <p className="eyebrow">
            {isTelugu ? "సంప్రదించండి" : "Consultation"}
          </p>

          <h2>
            {isTelugu
              ? "జ్యోతిష్య సంప్రదింపుల కోసం మాట్లాడండి"
              : "Speak to us for astrology consultation"}
          </h2>

          <p>
            {isTelugu
              ? "జాతక వివరాలు, వివాహ సరిపోలిక, మంగళ దోషం లేదా దశా మార్గదర్శనం కోసం WhatsApp ద్వారా సంప్రదించండి."
              : "Contact us on WhatsApp for Kundali analysis, marriage matching, Mangal Dosha, or Dasha guidance."}
          </p>
        </div>

        <div className="consultation-actions">
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            {isTelugu ? "WhatsApp ద్వారా సంప్రదించండి" : "Consult on WhatsApp"}
          </a>

          <a
            href={comSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="ghost-link"
          >
            {isTelugu
              ? "Events / Donation కోసం .com చూడండి"
              : "Visit .com for Events / Donation"}
          </a>
        </div>
      </div>
    </section>
  );
}

export default AstrologyServices;