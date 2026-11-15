
import { useState, useEffect, useCallback, useRef } from "react";

import {
  getPasses,
  addPass,
  updatePass,
  deletePass,
} from "./api";

import checkpoints, { routes } from "./data/checkpoints";
import { haversineM } from "./utils/geo";
import useLiveLocation from "./hooks/useLiveLocation";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import RulesTable from "./components/RulesTable";
import SelectField from "./components/SelectField";
import CheckpointAlerts from "./components/CheckpointAlerts";
import CheckpointMap from "./components/CheckpointMap";
import PassForm from "./components/PassForm";
import PassList from "./components/PassList";
import SearchBar from "./components/SearchBar";

import "./App.css";

export default function App() {
  // ---------------- CRUD STATE ----------------

  const [passes, setPasses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------------- ROUTE STATE ----------------

  const [routeKey, setRouteKey] = useState("mettupalayam");

  const route = routes.find((r) => r.key === routeKey) || routes[0];

  const target =
    checkpoints.find((c) => c.name === route.checkpost) ||
    checkpoints[0];

  const live = useLiveLocation(target);

  const distance = live.position
    ? haversineM(live.position, target)
    : null;

  // ---------------- VOICE ALERT STATE ----------------

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceMessage, setVoiceMessage] = useState("");

  const lastAlertRef = useRef("");
  const lastTargetRef = useRef(target.name);

  // Speak announcement
  const speak = useCallback(
    (text) => {
      if (!voiceEnabled) return;

      if (!("speechSynthesis" in window)) {
        setVoiceMessage("Your browser does not support voice alerts.");
        return;
      }

      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(text);

      speech.lang = "en-IN";
      speech.rate = 0.9;
      speech.pitch = 1;
      speech.volume = 1;

      speech.onstart = () => {
        setVoiceMessage("🔊 Voice announcement playing...");
      };

      speech.onend = () => {
        setVoiceMessage("✅ Voice announcement completed.");
      };

      speech.onerror = () => {
        setVoiceMessage("Unable to play voice announcement.");
      };

      window.speechSynthesis.speak(speech);
    },
    [voiceEnabled]
  );

  // Manual voice test
  const testVoice = () => {
    speak(
      `Attention! This is an Ooty EcoPass voice alert test. ` +
      `Please dispose of single-use plastic before entering ${target.name} Checkpost. ` +
      `Help us protect the Nilgiris environment.`
    );
  };

  // Stop speech when voice alerts are disabled
  useEffect(() => {
    if (!voiceEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setVoiceMessage("Voice alerts are OFF.");
    }
  }, [voiceEnabled]);

  // Reset alerts when checkpoint changes
  useEffect(() => {
    if (lastTargetRef.current !== target.name) {
      lastTargetRef.current = target.name;
      lastAlertRef.current = "";
    }
  }, [target.name]);

  // ---------------- AUTOMATIC DISTANCE VOICE ALERTS ----------------

  useEffect(() => {
    if (distance === null || !Number.isFinite(distance)) return;

    if (distance <= 500 && distance > 200) {
      if (lastAlertRef.current !== "500") {
        lastAlertRef.current = "500";

        speak(
          `Attention! You are approximately 500 metres away from ` +
          `${target.name} Checkpost. Please dispose of any single-use ` +
          `plastic before entering. Help us protect the Nilgiris environment.`
        );
      }
    } else if (distance <= 200 && distance > 50) {
      if (lastAlertRef.current !== "200") {
        lastAlertRef.current = "200";

        speak(
          `Warning! You are approximately 200 metres away from ` +
          `${target.name} Checkpost. Please prepare for inspection ` +
          `and ensure that you are not carrying single-use plastic.`
        );
      }
    } else if (distance <= 50) {
      if (lastAlertRef.current !== "50") {
        lastAlertRef.current = "50";

        speak(
          `You have reached ${target.name} Checkpost. ` +
          `Please follow the checkpoint instructions.`
        );
      }
    } else {
      // Reset when visitor moves away from the warning area
      lastAlertRef.current = "";
    }
  }, [distance, target.name, speak]);

  // ---------------- LOAD PASSES ----------------

  const loadPasses = useCallback(async () => {
    try {
      const data = await getPasses();

      setPasses(data);
      setMessage("");
    } catch (error) {
      console.error("Backend error:", error);

      setMessage(
        "❌ Cannot connect to SQLite backend. Make sure server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPasses();
  }, [loadPasses]);

  // ---------------- CREATE / UPDATE ----------------

  const handleSave = async (pass) => {
    try {
      if (editing) {
        await updatePass(editing.id, pass);

        setMessage("✅ Visitor pass updated successfully!");
        setEditing(null);
      } else {
        await addPass(pass);

        setMessage("✅ New visitor pass registered successfully!");
      }

      await loadPasses();
    } catch (error) {
      console.error("Save error:", error);

      setMessage("❌ Unable to save visitor pass.");
    }
  };

  // ---------------- DELETE ----------------

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pass?")) {
      return;
    }

    try {
      await deletePass(id);

      if (editing?.id === id) {
        setEditing(null);
      }

      setMessage("🗑️ Visitor pass deleted successfully!");

      await loadPasses();
    } catch (error) {
      console.error("Delete error:", error);

      setMessage("❌ Unable to delete visitor pass.");
    }
  };

  // ---------------- ROUTE CHANGE ----------------

  const handleRouteChange = (e) => {
    live.stop();

    const selectedRoute = routes.find(
      (r) => r.label === e.target.value
    );

    if (selectedRoute) {
      setRouteKey(selectedRoute.key);
      lastAlertRef.current = "";
    }
  };

  // ---------------- SEARCH ----------------

  const filtered = passes.filter((p) =>
    [
      p.ownerName,
      p.vehicle,
      p.gate,
      p.vehicleType,
      p.phone,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase().trim())
  );

  // ---------------- EDIT ----------------

  const handleEdit = (pass) => {
    setEditing(pass);
    setMessage("");

    document
      .getElementById("epass-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditing(null);
    setMessage("");
  };

  // ---------------- UI ----------------

  return (
    <div className="app">

      <Header />

      <Hero />

      <Gallery />

      <RulesTable />

      {/* LIVE CHECKPOST TRACKING */}

      <section id="trip" className="section alt">

        <div className="center">

          <span className="section-tag">
            📍 LIVE ROUTE &amp; CHECKPOST ALERTS
          </span>

          <h2>Which Checkpost Should You Take?</h2>

          <p className="lead">
            Get automatic location-based warnings when approaching
            Ooty checkposts.
          </p>

        </div>

        <div className="trip-controls">

          <SelectField
            label="Which road are you coming from?"
            name="route"
            value={route.label}
            onChange={handleRouteChange}
            options={routes.map((r) => r.label)}
          />

          <div className="recommend">
            ✅ Take <strong>{target.name} Checkpost</strong> via{" "}
            {route.road}
          </div>

        </div>

        {/* TRACKING BUTTONS */}

        <div className="actions">

          <button
            className="btn primary"
            onClick={live.startLive}
          >
            📍 Start Live Tracking
          </button>

          <button
            className="btn amber"
            onClick={live.startDemo}
          >
            ▶ Demo: Simulate Approach
          </button>

          <button
            className="btn"
            onClick={live.stop}
          >
            ⏹ Stop Tracking
          </button>

          <button
            className="btn primary"
            onClick={testVoice}
          >
            🔊 Test Voice Announcement
          </button>

        </div>

        {live.error && (
          <p className="error">{live.error}</p>
        )}

        {/* VOICE CONTROL */}

        <div className="voice-panel">

          <div>
            <h3>🔊 Voice Alert System</h3>

            <p>
              Automatically announce plastic warnings when you
              approach within 500 metres of a checkpost.
            </p>

            {voiceMessage && (
              <p className="voice-status" role="status">
                {voiceMessage}
              </p>
            )}
          </div>

          <button
            className="btn"
            onClick={() => setVoiceEnabled((previous) => !previous)}
          >
            {voiceEnabled
              ? "🔊 Voice Alerts ON"
              : "🔇 Voice Alerts OFF"}
          </button>

        </div>

        {/* DISTANCE ALERT */}

        <CheckpointAlerts
          distance={distance}
          target={target}
          mode={live.mode}
        />

        {/* LIVE MAP */}

        <CheckpointMap
          route={route}
          target={target}
          position={live.position}
        />

      </section>

      {/* E-PASS FORM */}

      <section id="epass-form" className="section">

        <div className="center">

          <span className="section-tag">
            ONLINE E-PASS REGISTRATION
          </span>

          <h2>
            {editing
              ? "Update Ooty E-Pass Details"
              : "Apply Ooty E-Pass & Pre-Declare Eco Items"}
          </h2>

        </div>

        {message && (
          <p
            className="message"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <PassForm
          key={editing ? editing.id : "new"}
          editing={editing}
          onSave={handleSave}
          onCancel={handleCancel}
        />

      </section>

      {/* ALL PASSES */}

      <section id="passes" className="section alt">

        <h2>📋 All E-Passes ({filtered.length})</h2>

        <SearchBar
          query={query}
          onChange={setQuery}
        />

        {loading ? (
          <p className="message">
            Loading visitor records...
          </p>
        ) : (
          <PassList
            passes={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

      </section>

      {/* CHECKPOST LIST */}

      <section id="checkposts" className="section">

        <p className="section-tag center">
          AI CAMERAS DEPLOYED AT ALL 5 OOTY CHECKPOSTS
        </p>

        <div className="checkpost-grid">

          {checkpoints.map((checkpoint) => (
            <div key={checkpoint.id}>
              📍 {checkpoint.name} Gate
            </div>
          ))}

        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <p>🌿 Ooty EcoPass AI</p>

        <small>
          © 2026 Nilgiris District Administration
        </small>

      </footer>

    </div>
  );
}
