export default function LandingPage({ onGetStarted, onExplore }) {
  return (
    <main>
      <HeroSection onGetStarted={onGetStarted} onExplore={onExplore} />
      <StatsSection />
      <ServicesSection />
      <AboutSection />
      <InnovationSection />
      <CareersSection onGetStarted={onGetStarted} />
      <Footer />

      <style>{`
        /* ─── Hero ─────────────────────────────────────────────────────── */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg, #F0F4FF 0%, #FFFFFF 50%, #E8F0FE 100%);
          padding-top: 80px;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--gray-100) 1px, transparent 1px),
            linear-gradient(90deg, var(--gray-100) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.5;
        }
        .hero-blob {
          position: absolute;
          width: 900px; height: 900px;
          background: radial-gradient(circle, rgba(26,111,255,0.08) 0%, transparent 70%);
          top: -200px; right: -200px;
          pointer-events: none;
          animation: blobPulse 8s ease-in-out infinite alternate;
        }
        @keyframes blobPulse {
          from { transform: scale(1) rotate(0deg); }
          to   { transform: scale(1.1) rotate(15deg); }
        }
        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          padding: 80px 24px;
          animation: fadeSlideIn 0.7s ease;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--white);
          border: 1px solid var(--gray-300);
          border-radius: 50px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 36px;
          box-shadow: var(--shadow-sm);
        }
        .hero-badge-dot {
          width: 8px; height: 8px;
          background: #38D989;
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0.3; } 
        }
        .hero-headline {
          font-family: var(--font-display);
          font-size: clamp(40px, 6vw, 68px);
          font-weight: 900;
          color: var(--navy);
          line-height: 1.1;
          margin-bottom: 8px;
          letter-spacing: -2px;
        }
        .hero-headline-accent {
          font-family: var(--font-display);
          font-size: clamp(40px, 6vw, 68px);
          font-weight: 900;
          color: var(--blue);
          line-height: 1.1;
          letter-spacing: -2px;
          display: block;
          margin-bottom: 28px;
        }
        .hero-description {
          font-size: 18px;
          line-height: 1.75;
          color: var(--gray-500);
          max-width: 540px;
          margin: 0 auto 40px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-scroll {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 0.15em;
          color: var(--gray-500);
          text-transform: uppercase;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: bounceY 2s ease-in-out infinite;
        }
        .hero-scroll::after {
          content: '';
          width: 1px; height: 40px;
          background: linear-gradient(var(--gray-300), transparent);
        }
        @keyframes bounceY {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }

        /* ─── Stats ─────────────────────────────────────────────────────── */
        .stats { padding: 80px 0; background: var(--navy); }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 40px;
          text-align: center;
        }
        .stat-number {
          font-family: var(--font-display);
          font-size: 52px;
          font-weight: 900;
          color: var(--white);
          line-height: 1;
          letter-spacing: -2px;
        }
        .stat-accent { color: var(--blue-light); }
        .stat-label {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin-top: 8px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* ─── Section Common ─────────────────────────────────────────────── */
        .section { padding: 100px 0; }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--blue);
          margin-bottom: 16px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 900;
          color: var(--navy);
          letter-spacing: -1.5px;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .section-subtitle {
          font-size: 16px;
          color: var(--gray-500);
          line-height: 1.75;
          max-width: 560px;
        }

        /* ─── Services ───────────────────────────────────────────────────── */
        .services { background: var(--off-white); }
        .services-header { margin-bottom: 60px; }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }
        .service-card {
          background: var(--white);
          border-radius: var(--radius-md);
          padding: 36px 32px;
          border: 1px solid var(--gray-100);
          transition: var(--transition);
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--blue), var(--blue-light));
          transform: scaleX(0);
          transform-origin: left;
          transition: var(--transition);
        }
        .service-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
        .service-card:hover::before { transform: scaleX(1); }
        .service-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .service-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }
        .service-desc {
          font-size: 14px;
          line-height: 1.7;
          color: var(--gray-500);
        }

        /* ─── About ──────────────────────────────────────────────────────── */
        .about-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .about-visual {
          position: relative;
          height: 440px;
        }
        .about-map-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0A1628 0%, #1A3A6F 100%);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .about-map-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .about-map-label {
          position: relative;
          text-align: center;
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .about-globe {
          font-size: 80px;
          display: block;
          margin-bottom: 12px;
          animation: spin 30s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .about-stat-cards {
          position: absolute;
          bottom: -20px; right: -20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .about-stat-card {
          background: var(--white);
          border-radius: var(--radius-sm);
          padding: 16px 20px;
          box-shadow: var(--shadow-md);
          min-width: 160px;
        }
        .about-stat-card-num {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 900;
          color: var(--navy);
        }
        .about-stat-card-label {
          font-size: 12px;
          color: var(--gray-500);
          margin-top: 2px;
        }
        .about-points {
          list-style: none;
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .about-point {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .about-point-icon {
          width: 32px; height: 32px;
          background: rgba(26,111,255,0.1);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .about-point-text { font-size: 15px; line-height: 1.6; color: var(--gray-700); }
        .about-point-text strong { color: var(--navy); display: block; font-size: 15px; }

        /* ─── Innovation ─────────────────────────────────────────────────── */
        .innovation { background: var(--navy); }
        .innovation .section-label { color: var(--blue-light); }
        .innovation .section-title { color: var(--white); }
        .innovation .section-subtitle { color: rgba(255,255,255,0.5); }
        .inno-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 56px;
        }
        .inno-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-md);
          padding: 32px;
          transition: var(--transition);
        }
        .inno-card:hover {
          background: rgba(26,111,255,0.12);
          border-color: rgba(26,111,255,0.3);
          transform: translateY(-4px);
        }
        .inno-icon { font-size: 36px; margin-bottom: 16px; }
        .inno-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 8px;
        }
        .inno-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.65; }

        /* ─── Careers ────────────────────────────────────────────────────── */
        .careers-inner {
          background: linear-gradient(135deg, var(--blue) 0%, var(--navy-mid) 100%);
          border-radius: var(--radius-lg);
          padding: 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .careers-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .careers-inner .section-title { color: var(--white); margin-bottom: 16px; }
        .careers-inner .section-subtitle { color: rgba(255,255,255,0.75); margin: 0 auto 40px; }
        .careers-inner .btn-primary {
          background: var(--white);
          color: var(--blue);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .careers-inner .btn-primary:hover {
          background: var(--off-white);
          transform: translateY(-2px);
        }

        /* ─── Footer ─────────────────────────────────────────────────────── */
        .footer {
          background: var(--navy);
          padding: 64px 0 32px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 56px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .footer-logo-mark {
          width: 36px; height: 36px;
          background: var(--blue);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          font-weight: 900;
          font-size: 18px;
          font-family: var(--font-display);
        }
        .footer-logo-text { color: var(--white); font-weight: 800; font-size: 20px; }
        .footer-tagline {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.4);
          max-width: 260px;
        }
        .footer-heading {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 20px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links a {
          color: rgba(255,255,255,0.55);
          font-size: 14px;
          transition: var(--transition);
        }
        .footer-links a:hover { color: var(--white); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.3); }
        .footer-social {
          display: flex;
          gap: 16px;
        }
        .footer-social a {
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          transition: var(--transition);
        }
        .footer-social a:hover {
          background: var(--blue);
          color: var(--white);
        }

        /* ─── Responsive ─────────────────────────────────────────────────── */
        @media (max-width: 900px) {
          .about-inner { grid-template-columns: 1fr; gap: 40px; }
          .about-visual { height: 300px; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .careers-inner { padding: 48px 32px; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
          .hero-actions { flex-direction: column; align-items: center; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </main>
  );
}

/* ─── Sub-components ────────────────────────────────────────────────── */
function HeroSection({ onGetStarted, onExplore }) {
  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-blob" />
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            Global Innovation Partner
          </div>
          <h1 className="hero-headline">Empowering Global Talent.</h1>
          <span className="hero-headline-accent">Driving Digital Excellence.</span>
          <p className="hero-description">
            Connecting enterprises with world-class talent and transformative digital
            solutions. Building the future of work, today.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onGetStarted}>Get Started →</button>
            <button className="btn-outline" onClick={onExplore}>⊕ Explore Solutions</button>
          </div>
        </div>
      </div>
      <div className="hero-scroll">SCROLL</div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { number: '20+',  accent: '+', label: 'Years of Excellence',   base: '20' },
    { number: '5K+',  accent: '+', label: 'Enterprise Clients',    base: '5K' },
    { number: '40+',  accent: '+', label: 'Countries Served',      base: '40' },
    { number: '10K+', accent: '+', label: 'Placements Globally',   base: '10K' },
  ];
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="stat-number">
                {s.base}<span className="stat-accent">{s.accent}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    { icon: '👥', bg: '#EBF5FB', name: 'IT Staffing', desc: 'Precision-matched tech talent for contract, contract-to-hire, and full-time roles across all technology stacks.' },
    { icon: '🎯', bg: '#EBF5F7', name: 'Executive Search', desc: 'C-suite and senior leadership recruitment powered by deep networks and proprietary assessment frameworks.' },
    { icon: '⚡', bg: '#FEF9E7', name: 'Recruitment Process Outsourcing', desc: 'End-to-end RPO solutions that scale with your hiring needs, reducing time-to-fill by up to 40%.' },
    { icon: '🛠', bg: '#F4ECF7', name: 'Managed Services', desc: 'Vendor-neutral MSP programs that bring cost control, compliance, and visibility to your contingent workforce.' },
    { icon: '🌐', bg: '#EAFAF1', name: 'Global Delivery', desc: 'Offshore and nearshore delivery centers in India, APAC, and EMEA for 24/7 business continuity.' },
    { icon: '💡', bg: '#FEF5E7', name: 'Digital Transformation', desc: 'Strategy-to-execution digital consulting: cloud, AI/ML, data engineering, and enterprise modernization.' },
  ];
  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="services-header">
          <div className="section-label">What We Do</div>
          <h2 className="section-title">Solutions Built<br />for Scale</h2>
          <p className="section-subtitle">
            From niche technical placements to full-scale digital transformation,
            VDart delivers end-to-end workforce and technology solutions.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="service-name">{s.name}</div>
              <div className="service-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section" id="reach">
      <div className="container">
        <div className="about-inner">
          {/* Visual */}
          <div className="about-visual">
            <div className="about-map-bg">
              <div className="about-map-dots" />
              <div className="about-map-label">
                <span className="about-globe">🌏</span>
                40+ Countries Network
              </div>
            </div>
            <div className="about-stat-cards">
              <div className="about-stat-card">
                <div className="about-stat-card-num">$2B+</div>
                <div className="about-stat-card-label">Revenue Delivered</div>
              </div>
              <div className="about-stat-card">
                <div className="about-stat-card-num">98%</div>
                <div className="about-stat-card-label">Client Retention</div>
              </div>
            </div>
          </div>
          {/* Text */}
          <div>
            <div className="section-label">Our Story</div>
            <h2 className="section-title">Two Decades of<br />Talent Leadership</h2>
            <p className="section-subtitle">
              Founded in 2002, VDart has grown from a US-based IT staffing firm into a global
              workforce solutions powerhouse operating across North America, India, APAC, and EMEA.
            </p>
            <ul className="about-points">
              <li className="about-point">
                <div className="about-point-icon">🏆</div>
                <div className="about-point-text">
                  <strong>Fortune 500 Trusted Partner</strong>
                  Serving 60% of the Fortune 500 with mission-critical talent programs.
                </div>
              </li>
              <li className="about-point">
                <div className="about-point-icon">🔬</div>
                <div className="about-point-text">
                  <strong>AI-Powered Matching</strong>
                  Proprietary VDart AI platform reduces time-to-hire by 35% using predictive analytics.
                </div>
              </li>
              <li className="about-point">
                <div className="about-point-icon">🌱</div>
                <div className="about-point-text">
                  <strong>DEI-Committed</strong>
                  Industry-leading diversity-first hiring programs across all engagement models.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function InnovationSection() {
  const techs = [
    { icon: '🤖', name: 'AI & Machine Learning', desc: 'Custom ML models, NLP pipelines, and computer vision for next-gen enterprise applications.' },
    { icon: '☁️', name: 'Cloud Engineering', desc: 'Multi-cloud architecture, migration, and optimization across AWS, Azure, and GCP.' },
    { icon: '📊', name: 'Data & Analytics', desc: 'End-to-end data platforms from ingestion and warehousing to BI dashboards and insights.' },
    { icon: '🔐', name: 'Cybersecurity', desc: 'Zero-trust frameworks, SOC services, compliance automation, and threat intelligence.' },
  ];
  return (
    <section className="section innovation" id="innovation">
      <div className="container">
        <div className="section-label">Technology Practice</div>
        <h2 className="section-title">Innovation at<br />Every Layer</h2>
        <p className="section-subtitle">
          VDart's Centers of Excellence specialize in the technology domains reshaping global industry.
        </p>
        <div className="inno-grid">
          {techs.map((t, i) => (
            <div key={i} className="inno-card">
              <div className="inno-icon">{t.icon}</div>
              <div className="inno-name">{t.name}</div>
              <div className="inno-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareersSection({ onGetStarted }) {
  return (
    <section className="section" id="careers">
      <div className="container">
        <div className="careers-inner">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Join Our Team</div>
          <h2 className="section-title">Shape the Future<br />of Work With Us</h2>
          <p className="section-subtitle">
            VDart offers careers in recruitment, technology, operations, and consulting —
            with offices across 5 continents and a fully remote culture of excellence.
          </p>
          <button className="btn-primary" onClick={onGetStarted}>
            Explore Open Roles →
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div className="footer-logo-mark">V</div>
              <span className="footer-logo-text">Vdart</span>
            </div>
            <p className="footer-tagline">
              Global talent and technology solutions. Empowering enterprises since 2002.
            </p>
          </div>
          <div>
            <div className="footer-heading">Services</div>
            <ul className="footer-links">
              <li><a href="#services">IT Staffing</a></li>
              <li><a href="#services">Executive Search</a></li>
              <li><a href="#services">RPO Solutions</a></li>
              <li><a href="#services">Managed Services</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-heading">Company</div>
            <ul className="footer-links">
              <li><a href="#reach">About VDart</a></li>
              <li><a href="#innovation">Innovation</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#">News & Insights</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-heading">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:info@vdart.com">info@vdart.com</a></li>
              <li><a href="tel:+14045550100">+1 (404) 555-0100</a></li>
              <li><a href="#">Atlanta, GA — HQ</a></li>
              <li><a href="#">Chennai, India</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2024 VDart Inc. All rights reserved.</span>
          <div className="footer-social">
            <a href="#" title="LinkedIn">in</a>
            <a href="#" title="Twitter">𝕏</a>
            <a href="#" title="Facebook">f</a>
            <a href="#" title="Instagram">ig</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
