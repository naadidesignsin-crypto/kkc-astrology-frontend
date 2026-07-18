import { Link } from "react-router-dom";

import AstroBackground from "../components/AstroBackground";
import kkcLogo from "../assets/Logo.png";

const whatsappNumber =
  import.meta.env.VITE_KKC_WHATSAPP_NUMBER || "919999999999";

const whatsappMessage = encodeURIComponent(
  "Namaste KKC, I want to book an astrology consultation."
);

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

const services = [
  {
    title: "Astrology Consultation",
    description:
      "Personal guidance for career, marriage, finance, health, education, timing, and important life decisions.",
    icon: "☉",
    linkText: "Book Consultation",
    link: whatsappUrl,
    external: true,
  },
  {
    title: "Kundali Generation",
    description:
      "Generate Lagna, Rashi, Nakshatra, planetary positions, Vimshottari Dasha, Dosha, Navamsa, and PDF report.",
    icon: "☾",
    linkText: "Generate Kundali",
    link: "/kundali",
    external: false,
  },
  {
    title: "Marriage Matching",
    description:
      "Check compatibility, Guna matching, Dosha impact, and marriage timing through Vedic astrology.",
    icon: "♃",
    linkText: "Consult Now",
    link: whatsappUrl,
    external: true,
  },
  {
    title: "Spiritual Guidance",
    description:
      "Guidance for remedies, discipline, inner balance, spiritual timing, and conscious living.",
    icon: "✧",
    linkText: "Speak to KKC",
    link: whatsappUrl,
    external: true,
  },
];

const whyChoose = [
  {
    title: "Traditional Foundation",
    description:
      "Guidance based on Vedic astrology principles, birth chart details, Dasha, Dosha, and planetary timing.",
  },
  {
    title: "Clear Explanation",
    description:
      "Reports and consultations are kept understandable, direct, and useful for real decisions.",
  },
  {
    title: "Personalized Reading",
    description:
      "Every consultation depends on birth details, situation, question, and current life phase.",
  },
  {
    title: "Online Support",
    description:
      "Kundali generation and consultation enquiry are connected through the same astrology portal.",
  },
];

function LandingPage() {
  return (
    <main className="client-home">
      <AstroBackground />

      <header className="client-header">
        <Link to="/" className="client-brand" aria-label="KKC Astrology Home">
          <span className="client-brand-mark">
            <img src={kkcLogo} alt="KKC Astrology Logo" />
          </span>

          <span>
            <strong>KKC Astrology</strong>
            <small>Kundali • Astrology • Spiritual Guidance</small>
          </span>
        </Link>

        <nav className="client-nav" aria-label="Main navigation">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#why">Why KKC</a>
          <Link to="/kundali">Kundali</Link>
          <a href="#contact">Contact</a>
        </nav>

        <a className="client-btn-outline" href={whatsappUrl} target="_blank">
          Book Consultation
        </a>
      </header>

      <section className="client-shell client-hero">
        <div>
          <p className="client-eyebrow">Vedic Astrology Consultation</p>

          <h1>Ancient guidance for clear life decisions</h1>

          <p>
            Generate your Kundali and receive astrology guidance for career,
            marriage, finance, health, Dasha, Dosha, timing, and spiritual
            direction.
          </p>

          <div className="client-actions">
            <Link className="client-btn" to="/kundali">
              Generate Kundali
            </Link>

            <a className="client-btn-outline" href={whatsappUrl} target="_blank">
              Book Consultation
            </a>
          </div>
        </div>

        <div className="client-visual" aria-hidden="true">
          <div className="client-zodiac">
            <span className="client-zodiac-center">ॐ</span>
            <span className="z1">☉</span>
            <span className="z2">☽</span>
            <span className="z3">♂</span>
            <span className="z4">☿</span>
            <span className="z5">♃</span>
            <span className="z6">♀</span>
            <span className="z7">♄</span>
            <span className="z8">☊</span>
          </div>
        </div>
      </section>

      <section className="client-section alt" id="services">
        <div className="client-shell">
          <div className="client-section-head center">
            <p className="client-eyebrow">Astrology Services</p>
            <h2>Guidance, Kundali, compatibility and spiritual clarity</h2>
          </div>

          <div className="client-service-grid">
            {services.map((service) => (
              <article className="client-card" key={service.title}>
                <span className="client-card-icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>

                {service.external ? (
                  <a href={service.link} target="_blank">
                    {service.linkText} →
                  </a>
                ) : (
                  <Link to={service.link}>{service.linkText} →</Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="client-shell client-about" id="about">
        <div>
          <p className="client-eyebrow">About KKC</p>

          <h2>Spiritual insight with practical astrology guidance</h2>

          <p>
            KKC Astrology is focused on helping people understand their birth
            chart, planetary placements, Dasha periods, Dosha impact, and life
            direction through structured Kundali generation and consultation.
          </p>

          <div className="client-actions">
            <Link className="client-btn" to="/kundali">
              Start Kundali
            </Link>
            <a className="client-btn-outline" href={whatsappUrl} target="_blank">
              Speak to KKC
            </a>
          </div>
        </div>

        <div className="client-about-panel">
          <div>
            <span>ॐ</span>
            <strong>Vedic Guidance</strong>
            <small>Kundali • Dasha • Dosha • Navamsa • Parāśara</small>
          </div>
        </div>
      </section>

      <section className="client-section" id="why">
        <div className="client-shell">
          <div className="client-section-head center">
            <p className="client-eyebrow">Why Choose KKC</p>
            <h2>Simple, structured and spiritually grounded</h2>
          </div>

          <div className="client-why-grid">
            {whyChoose.map((item) => (
              <article className="client-why-card" key={item.title}>
                <span>✧</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="client-shell client-contact" id="contact">
        <div>
          <p className="client-eyebrow">Consultation</p>
          <h2>Speak to us for astrology consultation</h2>
          <p>
            Contact KKC for Kundali analysis, marriage matching, Dasha guidance,
            Mangal Dosha analysis, or spiritual consultation.
          </p>
        </div>

        <div className="client-contact-actions">
          <a className="client-btn" href={whatsappUrl} target="_blank">
            Consult on WhatsApp
          </a>

          <Link className="client-btn-outline" to="/kundali">
            Generate Kundali
          </Link>
        </div>
      </section>

      <footer className="client-shell client-footer">
        <div>
          <strong>KKC Astrology</strong>
          <p>Kundali • Astrology • Spiritual Guidance</p>
        </div>

        <div>
          <Link to="/kundali">Kundali</Link>
          <a href="#services">Services</a>
          <a href={whatsappUrl} target="_blank">
            Consultation
          </a>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;