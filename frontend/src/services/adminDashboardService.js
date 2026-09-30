const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getAdminDashboard(token, signal) {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load dashboard data.');
  }

  return data;
}