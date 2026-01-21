import { requestJson, withAuth } from './http';

export async function createReservation(payload, token) {
  const { user: _ignored, ...safePayload } = payload || {};
  const headers = withAuth({ 'Content-Type': 'application/json' });
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return requestJson('/api/reservation-requests', {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: safePayload }),
  });
}

export async function getLatestReservation(email, token) {
  const params = new URLSearchParams({
    'pagination[pageSize]': '1',
    sort: 'createdAt:desc',
  });
  if (email) {
    params.set('filters[email][$eq]', email);
  }

  const headers = withAuth();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const responseData = await requestJson(`/api/reservation-requests?${params.toString()}`, {
    headers,
  });
  const data = Array.isArray(responseData?.data) ? responseData.data : [];
  return data[0] || null;
}
