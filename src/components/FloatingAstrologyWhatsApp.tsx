import type { UiLanguage } from "../types/language";

type FloatingAstrologyWhatsAppProps = {
  language: UiLanguage;
};

const whatsappNumber =
  import.meta.env.VITE_KKC_WHATSAPP_NUMBER || "919999999999";

function FloatingAstrologyWhatsApp({ language }: FloatingAstrologyWhatsAppProps) {
  const isTelugu = language === "te";

  const message = isTelugu
    ? "Namaste KKC, నాకు జాతకం / జ్యోతిష్య సంప్రదింపుల వివరాలు కావాలి."
    : "Namaste KKC, I need astrology or Kundali consultation details.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      className="floating-astro-whatsapp"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={
        isTelugu
          ? "WhatsApp ద్వారా జ్యోతిష్య సంప్రదింపులు"
          : "Astrology consultation on WhatsApp"
      }
    >
      <span className="floating-whatsapp-dot" />
      <strong>{isTelugu ? "జ్యోతిష్య సహాయం" : "Astrology Help"}</strong>
    </a>
  );
}

export default FloatingAstrologyWhatsApp;