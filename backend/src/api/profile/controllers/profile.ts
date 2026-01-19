/**
 * profile controller
 */

import { factories } from '@strapi/strapi';

type ProfilePayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressZip?: string;
  addressCity?: string;
  addressCountry?: string;
  paymentMethod?: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay';
  avatar?: number | null;
};

const paymentMethods = new Set(['credit_card', 'debit_card', 'paypal', 'apple_pay']);

const sanitizePayload = (body: Record<string, unknown>): ProfilePayload => {
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : undefined;
  const email = typeof body.email === 'string' ? body.email.trim() : undefined;
  const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined;
  const addressStreet =
    typeof body.addressStreet === 'string' ? body.addressStreet.trim() : undefined;
  const addressNumber =
    typeof body.addressNumber === 'string' ? body.addressNumber.trim() : undefined;
  const addressZip = typeof body.addressZip === 'string' ? body.addressZip.trim() : undefined;
  const addressCity = typeof body.addressCity === 'string' ? body.addressCity.trim() : undefined;
  const addressCountry =
    typeof body.addressCountry === 'string' ? body.addressCountry.trim() : undefined;
  const paymentMethod =
    typeof body.paymentMethod === 'string' && paymentMethods.has(body.paymentMethod.trim())
      ? (body.paymentMethod.trim() as ProfilePayload['paymentMethod'])
      : undefined;

  let avatar: number | null | undefined;
  if (typeof body.avatar === 'number') {
    avatar = body.avatar;
  } else if (typeof body.avatar === 'string' && body.avatar.trim()) {
    const parsed = Number(body.avatar);
    if (!Number.isNaN(parsed)) avatar = parsed;
  } else if (body.avatar === null) {
    avatar = null;
  }

  const payload: ProfilePayload = {};
  if (fullName !== undefined) payload.fullName = fullName;
  if (email !== undefined) payload.email = email;
  if (phone !== undefined) payload.phone = phone;
  if (addressStreet !== undefined) payload.addressStreet = addressStreet;
  if (addressNumber !== undefined) payload.addressNumber = addressNumber;
  if (addressZip !== undefined) payload.addressZip = addressZip;
  if (addressCity !== undefined) payload.addressCity = addressCity;
  if (addressCountry !== undefined) payload.addressCountry = addressCountry;
  if (paymentMethod !== undefined) payload.paymentMethod = paymentMethod;
  if (avatar !== undefined) payload.avatar = avatar;
  return payload;
};

export default factories.createCoreController('api::profile.profile', ({ strapi }) => ({
  async me(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const profile = await strapi.db.query('api::profile.profile').findOne({
      where: { user: user.id },
      populate: ['avatar'],
    });

    if (!profile) {
      return ctx.send({ data: null });
    }

    const sanitized = await this.sanitizeOutput(profile, ctx);
    return this.transformResponse(sanitized);
  },

  async updateMe(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const data = sanitizePayload(ctx.request.body || {});
    const email = data.email || user.email;

    const existing = await strapi.db.query('api::profile.profile').findOne({
      where: { user: user.id },
    });

    if (!existing && (!data.fullName || !data.paymentMethod)) {
      return ctx.badRequest('fullName and paymentMethod are required');
    }

    if (existing) {
      const updated = await strapi.entityService.update('api::profile.profile', existing.id, {
        data: {
          ...data,
          email,
        },
        populate: ['avatar'],
      });
      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    }

    const fullName = data.fullName;
    const paymentMethod = data.paymentMethod;
    if (!fullName || !paymentMethod) {
      return ctx.badRequest('fullName and paymentMethod are required');
    }

    const created = await strapi.entityService.create('api::profile.profile', {
      data: {
        ...data,
        fullName,
        paymentMethod,
        email,
        user: user.id,
      },
      populate: ['avatar'],
    });

    const sanitized = await this.sanitizeOutput(created, ctx);
    return this.transformResponse(sanitized);
  },
}));
