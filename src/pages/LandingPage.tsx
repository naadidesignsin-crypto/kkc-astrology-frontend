import { Link } from "react-router-dom";

import kkcLogo from "../assets/Logo.png";
import BlackWhiteCosmicBackground from "../components/BlackWhiteCosmicBackground";
import CosmicMotionBackground from "../components/CosmicMotionBackground";

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
      "Personalized predictions and remedies based on your birth chart.",
    icon: "◎",
    link: whatsappUrl,
    external: true,
  },
  {
    title: "Kundali Generation",
    description:
      "Generate Lagna, Rashi, Nakshatra, planetary positions, Dasha and Dosha details.",
    icon: "☉",
    link: "/kundali",
    external: false,
  },
  {
    title: "Online Consultation",
    description:
      "Connect with our experts from anywhere through online consultation.",
    icon: "▣",
    link: whatsappUrl,
    external: true,
  },
  {
    title: "Learn Astrology",
    description:
      "Deepen your understanding of Vedic astrology and spiritual timing.",
    icon: "▤",
    link: whatsappUrl,
    external: true,
  },
];

const whyChoose = [
  {
    title: "Authentic Guidance",
    description:
      "Rooted in ancient Vedic knowledge and spiritual practices.",
    icon: "♙",
  },
  {
    title: "Trusted Expertise",
    description:
      "Guidance focused on clarity, timing, and practical life direction.",
    icon: "♢",
  },
  {
    title: "Personalized Solutions",
    description:
      "Readings and remedies based on your unique birth details.",
    icon: "☆",
  },
  {
    title: "Spiritual Transformation",
    description:
      "Supporting a balanced, conscious, and purposeful life.",
    icon: "♡",
  },
];

const testimonials = [
  {
    name: "Anitha Reddy",
    text: "KKC guidance helped me understand my current life phase with clarity.",
  },
  {
    name: "Ramesh Kumar",
    text: "The consultation gave practical direction for important decisions.",
  },
  {
    name: "Divya Sharma",
    text: "The astrology explanation was clear, structured, and meaningful.",
  },
];

function LandingPage() {
  return (
    <main className="kkc-landing">
    <BlackWhiteCosmicBackground />
    <CosmicMotionBackground />
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
          <a href="#learn">Learn</a>
          <a href="#gallery">Gallery</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="kkc-outline-btn" href={whatsappUrl} target="_blank">
          Book Consultation
        </a>
      </header>

      <section className="kkc-hero" id="home">
        <div className="kkc-hero-content">
          <p className="kkc-eyebrow">Align with the cosmic intelligence</p>

          <h1>Kundalini Kriya Chaitanyam</h1>

          <p>
            Ancient wisdom. Accurate guidance. Transforming lives through Vedic
            astrology and spiritual clarity.
          </p>

          <div className="kkc-hero-actions">
            <a className="kkc-primary-btn" href={whatsappUrl} target="_blank">
              Book Consultation
            </a>

            <Link className="kkc-play-btn" to="/kundali">
              <span>▶</span>
              Generate Kundali
            </Link>
          </div>
        </div>

        <div className="kkc-hero-visual" aria-hidden="true">
          <div className="kkc-zodiac">
            <span className="kkc-zodiac-center">ॐ</span>
            <span className="zodiac-icon z1">♈</span>
            <span className="zodiac-icon z2">♉</span>
            <span className="zodiac-icon z3">♊</span>
            <span className="zodiac-icon z4">♋</span>
            <span className="zodiac-icon z5">♌</span>
            <span className="zodiac-icon z6">♍</span>
            <span className="zodiac-icon z7">♎</span>
            <span className="zodiac-icon z8">♏</span>
            <span className="zodiac-icon z9">♐</span>
            <span className="zodiac-icon z10">♑</span>
            <span className="zodiac-icon z11">♒</span>
            <span className="zodiac-icon z12">♓</span>
          </div>
        </div>
      </section>

      <section className="kkc-services" id="services">
        <SectionHeading eyebrow="What we offer" title="Our Services" dark={false} />

        <div className="kkc-service-grid">
          {services.map((service) => (
            <article className="kkc-service-card" key={service.title}>
              <span className="kkc-service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>

              {service.external ? (
                <a href={service.link} target="_blank">
                  Learn More →
                </a>
              ) : (
                <Link to={service.link}>Generate Now →</Link>
              )}
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
            dedicated to guiding individuals towards mindful and purposeful life
            through ancient Vedic sciences.
          </p>

          <a className="kkc-white-btn" href="#services">
            Know More
          </a>
        </div>

        <div className="kkc-about-image" aria-hidden="true">
          <div className="kkc-about-fallback">
            <span>ॐ</span>
            <strong>Vedic Wisdom</strong>
          </div>
        </div>
      </section>

      <section className="kkc-why" id="learn">
        <SectionHeading
          eyebrow="Why choose KKC"
          title="Experience. Authenticity. Trust."
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

      <section className="kkc-testimonials" id="blog">
        <SectionHeading
          eyebrow="Testimonials"
          title="Voices of Transformation"
          dark={false}
        />

        <div className="kkc-testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="kkc-testimonial-card" key={testimonial.name}>
              <span>“</span>
              <p>{testimonial.text}</p>
              <strong>— {testimonial.name}</strong>
            </article>
          ))}
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
          <a href={whatsappUrl} target="_blank">Astrology Consultation</a>
          <Link to="/kundali">Kundali Generation</Link>
          <a href={whatsappUrl} target="_blank">Online Consultation</a>
          <a href={whatsappUrl} target="_blank">Learn Astrology</a>
        </div>

        <div>
          <h4>Contact Us</h4>
          <p>+91 XXXXXXXXXX</p>
          <p>info@kkc.org</p>
          <p>India</p>
          <a className="kkc-footer-btn" href={whatsappUrl} target="_blank">
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