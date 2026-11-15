import ScannerCard from "./ScannerCard";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div>
        <span className="hero-tag">🌲 OFFICIAL NILGIRIS ECO PORTAL 2026</span>
        <h1>
          Ooty E-Pass &amp; <br />
          <span>AI Plastic Screening</span>
        </h1>
        <p>
          Protecting the Nilgiris Biosphere &amp; Wildlife. All visiting tourist vehicles must
          obtain a digital E-Pass and pass AI single-use plastic camera detection at entry checkposts.
        </p>
        <div className="hero-actions">
          <a href="#epass-form" className="btn primary big">🎫 Apply Mandatory E-Pass</a>
          <a href="#trip" className="btn light big">📍 Find My Checkpost</a>
        </div>
      </div>
      <ScannerCard />
    </section>
  );
}