import { useCallback, useEffect, useRef, useState } from "react";

export default function useLiveLocation(target) {
  const [position, setPosition] = useState(null);
  const [mode, setMode] = useState("idle"); // idle | live | demo
  const [error, setError] = useState("");
  const watchId = useRef(null);
  const timer = useRef(null);

  const halt = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setMode("idle");
  }, []);

  const stop = useCallback(() => {
    halt();
    setPosition(null);
  }, [halt]);

  const askNotify = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  // REAL GPS tracking
  const startLive = () => {
    halt();
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this browser.");
      return;
    }
    askNotify();
    setMode("live");
    watchId.current = navigator.geolocation.watchPosition(
      (p) => setPosition({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {
        setError("Location permission denied or unavailable.");
        stop();
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 }
    );
  };

  // DEMO: a fake car drives to the checkpost from 2 km away (25 m every 0.3 s)
  const startDemo = () => {
    halt();
    setError("");
    askNotify();
    setMode("demo");
    const t = { lat: target.lat, lng: target.lng };
    let d = 2000;
    setPosition({ lat: t.lat - 0.018, lng: t.lng });
    timer.current = setInterval(() => {
      d -= 25;
      if (d <= 0) {
        setPosition(t);
        halt();
        return;
      }
      setPosition({ lat: t.lat - 0.018 * (d / 2000), lng: t.lng });
    }, 300);
  };

  useEffect(
    () => () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      if (timer.current) clearInterval(timer.current);
    },
    []
  );

  return { position, mode, error, startLive, startDemo, stop };
}