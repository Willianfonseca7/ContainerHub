/**
 * reservation-request controller
 */

import { factories } from '@strapi/strapi';

// Cast auf any, bis die generierten Typen das neue UID enthalten.
export default factories.createCoreController(
  'api::reservation-request.reservation-request' as any,
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('Bitte einloggen, um zu reservieren.');
      }

      const body = ctx.request.body || {};
      const data = body.data || {};
      const { user: _ignored, ...rest } = data;
      const model = strapi.getModel('api::reservation-request.reservation-request' as any);

      body.data = model?.attributes?.user ? { ...rest, user: user.id } : rest;
      ctx.request.body = body;

      return super.create(ctx);
    },
  }),
);
