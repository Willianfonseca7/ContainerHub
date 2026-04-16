/**
 * Seed script — 60 containers (Dusseldorf + Koeln)
 *
 * Uso:
 *   DATABASE_URL="postgresql://..." node seed.js
 */

const { Client } = require('pg');
const crypto = require('crypto');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Precos mensais por tamanho (em euros)
const PRICES = { S: 89, M: 129, L: 179 };
const CAMERA_EXTRA = 20;

function documentId() {
  return crypto.randomBytes(12).toString('hex');
}

function buildContainers() {
  const cities = ['Dusseldorf', 'Koeln'];
  const sizes = ['S', 'M', 'L'];
  const list = [];

  for (const city of cities) {
    const prefix = city === 'Dusseldorf' ? 'DUS' : 'KOE';

    for (const size of sizes) {
      // 5 com camera
      for (let i = 1; i <= 5; i++) {
        list.push({
          code: `${prefix}-${size}-CAM-${String(i).padStart(2, '0')}`,
          size,
          city,
          has_camera: true,
          availability_status: 'available',
          price_monthly: PRICES[size] + CAMERA_EXTRA,
        });
      }

      // 5 sem camera
      for (let i = 1; i <= 5; i++) {
        list.push({
          code: `${prefix}-${size}-${String(i).padStart(2, '0')}`,
          size,
          city,
          has_camera: false,
          availability_status: 'available',
          price_monthly: PRICES[size],
        });
      }
    }
  }

  return list;
}

async function seed() {
  await client.connect();
  console.log('Conectado ao PostgreSQL.\n');

  const containers = buildContainers();
  const now = new Date().toISOString();
  let inseridos = 0;
  let ignorados = 0;

  for (const c of containers) {
    const existing = await client.query(
      'SELECT id FROM containers WHERE code = $1',
      [c.code]
    );

    if (existing.rows.length > 0) {
      console.log(`  IGNORADO (ja existe): ${c.code}`);
      ignorados++;
      continue;
    }

    await client.query(
      `INSERT INTO containers
        (document_id, code, size, city, has_camera, availability_status, price_monthly, created_at, updated_at, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        documentId(),
        c.code,
        c.size,
        c.city,
        c.has_camera,
        c.availability_status,
        c.price_monthly,
        now,
        now,
        now,
      ]
    );

    console.log(`  ✓ ${c.code} | ${c.size} | ${c.city} | camera: ${c.has_camera} | €${c.price_monthly}/mes`);
    inseridos++;
  }

  await client.end();

  console.log(`\n===================================`);
  console.log(`Inseridos : ${inseridos}`);
  console.log(`Ignorados : ${ignorados}`);
  console.log(`Total     : ${containers.length}`);
  console.log(`===================================`);
}

seed().catch((err) => {
  console.error('Erro ao executar o seed:', err.message);
  process.exit(1);
});
