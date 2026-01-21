const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export const getAuthToken = () =>
  localStorage.getItem('containerhub_token') || localStorage.getItem('kontainer_token');

export const withAuth = (headers = {}) => {
  const token = getAuthToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

export const requestJson = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => ({}))
    : await res.text();

  if (!res.ok) {
    const error = new Error('Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export { BASE_URL };
