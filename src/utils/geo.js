const toRad = (d) => (d * Math.PI) / 180;

// distance in METRES between two {lat, lng} points
export function haversineM(a, b) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export const formatDistance = (m) =>
  m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;