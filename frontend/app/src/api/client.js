export const API_BASE = "http://localhost:3001";

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

export function get(path) {
  return fetch(`${API_BASE}${path}`).then(parse);
}

export function post(path, body) {
  return fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(parse);
}

export function put(path, body) {
  return fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then(parse);
}

export function del(path) {
  return fetch(`${API_BASE}${path}`, { method: "DELETE" }).then(parse);
}
