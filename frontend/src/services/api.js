const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function handleResponse(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return body;
}

// GET /api/portfolio — everything the site renders comes from this call.
export async function fetchPortfolio() {
  const res = await fetch(`${API_URL}/portfolio`);
  return handleResponse(res);
}

// POST /api/contact — used by the Contact section's form.
export async function submitContactMessage(payload) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
