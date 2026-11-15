const cards = [
  { img: "photo-1544735716-392fe2489ffa", tag: "🏔️ Tea Garden Hills", title: "Pristine Ooty Landscape", text: "Rolling green tea plantations of Nilgiris preserved under strict zero-plastic environmental protection." },
  { img: "photo-1557050543-4d5f4e07ef46", tag: "🐘 Wildlife Defense", title: "Mudumalai & Masinagudi Fauna", text: "Preventing plastic ingestion by wild elephants, deer, and native species in forest checkpost zones." },
  { img: "photo-1602143407151-7111542de6e8", tag: "🍶 Eco Product Swap", title: "Approved Metal Canteens", text: "Swap single-use plastic bottles for reusable stainless steel flasks (₹200) & smart QR canteens (₹500)." },
  { img: "photo-1506744038136-46273834b3fb", tag: "💧 Pure Mountain Rivers", title: "Plastic-Free Ecosystem", text: "Keeping Pykara lake, waterfalls, and mountain streams 100% free of microplastics and polybags." },
];

export default function Gallery() {
  return (
    <section id="gallery" className="section alt">
      <div className="center">
        <span className="section-tag">🌿 PROTECTING NILGIRIS MOUNTAINS &amp; WILDLIFE</span>
        <h2>Lush Green Nilgiris &amp; Zero-Plastic Mandate</h2>
        <p className="lead">
          The Nilgiris tea estates and forest reserves are home to endangered Asian elephants,
          Nilgiri Tahr, and pristine ecosystems. Edge AI checkposts ensure tourist plastic never
          pollutes our hills.
        </p>
      </div>
      <div className="gallery-grid">
        {cards.map((c) => (
          <div className="gallery-card" key={c.title}>
            <div className="gallery-img">
              <img src={`https://images.unsplash.com/${c.img}?auto=format&fit=crop&w=800&q=80`} alt={c.title} />
              <span>{c.tag}</span>
            </div>
            <div className="gallery-text">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}