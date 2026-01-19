const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

const normalizeProfile = (payload) => {
  if (!payload) return null;
  const data = payload.data ?? payload;
  if (!data) return null;
  const attrs = data.attributes ?? data;
  return {
    id: data.id ?? attrs.id,
    ...attrs,
  };
};

const parseResponse = async (res) => {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      json?.error?.message || json?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json;
};

export const getMyProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/api/profiles/me?populate=avatar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await parseResponse(res);
  return normalizeProfile(json);
};

export const upsertMyProfile = async (token, payload) => {
  const res = await fetch(`${BASE_URL}/api/profiles/me?populate=avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const json = await parseResponse(res);
  return normalizeProfile(json);
};

export const uploadAvatar = async (token, file) => {
  const form = new FormData();
  form.append('files', file);

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  const json = await parseResponse(res);
  return Array.isArray(json) ? json[0] : json;
};

export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url}`;
};
