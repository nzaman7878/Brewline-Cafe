/**
 * Services Layer (Tier 3)
 *
 * Services contain all business logic and orchestration:
 * - Validate business rules
 * - Coordinate between repositories
 * - Handle complex operations (payment flows, promo application)
 * - Trigger side effects (notifications, webhooks)
 *
 * Services should NOT access req/res objects —
 * they receive plain data from controllers.
 */

// Service modules will be added in subsequent phases:
// - authService.js        (Phase 6)
// - menuService.js        (Phase 10)
// - cartService.js        (Phase 18)
// - orderService.js       (Phase 21)
// - promoService.js       (Phase 19)
// - stripeService.js      (Phase 20)
// - staffService.js       (Phase 28)
// - adminService.js       (Phase 32)
// - emailService.js       (Phase 38)
// - smsService.js         (Phase 38)
