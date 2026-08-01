/**
 * Repositories Layer (Tier 4 — Data Access)
 *
 * Repositories encapsulate all database operations:
 * - CRUD operations via Mongoose models
 * - Aggregation pipelines
 * - Complex queries with filtering/pagination
 * - Atomic operations (e.g., $inc for promo usage)
 *
 * Repositories should NOT contain business logic —
 * they only handle data persistence and retrieval.
 * This separation makes it easy to swap databases
 * or add caching without touching business logic.
 */

// Repository modules will be added in subsequent phases:
// - userRepository.js       (Phase 6)
// - menuItemRepository.js   (Phase 10)
// - cartRepository.js       (Phase 18)
// - orderRepository.js      (Phase 21)
// - promoCodeRepository.js  (Phase 19)
