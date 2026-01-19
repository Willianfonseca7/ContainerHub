/**
 * Uso:
 *   LOCAL_URL=http://localhost:1337 \
 *   REMOTE_URL=https://seu-backend.onrender.com \
 *   REMOTE_TOKEN=seu_token \
 *   node scripts/transfer-containers.js
 *
 * Requer:
 *   - Strapi local rodando
 *   - Token de API no Strapi de producao com permissao de escrita
 */

const LOCAL_URL = process.env.LOCAL_URL || "http://localhost:1337";
const REMOTE_URL = process.env.REMOTE_URL;
const REMOTE_TOKEN = process.env.REMOTE_TOKEN;

if (!REMOTE_URL || !REMOTE_TOKEN) {
  console.error("Defina REMOTE_URL e REMOTE_TOKEN.");
  process.exit(1);
}

const LOCAL_ENDPOINT = `${LOCAL_URL}/api/containers?pagination[pageSize]=200`;
const REMOTE_ENDPOINT = `${REMOTE_URL}/api/containers`;

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} em ${url}: ${text}`);
  }
  return text ? JSON.parse(text) : {};
}

async function getLocalContainers() {
  const json = await fetchJson(LOCAL_ENDPOINT);
  return Array.isArray(json?.data) ? json.data : [];
}

async function existsRemoteByCode(code) {
  const url = `${REMOTE_ENDPOINT}?filters[code][$eq]=${encodeURIComponent(code)}&pagination[pageSize]=1`;
  const json = await fetchJson(url, {
    headers: { Authorization: `Bearer ${REMOTE_TOKEN}` },
  });
  return Array.isArray(json?.data) && json.data.length > 0;
}

function mapContainer(entry) {
  const attrs = entry?.attributes || {};
  return {
    code: attrs.code,
    size: attrs.size,
    city: attrs.city,
    has_camera: attrs.has_camera ?? false,
    availability_status: attrs.availability_status ?? "available",
    priceMonthly: attrs.priceMonthly,
    // Forca publicar os itens importados.
    publishedAt: new Date().toISOString(),
  };
}

async function createRemoteContainer(data) {
  await fetchJson(REMOTE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${REMOTE_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });
}

async function main() {
  console.log(`LOCAL_URL: ${LOCAL_URL}`);
  console.log(`REMOTE_URL: ${REMOTE_URL}`);

  const items = await getLocalContainers();
  console.log(`Encontrados: ${items.length}`);

  let created = 0;
  let skipped = 0;

  for (const entry of items) {
    const data = mapContainer(entry);
    if (!data.code) {
      console.log("↷ Sem code, pulando item.");
      skipped++;
      continue;
    }

    if (await existsRemoteByCode(data.code)) {
      console.log(`↷ Ja existe ${data.code}`);
      skipped++;
      continue;
    }

    await createRemoteContainer(data);
    console.log(`✔ Criado ${data.code}`);
    created++;
  }

  console.log("---");
  console.log(`Criados: ${created}`);
  console.log(`Pulados: ${skipped}`);
}

main().catch((err) => {
  console.error("Erro:", err.message);
  process.exit(1);
});
