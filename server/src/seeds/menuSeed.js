import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MenuItem } from '../models/MenuItem.js';

// Load env vars
dotenv.config();

const DB_URI = process.env.MONGODB_URI;

// Reusable customizations
const sizeCustomization = {
  name: 'Size',
  required: true,
  options: [
    { name: 'Small (12oz)', priceAdjustment: 0 },
    { name: 'Medium (16oz)', priceAdjustment: 0.5 },
    { name: 'Large (20oz)', priceAdjustment: 1.0 },
  ],
};

const milkCustomization = {
  name: 'Milk Type',
  required: true,
  options: [
    { name: 'Whole Milk', priceAdjustment: 0 },
    { name: 'Skim Milk', priceAdjustment: 0 },
    { name: 'Oat Milk', priceAdjustment: 0.5 },
    { name: 'Almond Milk', priceAdjustment: 0.5 },
    { name: 'Soy Milk', priceAdjustment: 0.5 },
  ],
};

const sugarCustomization = {
  name: 'Sugar Level',
  required: true,
  options: [
    { name: 'None', priceAdjustment: 0 },
    { name: 'Light', priceAdjustment: 0 },
    { name: 'Normal', priceAdjustment: 0 },
    { name: 'Extra', priceAdjustment: 0 },
  ],
};

const addonCustomization = {
  name: 'Add-ons',
  required: false,
  options: [
    { name: 'Extra Espresso Shot', priceAdjustment: 0.75 },
    { name: 'Whipped Cream', priceAdjustment: 0.5 },
    { name: 'Vanilla Syrup', priceAdjustment: 0.6 },
    { name: 'Caramel Syrup', priceAdjustment: 0.6 },
  ],
};

const standardDrinkCustomizations = [sizeCustomization, milkCustomization, sugarCustomization, addonCustomization];
const standardTeaCustomizations = [sizeCustomization, sugarCustomization];
const pastryCustomizations = [
  {
    name: 'Preparation',
    required: false,
    options: [
      { name: 'Warmed', priceAdjustment: 0 },
      { name: 'Room Temperature', priceAdjustment: 0 },
    ],
  },
];

const menuItems = [
  // COFFEE
  {
    name: 'Signature Espresso',
    description: 'A double shot of our rich, balanced house espresso blend with notes of dark chocolate and cherry.',
    price: 3.0,
    category: 'Coffee',
    customizations: [addonCustomization],
  },
  {
    name: 'Classic Latte',
    description: 'Espresso balanced with steamed milk and a light layer of foam.',
    price: 4.5,
    category: 'Coffee',
    customizations: standardDrinkCustomizations,
  },
  {
    name: 'Cappuccino',
    description: 'Dark, rich espresso lying in wait under a smoothed and stretched layer of thick milk foam.',
    price: 4.5,
    category: 'Coffee',
    customizations: standardDrinkCustomizations,
  },
  {
    name: 'Cold Brew',
    description: 'Slow-steeped in cool water for 20 hours, without touching heat, for a super-smooth flavor.',
    price: 4.25,
    category: 'Coffee',
    customizations: [sizeCustomization, milkCustomization, addonCustomization],
  },
  {
    name: 'Americano',
    description: 'Espresso shots topped with hot water create a light layer of crema.',
    price: 3.5,
    category: 'Coffee',
    customizations: [sizeCustomization, addonCustomization],
  },
  {
    name: 'Cafe Mocha',
    description: 'Our rich, full-bodied espresso combined with bittersweet mocha sauce and steamed milk.',
    price: 5.0,
    category: 'Coffee',
    customizations: standardDrinkCustomizations,
  },
  {
    name: 'Flat White',
    description: 'Smooth ristretto shots of espresso get the perfect amount of steamed whole milk.',
    price: 4.75,
    category: 'Coffee',
    customizations: standardDrinkCustomizations,
  },

  // TEA
  {
    name: 'Matcha Green Tea Latte',
    description: 'Smooth and creamy matcha sweetened just right and served with steamed milk.',
    price: 4.75,
    category: 'Tea',
    customizations: standardDrinkCustomizations,
  },
  {
    name: 'Chai Tea Latte',
    description: 'Black tea infused with cinnamon, clove and other warming spices is combined with steamed milk.',
    price: 4.5,
    category: 'Tea',
    customizations: standardDrinkCustomizations,
  },
  {
    name: 'Iced Black Tea',
    description: 'Premium black tea shaken with ice. Refreshing and crisp.',
    price: 3.25,
    category: 'Tea',
    customizations: standardTeaCustomizations,
  },
  {
    name: 'Herbal Peppermint Tea',
    description: 'A soothing herbal tea infused with vibrant peppermint.',
    price: 3.0,
    category: 'Tea',
    customizations: [sizeCustomization],
  },
  {
    name: 'Earl Grey Tea',
    description: 'Black tea with the classic flavor of bergamot.',
    price: 3.0,
    category: 'Tea',
    customizations: [sizeCustomization, milkCustomization],
  },

  // SPECIALTY DRINKS
  {
    name: 'Caramel Frappé',
    description: 'Caramel syrup meets coffee, milk and ice for a rendezvous in the blender.',
    price: 5.5,
    category: 'Specialty Drinks',
    customizations: [sizeCustomization, milkCustomization, { ...addonCustomization, options: [...addonCustomization.options, { name: 'Extra Caramel Drizzle', priceAdjustment: 0.5 }] }],
  },
  {
    name: 'Lavender Honey Latte',
    description: 'Espresso and steamed milk infused with real honey and subtle lavender.',
    price: 5.25,
    category: 'Specialty Drinks',
    customizations: standardDrinkCustomizations,
  },
  {
    name: 'Golden Turmeric Latte',
    description: 'A warming, caffeine-free blend of turmeric, ginger, and spices steamed with milk.',
    price: 4.75,
    category: 'Specialty Drinks',
    customizations: [sizeCustomization, milkCustomization],
  },

  // PASTRIES
  {
    name: 'Butter Croissant',
    description: 'Classic, flaky, buttery crescent roll.',
    price: 3.5,
    category: 'Pastries',
    customizations: pastryCustomizations,
  },
  {
    name: 'Almond Croissant',
    description: 'Our butter croissant filled with sweet almond paste and topped with sliced almonds.',
    price: 4.25,
    category: 'Pastries',
    customizations: pastryCustomizations,
  },
  {
    name: 'Blueberry Muffin',
    description: 'A delicious muffin dotted throughout with sweet, juicy blueberries.',
    price: 3.25,
    category: 'Pastries',
    customizations: pastryCustomizations,
  },
  {
    name: 'Petite Vanilla Scone',
    description: 'A small, buttery scone flavored with real vanilla beans.',
    price: 2.75,
    category: 'Pastries',
    customizations: pastryCustomizations,
  },
  {
    name: 'Cheese Danish',
    description: 'Flaky pastry filled with a sweet and creamy cheese filling.',
    price: 3.75,
    category: 'Pastries',
    customizations: pastryCustomizations,
  },

  // FOOD
  {
    name: 'Avocado Toast',
    description: 'Smashed avocado on thick-cut artisan bread, topped with everything bagel seasoning.',
    price: 7.5,
    category: 'Food',
    customizations: [
      {
        name: 'Add-ons',
        required: false,
        options: [
          { name: 'Poached Egg', priceAdjustment: 1.5 },
          { name: 'Bacon', priceAdjustment: 2.0 },
          { name: 'Cherry Tomatoes', priceAdjustment: 0.75 },
        ],
      },
    ],
  },
  {
    name: 'Bacon & Egg Breakfast Sandwich',
    description: 'Hardwood-smoked bacon, a fluffy egg, and melted cheddar cheese on a toasted brioche bun.',
    price: 6.5,
    category: 'Food',
    customizations: [],
  },
  {
    name: 'Harvest Grain Bowl',
    description: 'Quinoa, roasted sweet potatoes, kale, avocado, and tahini dressing.',
    price: 11.0,
    category: 'Food',
    customizations: [
      {
        name: 'Protein',
        required: false,
        options: [
          { name: 'Grilled Chicken', priceAdjustment: 3.0 },
          { name: 'Tofu', priceAdjustment: 2.5 },
        ],
      },
    ],
  },
  {
    name: 'Caprese Panini',
    description: 'Fresh mozzarella, tomatoes, and basil pesto on toasted focaccia.',
    price: 8.5,
    category: 'Food',
    customizations: [],
  },

  // DESSERTS
  {
    name: 'Classic Tiramisu',
    description: 'Layers of espresso-soaked ladyfingers and rich mascarpone cream.',
    price: 6.0,
    category: 'Desserts',
    customizations: [],
  },
  {
    name: 'New York Cheesecake',
    description: 'A slice of dense, rich, and creamy authentic cheesecake.',
    price: 5.5,
    category: 'Desserts',
    customizations: [
      {
        name: 'Topping',
        required: false,
        options: [
          { name: 'Strawberry Compote', priceAdjustment: 1.0 },
          { name: 'Caramel Sauce', priceAdjustment: 0.5 },
        ],
      },
    ],
  },
  {
    name: 'Double Fudge Brownie',
    description: 'Decadent chocolate brownie with chocolate chunks.',
    price: 4.0,
    category: 'Desserts',
    customizations: [
      {
        name: 'Warmth',
        required: false,
        options: [
          { name: 'Warmed', priceAdjustment: 0 },
          { name: 'Room Temperature', priceAdjustment: 0 },
        ],
      },
    ],
  },
];

const seedMenu = async () => {
  try {
    if (!DB_URI) {
      console.error('❌ MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('✅ MongoDB connected!');

    console.log('Deleting existing menu items...');
    await MenuItem.deleteMany({});
    console.log('✅ Existing menu items deleted!');

    console.log('Inserting new menu items...');
    await MenuItem.insertMany(menuItems);
    console.log(`✅ ${menuItems.length} menu items inserted successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu data:', error);
    process.exit(1);
  }
};

seedMenu();
