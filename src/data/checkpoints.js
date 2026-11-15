const checkpoints = [
  { id: 1, name: "Kallar", lat: 11.3757, lng: 76.8607 },
  { id: 2, name: "Kunjapanai", lat: 11.478, lng: 76.8935 },
  { id: 3, name: "Masinagudi", lat: 11.5665, lng: 76.648 },
  { id: 4, name: "Mel Gudalur", lat: 11.5, lng: 76.55 },
  { id: 5, name: "Geddai", lat: 11.42, lng: 76.72 },
];

export const routes = [
  { key: "mettupalayam", label: "Mettupalayam / Coimbatore", origin: { lat: 11.299, lng: 76.938 }, checkpost: "Kallar", road: "Mettupalayam–Ooty Road" },
  { key: "kotagiri", label: "Kotagiri", origin: { lat: 11.4202, lng: 76.861 }, checkpost: "Kunjapanai", road: "Kotagiri Road" },
  { key: "masinagudi", label: "Mysuru / Bandipur", origin: { lat: 11.6667, lng: 76.6333 }, checkpost: "Masinagudi", road: "Masinagudi–Ooty Road" },
  { key: "gudalur", label: "Gudalur / Kerala", origin: { lat: 11.5028, lng: 76.492 }, checkpost: "Mel Gudalur", road: "Gudalur–Ooty Road" },
  { key: "coonoor", label: "Coonoor", origin: { lat: 11.353, lng: 76.7959 }, checkpost: "Geddai", road: "Geddai Road" },
];

export default checkpoints;