const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

const parseResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      (Array.isArray(data?.error?.details?.errors) && data.error.details.errors[0]?.message) ||
      `Auth request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};

export const registerLocal = async ({ name, email, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: name,
      email,
      password,
    }),
  });
  return parseResponse(res);
};

export const loginLocal = async ({ identifier, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });
  return parseResponse(res);
};
