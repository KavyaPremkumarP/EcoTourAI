import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import checkpoints from "../data/checkpoints";

export default function CheckpointMap({ route, target, position }) {
  const el = useRef(null);
  const map = useRef(null);
  const staticLayer = useRef(null);
  const liveLayer = useRef(null);

  // 1. create the map once
  useEffect(() => {
    map.current = L.map(el.current).setView([11.45, 76.75], 10);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current);
    staticLayer.current = L.layerGroup().addTo(map.current);
    liveLayer.current = L.layerGroup().addTo(map.current);
    return () => {
      map.current.remove();
      map.current = null;
    };
  }, []);

  // 2. checkposts + recommended route (changes when the chosen road changes)
  useEffect(() => {
    const layer = staticLayer.current;
    layer.clearLayers();

    checkpoints.forEach((c) => {
      const mine = c.name === target.name;
      L.circleMarker([c.lat, c.lng], {
        radius: mine ? 11 : 7,
        color: mine ? "#991b1b" : "#047857",
        fillColor: mine ? "#ef4444" : "#10b981",
        fillOpacity: 0.9,
        weight: 2,
      })
        .bindTooltip(`${c.name} Checkpost${mine ? " (your gate)" : ""}`, { permanent: mine })
        .addTo(layer);
    });

    // 100 m alert zone
    L.circle([target.lat, target.lng], { radius: 100, color: "#dc2626", fillOpacity: 0.12 }).addTo(layer);

    L.circleMarker([route.origin.lat, route.origin.lng], {
      radius: 8, color: "#1e3a8a", fillColor: "#3b82f6", fillOpacity: 1,
    })
      .bindTooltip(`Start: ${route.label}`, { permanent: true, direction: "top" })
      .addTo(layer);

    // straight dashed line first, replaced by the real road route when it loads
    let line = L.polyline(
      [[route.origin.lat, route.origin.lng], [target.lat, target.lng]],
      { color: "#16834d", weight: 4, dashArray: "6 8" }
    ).addTo(layer);
    map.current.fitBounds(line.getBounds(), { padding: [40, 40] });

    let cancelled = false;
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${route.origin.lng},${route.origin.lat};${target.lng},${target.lat}` +
      `?overview=full&geometries=geojson`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data.routes?.[0]) return;
        layer.removeLayer(line);
        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        line = L.polyline(coords, { color: "#16834d", weight: 5 }).addTo(layer);
        map.current.fitBounds(line.getBounds(), { padding: [40, 40] });
      })
      .catch(() => {}); // offline: keep the dashed line

    return () => {
      cancelled = true;
    };
  }, [route, target]);

  // 3. live position + line to the checkpost (changes every GPS update)
  useEffect(() => {
    const layer = liveLayer.current;
    layer.clearLayers();
    if (!position) return;

    L.circleMarker([position.lat, position.lng], {
      radius: 9, color: "#fff", weight: 3, fillColor: "#2563eb", fillOpacity: 1,
    })
      .bindTooltip("📍 You are here", { permanent: true, direction: "bottom" })
      .addTo(layer);

    L.polyline([[position.lat, position.lng], [target.lat, target.lng]], {
      color: "#2563eb", weight: 3, dashArray: "4 6",
    }).addTo(layer);

    map.current.fitBounds(
      [[position.lat, position.lng], [target.lat, target.lng]],
      { padding: [70, 70], maxZoom: 16 }
    );
  }, [position, target]);

  return <div ref={el} className="map-box" />;
}