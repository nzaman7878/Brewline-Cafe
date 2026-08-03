import { z } from 'zod';

export const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    category: z.string().min(2),
    isAvailable: z.coerce.boolean().optional(),
    image: z.string().url().optional().or(z.literal('')),
  }).passthrough(),
});

export const updateMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    category: z.string().min(2).optional(),
    isAvailable: z.coerce.boolean().optional(),
    image: z.string().url().optional().or(z.literal('')),
  }).passthrough(),
});

export const createPromoSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(20).toUpperCase(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().positive(),
    minOrderValue: z.number().min(0).optional(),
    validFrom: z.string().datetime().optional(),
    validUntil: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
    usageLimit: z.number().int().min(1).optional(),
  }),
});
