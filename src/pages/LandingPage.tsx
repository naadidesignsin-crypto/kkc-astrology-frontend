import { Link } from "react-router-dom";

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
      "Personalized guidance based on birth details, planetary positions, Dasha, and life direction.",
    icon: "☉",
  },
  {
    title: "Kundali Generation",
    description:
      "Generate Lagna, Rashi, Nakshatra, planetary positions, Dasha, Dosha, Navamsa, and report PDF.",
    icon: "☼",
  },
  {
    title: "Online Consultation",
    description:
      "Connect with KKC guidance through online consultation for astrology and spiritual clarity.",
    icon: "☾",
  },
  {
    title: "Learn Astrology",
    description:
      "Structured learning for understanding Vedic astrology, planets, houses, and spiritual timing.",
    icon: "♃",
  },
];

const whyChooseItems = [
  {
    title: "Authentic Guidance",
    description:
      "Rooted in Vedic wisdom, spiritual discipline, and traditional astrology principles.",
    icon: "♄",
  },
  {
    title: "Trusted Expertise",
    description:
      "Guidance focused on clarity, timing, remedies, and practical decision-making.",
    icon: "☽",
  },
  {
    title: "Personalized Solutions",
    description:
      "Every consultation is based on the person’s birth details, situation, and requirement.",
    icon: "✧",
  },
  {
    title: "Spiritual Transformation",
    description:
      "Support for balanced living through conscious guidance, remedies, and inner alignment.",
    icon: "♡",
  },
];

const testimonials = [
  {
    name: "Anitha Reddy",
    text: "KKC guidance helped me understand my current phase with more clarity and confidence.",
  },
  {
    name: "Ramesh Kumar",
    text: "The consultation gave practical direction and helped me plan important decisions.",
  },
  {
    name: "Divya Sharma",
    text: "The astrology explanation was clear, structured, and easy to understand.",
  },
];

function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <a href="#home" className="landing-brand" aria-label="KKC Home">
          <img src={kkcLogo} alt="KKC Logo" />
          <span>
            <strong>KKC</strong>
            <small>Kundalini Kriya Chaitanyam</small>
          </span>
        </a>

        <nav className="landing-nav" aria-label="Landing navigation">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#learn">Learn</a>
          <a href="#gallery">Gallery</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="landing-outline-btn" href={whatsappUrl} target="_blank">
          Book Consultation
        </a>
      </header>

      <section className="landing-hero" id="home">
        <div className="landing-hero-content">
          <p className="landing-eyebrow">Align with the cosmic intelligence</p>

          <h1>Kundalini Kriya Chaitanyam</h1>

          <p>
            Ancient wisdom, accurate guidance, and conscious transformation
            through Vedic astrology and spiritual practices.
          </p>

          <div className="landing-hero-actions">
            <a className="landing-primary-btn" href={whatsappUrl} target="_blank">
              Book Consultation
            </a>

            <Link className="landing-play-btn" to="/kundali">
              <span>▶</span>
              Generate Kundali
            </Link>
          </div>
        </div>

        <div className="landing-zodiac-card" aria-hidden="true">
          <div className="landing-zodiac-orbit">
            <span className="landing-om">ॐ</span>
            <span className="zodiac-ring zodiac-ring-one" />
            <span className="zodiac-ring zodiac-ring-two" />
            <span className="zodiac-ring zodiac-ring-three" />
            <span className="zodiac-symbol zodiac-symbol-1">♈</span>
            <span className="zodiac-symbol zodiac-symbol-2">♉</span>
            <span className="zodiac-symbol zodiac-symbol-3">♊</span>
            <span className="zodiac-symbol zodiac-symbol-4">♋</span>
            <span className="zodiac-symbol zodiac-symbol-5">♌</span>
            <span className="zodiac-symbol zodiac-symbol-6">♍</span>
            <span className="zodiac-symbol zodiac-symbol-7">♎</span>
            <span className="zodiac-symbol zodiac-symbol-8">♏</span>
          </div>
        </div>
      </section>

      <section className="landing-services" id="services">
        <SectionHeading eyebrow="What we offer" title="Our Services" />

        <div className="landing-service-grid">
          {services.map((service) => (
            <article className="landing-service-card" key={service.title}>
              <span>{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>

              {service.title === "Kundali Generation" ? (
                <Link to="/kundali">Generate Now →</Link>
              ) : (
                <a href={whatsappUrl} target="_blank">
                  Learn More →
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="landing-about" id="about">
        <div>
          <p className="landing-eyebrow">About Us</p>
          <h2>Guided by Wisdom, Driven by Purpose</h2>
          <p>
            Kundalini Kriya Chaitanyam is a spiritual and astrology-focused
            platform created to guide individuals toward mindful decisions,
            dharmic living, and purposeful transformation through ancient Vedic
            sciences.
          </p>

          <a className="landing-white-btn" href="#services">
            Know More
          </a>
        </div>

        <div className="landing-about-visual">
          <div className="landing-temple-frame">
            <span>ॐ</span>
            <strong>Vedic Guidance</strong>
            <small>Astrology • Kriya • Conscious Living</small>
          </div>
        </div>
      </section>

      <section className="landing-why" id="learn">
        <SectionHeading
          eyebrow="Why choose KKC"
          title="Experience. Authenticity. Trust."
        />

        <div className="landing-why-grid">
          {whyChooseItems.map((item) => (
            <article className="landing-why-card" key={item.title}>
              <span>{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-testimonials" id="blog">
        <SectionHeading
          eyebrow="Testimonials"
          title="Voices of Transformation"
        />

        <div className="landing-testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="landing-testimonial-card" key={testimonial.name}>
              <span>“</span>
              <p>{testimonial.text}</p>
              <strong>— {testimonial.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-gallery-strip" id="gallery">
        <p>Gallery, devotional events, and video moments will remain connected with the main KKC platform.</p>
      </section>

      <footer className="landing-footer" id="contact">
        <div className="landing-footer-brand">
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
          <Link to="/kundali">Generate Kundali</Link>
        </div>

        <div>
          <h4>Our Services</h4>
          <a href={whatsappUrl} target="_blank">Astrology Consultation</a>
          <Link to="/kundali">Kundali Generation</Link>
          <a href={whatsappUrl} target="_blank">Online Consultation</a>
          <a href="#learn">Learn Astrology</a>
        </div>

        <div>
          <h4>Contact Us</h4>
          <p>+91 XXXXXXXXXX</p>
          <p>info@kkc.org</p>
          <p>India</p>
          <a className="landing-footer-btn" href={whatsappUrl} target="_blank">
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
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="landing-section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

export default LandingPage;