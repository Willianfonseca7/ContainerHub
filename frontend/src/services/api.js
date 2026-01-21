import { requestJson, withAuth } from './http';

function normalizeContainer(entry) {
  if (!entry) return null;
  const attrs = entry.attributes || entry.data || entry;
  const hasCamera = attrs.has_camera ?? attrs.hasCamera ?? false;
  const status = attrs.availability_status ?? attrs.availabilityStatus ?? attrs.status ?? 'available';
  const size = attrs.size ?? attrs.sizeM2;
  const city = attrs.city ?? attrs.location;
  const code = attrs.code;
  const priceRaw = attrs.price ?? attrs.priceMonthly ?? attrs.price_monthly;
  const price = priceRaw !== undefined ? Number(priceRaw) : 0;
  const priceMonthly = priceRaw !== undefined ? Number(priceRaw) : 0;

  return {
    id: entry.id ?? attrs.id,
    ...attrs,
    code,
    size,
    city,
    hasCamera,
    availabilityStatus: status,
    status,
    price,
    priceMonthly,
  };
}

export async function getContainers() {
  const json = await requestJson('/api/containers?pagination[pageSize]=200');
  const data = Array.isArray(json?.data) ? json.data : [];
  return data.map(normalizeContainer).filter(Boolean);
}

export async function getContainerById(id) {
  const json = await requestJson(`/api/containers/${id}`);
  const entry = json?.data;
  return normalizeContainer(entry);
}

export async function sendContactMessage(payload) {
  return requestJson('/api/contacts', {
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ data: { ...payload, status: 'new' } }),
  });
}
