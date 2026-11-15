import { useEffect, useRef } from "react";
import { formatDistance } from "../utils/geo";
import "./CheckpointAlerts.css";

// ordered smallest -> largest, first match wins
const levels = [
  { max: 30, type: "arrived", text: (n) => `✅ You have arrived at ${n} checkpost. Show your E-Pass QR to the officer.` },
  { max: 100, type: "danger", text: (n) => `🚨 You are 100 m away from ${n} checkpost! Keep your E-Pass QR ready and put away all single-use plastic.` },
  { max: 500, type: "warn", text: (n) => `⚠️ You are 500 m from ${n} checkpost. Single-use plastic will be confiscated (₹500 fine).` },
  { max: 1000, type: "warn", text: (n) => `📍 You are 1 km from ${n} checkpost. Keep your vehicle number and E-Pass ready.` },
  { max: 2000, type: "info", text: (n) => `ℹ️ You are about 2 km from ${n} checkpost.` },
];

export default function CheckpointAlerts({ distance, target, mode }) {
  const level = distance == null ? null : levels.find((l) => distance <= l.max);
  const lastKey = useRef(null);

  // native notification + vibration only when the level changes
  useEffect(() => {
    if (!level) {
      lastKey.current = null;
      return;
    }
    const key = `${target.name}-${level.max}`;
    if (key === lastKey.current) return;
    lastKey.current = key;
    const msg = level.text(target.name);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🌿 Ooty EcoPass", { body: msg });
    }
    if (navigator.vibrate) navigator.vibrate([250, 100, 250]);
  }, [level, target.name]);

  if (mode === "idle" && distance == null) {
    return (
      <div className="alert-box idle">
        Start live tracking (or the demo) to get alerts as you approach {target.name} checkpost.
      </div>
    );
  }

  return (
    <div className={`alert-box ${level ? level.type : "idle"}`}>
      <div className="alert-distance">
        Distance to {target.name}: <strong>{distance == null ? "--" : formatDistance(distance)}</strong>
        {mode === "demo" && <span className="badge">DEMO</span>}
        {mode === "live" && <span className="badge live">LIVE GPS</span>}
      </div>
      <p>{level ? level.text(target.name) : `You are more than 2 km from ${target.name} checkpost. Drive safely.`}</p>
    </div>
  );
}