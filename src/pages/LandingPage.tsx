import { Link } from "react-router-dom";

import kkcLogo from "../assets/Logo.png";
import BlackWhiteCosmicBackground from "../components/BlackWhiteCosmicBackground";
import PlanetOrbit from "../components/PlanetOrbit";

const whatsappNumber =
  import.meta.env.VITE_KKC_WHATSAPP_NUMBER || "919700051668";

const whatsappMessage = encodeURIComponent(
  "Namaste KKC, I want to book an astrology consultation."
);

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

const services = [
  {
    title: "Kundali Generation",
    description:
      "Generate a private KKC Order ID with basic birth details. Advanced report sections unlock only after admin approval.",
    icon: "☉",
    link: "/kundali",
    external: false,
    cta: "Generate Kundali",
  },
  {
    title: "Astrology Consultation",
    description:
      "Receive guided consultation based on birth details, planetary positions, timing and life direction.",
    icon: "◎",
    link: whatsappUrl,
    external: true,
    cta: "Book Consultation",
  },
  {
    title: "Devotional Events",
    description:
      "Participate in spiritual gatherings, devotional activities and KKC community events.",
    icon: "◌",
    link: whatsappUrl,
    external: true,
    cta: "Ask on WhatsApp",
  },
  {
    title: "Spiritual Guidance",
    description:
      "Get practical guidance rooted in Vedic wisdom, conscious living and inner discipline.",
    icon: "✦",
    link: whatsappUrl,
    external: true,
    cta: "Get Guidance",
  },
];

const kundaliSteps = [
  {
    number: "01",
    title: "Enter Birth Details",
    description:
      "Submit name, gender, date, time and birth place with accurate location.",
  },
  {
    number: "02",
    title: "Get KKC Order ID",
    description:
      "The system generates a unique Order ID for reopening the report later.",
  },
  {
    number: "03",
    title: "Admin Reviews Access",
    description:
      "Admin checks the report request and approves the required report sections.",
  },
  {
    number: "04",
    title: "Approved Tabs Unlock",
    description:
      "Only approved tabs like planets, houses, Dasha, Dosha or PDF become visible.",
  },
];

const whyChoose = [
  {
    title: "Vedic-Based Guidance",
    description:
      "Consultation flow is structured around birth details, planetary timing and traditional reading methods.",
    icon: "♙",
  },
  {
    title: "Private Report Access",
    description:
      "Every generated Kundali gets a unique Order ID. Users can reopen only their own approved report.",
    icon: "♢",
  },
  {
    title: "Clear Approval Flow",
    description:
      "Detailed sections are not exposed automatically. Admin controls what is visible to the user.",
    icon: "☆",
  },
  {
    title: "Practical Direction",
    description:
      "The focus is not just information, but clear guidance for decisions, timing and personal clarity.",
    icon: "♡",
  },
];

const guidanceAreas = [
  "Birth Chart Reading",
  "Planetary Positions",
  "House Analysis",
  "Navamsa / D9",
  "Vimshottari Dasha",
  "Mangal Dosha",
  "Parāśara Reading",
  "PDF Report Access",
];

function LandingPage() {
  return (
    <main className="kkc-landing">
      <BlackWhiteCosmicBackground />

      <header className="kkc-header">
        <Link to="/" className="kkc-brand" aria-label="KKC Home">
          <img src={kkcLogo} alt="KKC Logo" />

          <span>
            <strong>KKC</strong>
            <small>Kundalini Kriya Chaitanyam</small>
          </span>
        </Link>

        <nav className="kkc-nav" aria-label="Landing navigation">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#kundali-flow">Kundali</a>
          <a href="#guidance">Guidance</a>
          <a href="#contact">Contact</a>
        </nav>

        <a
          className="kkc-outline-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          Book Consultation
        </a>
      </header>

      <section className="kkc-hero kkc-hero-premium" id="home">
        <div className="kkc-hero-content">
          <p className="kkc-eyebrow">
            Vedic Astrology • Kundali Reports • Consultation
          </p>

          <h1>Vedic Astrology Consultation and Kundali Guidance</h1>

          <p>
            Generate your Kundali with a private KKC Order ID and receive
            guided astrology consultation based on approved report sections.
          </p>

          <div className="kkc-hero-actions">
            <Link className="kkc-primary-btn" to="/kundali">
              Generate Kundali
            </Link>

            <a
              className="kkc-play-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>✦</span>
              Book Consultation
            </a>
          </div>

          <div className="kkc-hero-trust-row">
            <span>Private Order ID access</span>
            <span>Admin-approved report tabs</span>
            <span>Consultation-ready flow</span>
          </div>
        </div>

        <div className="kkc-hero-visual">
          <div className="kkc-hero-om-glass" aria-hidden="true">
            <span>ॐ</span>
          </div>

          <PlanetOrbit />
        </div>
      </section>

      <section className="kkc-services" id="services">
        <SectionHeading
          eyebrow="What KKC offers"
          title="Astrology and spiritual services"
          dark={false}
        />

        <div className="kkc-service-grid">
          {services.map((service) => (
            <article
              className="kkc-service-card kkc-service-card-premium"
              key={service.title}
            >
              <span className="kkc-service-icon">{service.icon}</span>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              {service.external ? (
                <a href={service.link} target="_blank" rel="noreferrer">
                  {service.cta} →
                </a>
              ) : (
                <Link to={service.link}>{service.cta} →</Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="kkc-kundali-flow" id="kundali-flow">
        <div className="kkc-kundali-flow-copy">
          <p className="kkc-eyebrow">KKC Order ID Flow</p>

          <h2>Generate once. Reopen by Order ID. Unlock after approval.</h2>

          <p>
            Kundali reports are not exposed openly. Every user gets a generated
            Order ID. Admin approval controls which sections become visible.
          </p>

          <div className="kkc-kundali-flow-actions">
            <Link className="kkc-white-btn" to="/kundali">
              Generate Kundali
            </Link>

            <Link className="kkc-outline-btn" to="/kundali">
              Search Existing Report
            </Link>
          </div>
        </div>

        <div className="kkc-kundali-step-grid">
          {kundaliSteps.map((step) => (
            <article className="kkc-kundali-step-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kkc-about" id="about">
        <div className="kkc-about-content">
          <p className="kkc-eyebrow">About Us</p>

          <h2>Guided by Wisdom, Driven by Purpose</h2>

          <p>
            Kundalini Kriya Chaitanyam is a spiritual and astrological platform
            focused on Vedic sciences, conscious guidance and practical clarity
            for life decisions.
          </p>

          <a className="kkc-white-btn" href="#services">
            Explore Services
          </a>
        </div>

        <div className="kkc-about-image" aria-hidden="true">
          <div className="kkc-about-fallback">
            <span>ॐ</span>
            <strong>Vedic Wisdom</strong>
          </div>
        </div>
      </section>

      <section className="kkc-why" id="guidance">
        <SectionHeading
          eyebrow="Why choose KKC"
          title="Clear process. Private access. Practical guidance."
          dark
        />

        <div className="kkc-why-grid">
          {whyChoose.map((item) => (
            <article className="kkc-why-card" key={item.title}>
              <span>{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kkc-guidance-strip">
        <div>
          <p className="kkc-eyebrow">Report Sections</p>
          <h2>Approved Kundali sections can include</h2>
        </div>

        <div className="kkc-guidance-tags">
          {guidanceAreas.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      </section>

      <section className="kkc-consultation-band">
        <div>
          <p className="kkc-eyebrow">Need personal guidance?</p>
          <h2>Book a KKC astrology consultation</h2>
          <p>
            Share your Order ID or birth details and get a guided explanation
            through consultation.
          </p>
        </div>

        <div className="kkc-consultation-actions">
          <a
            className="kkc-white-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Book on WhatsApp
          </a>

          <Link className="kkc-outline-btn" to="/kundali">
            Generate Kundali First
          </Link>
        </div>
      </section>

      <footer className="kkc-footer" id="contact">
        <div className="kkc-footer-brand">
          <img src={kkcLogo} alt="KKC Logo" />

          <p>
            Empowering lives with the wisdom of Vedic sciences and conscious
            spiritual guidance.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <Link to="/kundali">Kundali</Link>
          <a href="#contact">Contact Us</a>
        </div>

        <div>
          <h4>Our Services</h4>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Astrology Consultation
          </a>
          <Link to="/kundali">Kundali Generation</Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Online Consultation
          </a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Spiritual Guidance
          </a>
        </div>

        <div>
          <h4>Contact Us</h4>
          <p>+91 XXXXXXXXXX</p>
          <p>info@kkc.org</p>
          <p>India</p>

          <a
            className="kkc-footer-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Book Consultation
          </a>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  dark,
}: {
  eyebrow: string;
  title: string;
  dark: boolean;
}) {
  return (
    <div className={dark ? "kkc-section-heading dark" : "kkc-section-heading"}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

export default LandingPage;