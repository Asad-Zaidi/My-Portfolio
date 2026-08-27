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

// ---------------------------------------------------------------------
// Admin API — everything below requires a Bearer token from adminLogin().
// ---------------------------------------------------------------------

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminLogin(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function adminGetMe(token) {
  const res = await fetch(`${API_URL}/auth/me`, { headers: authHeaders(token) });
  return handleResponse(res);
}

// PATCH /api/portfolio — body may contain any subset of top-level sections.
export async function adminPatchPortfolio(token, sectionData) {
  const res = await fetch(`${API_URL}/portfolio`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(sectionData),
  });
  return handleResponse(res);
}

export async function adminGetMessages(token) {
  const res = await fetch(`${API_URL}/contact`, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function adminMarkMessageRead(token, id) {
  const res = await fetch(`${API_URL}/contact/${id}/read`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function adminDeleteMessage(token, id) {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

// POST /api/upload — multipart file upload (images, résumé PDF, etc).
export async function adminUploadFile(token, file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });
  return handleResponse(res);
}
