const rows = [
  ["E-Pass Mandatory?", "Yes — all tourist vehicles (TN and non-TN)"],
  ["Local Exemption", "Yes — TN-43 registered vehicles exempt"],
  ["Application Fee", "Free (₹0)"],
  ["Official Website", "epass.tnega.org"],
  ["Daily Limit (Weekday)", "6,000 vehicles"],
  ["Daily Limit (Weekend)", "8,000 vehicles"],
  ["Green Tax", "Separate — collected in cash at checkpost"],
  ["Year-Round or Seasonal?", "Year-round as of January 2026"],
  ["Active Checkposts", "Kallar, Kunjapanai, Masinagudi, Mel Gudalur, Geddai"],
];

const aiRows = [
  ["🤖 AI Plastic Detection?", "Mandatory — Edge AI cameras scan baggage at all 5 checkposts", "green"],
  ["🍾 Prohibited Items", "Single-Use PET Bottles, Styrofoam Plates, Plastic Spoons/Forks, Drink Cups, Polybags", "red"],
  ["💰 Eco Product Acceptance", "Free Swap / Jute Bag (₹10) / Stainless Flask (₹200) / Smart QR Canteen (₹500)", "amber"],
];

export default function RulesTable() {
  return (
    <section id="rules" className="section">
      <div className="center">
        <span className="section-tag">OFFICIAL OOTY E-PASS &amp; AI SPECIFICATION</span>
        <h2>Ooty E-Pass Rules &amp; AI Plastic Screening Table</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ITEM</th><th>STATUS &amp; AI SPECIFICATION</th></tr>
          </thead>
          <tbody>
            {rows.map(([a, b]) => (
              <tr key={a}><td><strong>{a}</strong></td><td>{b}</td></tr>
            ))}
            {aiRows.map(([a, b, c]) => (
              <tr key={a} className={`ai-row ${c}`}><td><strong>NEW: {a}</strong></td><td>{b}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}