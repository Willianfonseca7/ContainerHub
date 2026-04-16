import type { Core } from '@strapi/strapi';

const PRICES = { S: 89, M: 129, L: 179 };
const CAMERA_EXTRA = 20;

function buildContainers() {
  const cities = ['Dusseldorf', 'Koeln'] as const;
  const sizes = ['S', 'M', 'L'] as const;
  const list: {
    code: string;
    size: 'S' | 'M' | 'L';
    city: 'Dusseldorf' | 'Koeln';
    has_camera: boolean;
    availability_status: 'available' | 'reserved' | 'rented';
    priceMonthly: number;
    publishedAt: Date;
  }[] = [];

  for (const city of cities) {
    const prefix = city === 'Dusseldorf' ? 'DUS' : 'KOE';
    for (const size of sizes) {
      for (let i = 1; i <= 5; i++) {
        list.push({
          code: `${prefix}-${size}-CAM-${String(i).padStart(2, '0')}`,
          size,
          city,
          has_camera: true,
          availability_status: 'available',
          priceMonthly: PRICES[size] + CAMERA_EXTRA,
          publishedAt: new Date(),
        });
      }
      for (let i = 1; i <= 5; i++) {
        list.push({
          code: `${prefix}-${size}-${String(i).padStart(2, '0')}`,
          size,
          city,
          has_camera: false,
          availability_status: 'available',
          priceMonthly: PRICES[size],
          publishedAt: new Date(),
        });
      }
    }
  }
  return list;
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const count = await strapi.documents('api::container.container').count({ status: 'published' });

    if (count > 0) {
      strapi.log.info(`[seed] ${count} containers ja existem — seed ignorado.`);
      return;
    }

    strapi.log.info('[seed] Nenhum container encontrado. Inserindo 60 containers...');
    const containers = buildContainers();

    for (const data of containers) {
      await strapi.documents('api::container.container').create({
        data,
        status: 'published',
      });
    }

    strapi.log.info('[seed] 60 containers inseridos com sucesso!');
  },
};
