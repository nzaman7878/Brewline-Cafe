import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        menuItem: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Menu Item ID'),
        quantity: z.number().int().min(1),
        selectedOptions: z.record(z.any()).optional(),
        specialInstructions: z.string().max(500).optional(),
      })
    ).min(1, 'Order must have at least one item'),
    pickupTime: z.string().datetime().optional(), // ISO string
    guestInfo: z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
    }).optional(),
    promoCode: z.string().optional(),
  }),
});
