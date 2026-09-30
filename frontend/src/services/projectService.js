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
    const error = new Error(data.message || 'Unable to complete project request.');
    error.status = response.status;
    error.field = data.field;
    error.errors = data.errors;
    throw error;
  }

  return data;
}

export const projectService = {
  list: (token, params, signal) => {
    const query = new URLSearchParams(params);
    return request(`/projects?${query.toString()}`, token, { signal });
  },
  get: (token, id, signal) => request(`/projects/${encodeURIComponent(id)}`, token, { signal }),
  create: (token, project) => request('/projects', token, { method: 'POST', body: JSON.stringify(project) }),
  update: (token, id, project) => request(`/projects/${encodeURIComponent(id)}`, token, { method: 'PUT', body: JSON.stringify(project) }),
  updateStatus: (token, id, status) => request(`/projects/${encodeURIComponent(id)}/status`, token, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (token, id) => request(`/projects/${encodeURIComponent(id)}`, token, { method: 'DELETE' }),
};