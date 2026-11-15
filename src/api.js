
const BASE = "http://localhost:5000/passes";

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

// READ
export const getPasses = () => request(BASE);

// CREATE
export const addPass = (pass) =>
  request(BASE, {
    method: "POST",
    body: JSON.stringify(pass),
  });

// UPDATE
export const updatePass = (id, pass) =>
  request(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(pass),
  });

// DELETE
export const deletePass = (id) =>
  request(`${BASE}/${id}`, {
    method: "DELETE",
  });

// SEARCH
export const searchPasses = (name) =>
  request(`${BASE}/search/${encodeURIComponent(name)}`);
