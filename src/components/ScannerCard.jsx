import { useState } from "react";

const items = [
  { id: "bottle", emoji: "🍾", name: "Single-Use PET Bottle", conf: "98.6%" },
  { id: "spoon", emoji: "🥄", name: "Disposable Plastic Spoon", conf: "97.4%" },
  { id: "plate", emoji: "🍽️", name: "Styrofoam Plastic Plate", conf: "99.1%" },
  { id: "cup", emoji: "🥤", name: "Disposable Plastic Cup", conf: "96.8%" },
];

const ecoOptions = [
  { id: "free", emoji: "🔄", name: "Eco Bottle Swap", price: "FREE" },
  { id: "cloth", emoji: "🛍️", name: "Jute Bag", price: "₹10" },
  { id: "metal", emoji: "🍶", name: "Eco Flask", price: "₹200" },
  { id: "smart", emoji: "⭐", name: "Smart QR Canteen", price: "₹500" },
];

export default function ScannerCard() {
  const [item, setItem] = useState(items[0]);
  const [eco, setEco] = useState(null);

  const pick = (i) => {
    setItem(i);
    setEco(null);
  };

  return (
    <article className="scanner">
      <p className="tag-dark">CHECKPOST: KALLAR GATE</p>
      <h2>AI Checkpoint &amp; Eco Product Acceptance</h2>

      <div className={`scan-box ${eco ? "approved" : "flagged"}`}>
        <span className="scan-emoji">{eco ? eco.emoji : item.emoji}</span>
        <h3>{eco ? `${eco.name} (${eco.price})` : item.name}</h3>
        <p>
          {eco
            ? "🟢 APPROVED — ZERO-PLASTIC COMPLIANT"
            : `🚨 FLAGGED (${item.conf}) — REJECTED AT CHECKPOST`}
        </p>
      </div>

      <p className="mini-label">Select item to simulate AI detection</p>
      <div className="btn-row">
        {items.map((i) => (
          <button key={i.id} className="chip red" onClick={() => pick(i)}>
            {i.emoji}
          </button>
        ))}
      </div>

      <p className="mini-label">Choose an approved eco replacement</p>
      <div className="btn-row">
        {ecoOptions.map((o) => (
          <button key={o.id} className={`chip green ${eco?.id === o.id ? "on" : ""}`} onClick={() => setEco(o)}>
            {o.emoji} {o.name}
            <small>{o.price}</small>
          </button>
        ))}
      </div>
    </article>
  );
}