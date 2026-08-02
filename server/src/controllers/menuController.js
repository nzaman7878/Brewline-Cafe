import { MenuItem } from '../models/MenuItem.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get all menu items with filtering, search, and cursor pagination
 * @route   GET /api/menu
 * @access  Public
 */
export const getMenuItems = asyncHandler(async (req, res) => {
  const { category, search, excludeSoldOut, cursor, limit = 10 } = req.query;

  const query = {};

  // Filtering
  if (category) {
    query.category = category;
  }
  
  if (excludeSoldOut === 'true') {
    query.isAvailable = true;
  }

  // Search by name
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  // Cursor pagination
  if (cursor) {
    // Decode cursor assuming it's a base64 encoded _id, or just plain string
    // Usually it's base64 encoded to keep it opaque, but for simplicity here we'll assume it's just the object ID string
    query._id = { $gt: cursor };
  }

  const items = await MenuItem.find(query)
    .sort({ _id: 1 })
    .limit(Number(limit));

  // Determine next cursor
  let nextCursor = null;
  if (items.length === Number(limit)) {
    nextCursor = items[items.length - 1]._id;
  }

  // Set short cache header (e.g., 60 seconds) since availability can change rapidly
  res.set('Cache-Control', 'public, max-age=60');

  res.status(200).json({
    success: true,
    count: items.length,
    nextCursor,
    data: items,
  });
});

/**
 * @desc    Get single menu item by ID
 * @route   GET /api/menu/:id
 * @access  Public
 */
export const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }

  res.set('Cache-Control', 'public, max-age=60');

  res.status(200).json({
    success: true,
    data: item,
  });
});

/**
 * @desc    Get distinct menu categories
 * @route   GET /api/menu/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await MenuItem.distinct('category');

  // Categories don't change as frequently, can cache for longer
  res.set('Cache-Control', 'public, max-age=300');

  res.status(200).json({
    success: true,
    data: categories,
  });
});
