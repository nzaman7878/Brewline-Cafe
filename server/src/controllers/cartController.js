import { Cart } from '../models/Cart.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

/**
 * @desc    Update user cart (entire replacement for simplicity)
 * @route   PUT /api/cart
 * @access  Private
 */
export const updateCart = asyncHandler(async (req, res) => {
  const { items } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: items || [] });
  } else {
    cart.items = items || [];
  }

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

/**
 * @desc    Sync local cart with server cart upon login
 * @route   POST /api/cart/sync
 * @access  Private
 */
export const syncCart = asyncHandler(async (req, res) => {
  const { localItems } = req.body; // Items from guest's localStorage

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Merge logic: If local items exist, they overwrite or merge with server items.
  // For simplicity and matching standard e-commerce behavior: 
  // We will append local items to server items, resolving duplicates by increasing quantity.
  
  if (localItems && localItems.length > 0) {
    const serverItemsMap = new Map(cart.items.map(item => [item.key, item]));
    
    localItems.forEach(localItem => {
      if (serverItemsMap.has(localItem.key)) {
        // Item exists, add quantities
        const existing = serverItemsMap.get(localItem.key);
        existing.quantity += localItem.quantity;
      } else {
        // New item, add to map
        serverItemsMap.set(localItem.key, localItem);
      }
    });
    
    cart.items = Array.from(serverItemsMap.values());
    await cart.save();
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});
