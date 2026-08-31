const getBaseUrl = () => {
  const envUrl =
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    process.env.BACKEND_API_URL ||
    // "http://localhost:5000/api";
    "https://asad-portfolio-backend.vercel.app/api";

  const cleaned = envUrl.replace(/\/+$/, "");
  return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
};

export const API_URL = getBaseUrl();

let authToken = null;
let portfolioCache = null;
let portfolioRequest = null;

export const setAuthToken = (token) => {
  authToken = token || null;
};

function authHeaders(token) {
  const activeToken = token || authToken;
  return activeToken ? { Authorization: `Bearer ${activeToken}` } : {};
}

async function handleResponse(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return body;
}

// Custom fetch client
export const api = {
  get: async (path, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    };
    const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      method: "GET",
      headers,
      ...options,
    });
    return { data: await handleResponse(res) };
  },
  post: async (path, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...authHeaders(),
      ...(options.headers || {}),
    };
    const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
    return { data: await handleResponse(res) };
  },
  patch: async (path, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...authHeaders(),
      ...(options.headers || {}),
    };
    const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      method: "PATCH",
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
    return { data: await handleResponse(res) };
  },
  put: async (path, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...authHeaders(),
      ...(options.headers || {}),
    };
    const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      method: "PUT",
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
    return { data: await handleResponse(res) };
  },
  delete: async (path, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    };
    const res = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      method: "DELETE",
      headers,
      ...options,
    });
    return { data: await handleResponse(res) };
  },
};

// GET /api/portfolio — everything the site renders comes from this call.
export async function fetchPortfolio() {
  if (portfolioCache) return portfolioCache;
  if (portfolioRequest) return portfolioRequest;

  portfolioRequest = fetch(`${API_URL}/portfolio`)
    .then(handleResponse)
    .then((data) => {
      portfolioCache = data;
      return data;
    })
    .finally(() => {
      portfolioRequest = null;
    });

  return portfolioRequest;
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

export async function adminChangePassword(token, { currentPassword, newPassword }) {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
}

// PATCH /api/portfolio — body may contain any subset of top-level sections.
export async function adminPatchPortfolio(token, sectionData) {
  const res = await fetch(`${API_URL}/portfolio`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(sectionData),
  });
  const data = await handleResponse(res);
  portfolioCache = data;
  return data;
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
  const fileName = file?.name || "file";
  const sizeKb = file?.size ? `${(file.size / 1024).toFixed(2)} KB` : "";
  console.log(`[Upload] ⏳ Uploading: ${fileName} (${sizeKb})...`);

  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: authHeaders(token),
      body: formData,
    });
    const result = await handleResponse(res);
    console.log(`[Upload] ✅ Uploaded successfully! URL:`, result.url);
    return result;
  } catch (err) {
    console.error(`[Upload] ❌ Upload failed:`, err.message);
    throw err;
  }
}

export const postMultipart = (path, formData, options = {}) => {
  return api.post(path, formData, options);
};

export const putMultipart = (path, formData, options = {}) => {
  return api.put(path, formData, options);
};

export default api;