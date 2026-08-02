import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        menuItemId: z.string().min(1, 'Menu item ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        selectedOptions: z.record(z.any()).optional(),
      })
    ).min(1, 'Order must contain at least one item'),
    promoCode: z.string().optional(),
    pickupTime: z.string().datetime().refine((val) => {
      const time = new Date(val);
      const now = new Date();
      // At least 15 min from now (allow a small grace period for request time)
      return time.getTime() >= now.getTime() + (14 * 60 * 1000);
    }, 'Pickup time must be at least 15 minutes in the future'),
    guestEmail: z.string().email('Invalid email').optional(),
    guestName: z.string().optional(),
    guestPhone: z.string().optional(),
    idempotencyKey: z.string().min(1, 'Idempotency key is required'),
  }),
});
