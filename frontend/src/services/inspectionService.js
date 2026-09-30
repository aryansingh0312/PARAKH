const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Unable to complete inspection request.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export const inspectionService = {
  list: (token, params = {}, signal) => request(`/inspections?${new URLSearchParams(params)}`, token, { signal }),
  eligibility: (token, signal) => request('/inspections/eligibility', token, { signal }),
  assignRandom: (token, deadline) => request('/inspections/random', token, { method: 'POST', body: JSON.stringify({ deadline }) }),
  get: (token, id, signal) => request(`/inspections/${encodeURIComponent(id)}`, token, { signal }),
  updateStatus: (token, id, status) => request(`/inspections/${encodeURIComponent(id)}/status`, token, { method: 'PATCH', body: JSON.stringify({ status }) }),
};