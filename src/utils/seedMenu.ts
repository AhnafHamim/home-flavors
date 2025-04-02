import { getDb } from './mongodb';
import { MenuItemInput } from '../types/menu';

const MENU_ITEMS: MenuItemInput[] = [
  // Pizza
  {
    name: 'Classic Margherita',
    description: 'Fresh tomatoes, mozzarella, basil, and extra virgin olive oil',
    price: 14.99,
    image: '/images/pizza.jpg',
    category: 'Pizza',
    available: true,
  },
  {
    name: 'Pepperoni Supreme',
    description: 'Classic tomato sauce, mozzarella, and spicy pepperoni',
    price: 16.99,
    image: '/images/pepperoni.jpg',
    category: 'Pizza',
    available: true,
  },
  {
    name: 'Vegetarian Delight',
    description: 'Mushrooms, bell peppers, onions, olives, and fresh tomatoes',
    price: 15.99,
    image: '/images/veg-pizza.jpg',
    category: 'Pizza',
    available: true,
  },
  // Pasta
  {
    name: 'Spaghetti Carbonara',
    description: 'Pasta with eggs, cheese, pancetta, and black pepper',
    price: 16.99,
    image: '/images/pasta.jpg',
    category: 'Pasta',
    available: true,
  },
  {
    name: 'Fettuccine Alfredo',
    description: 'Creamy parmesan sauce with fresh fettuccine',
    price: 15.99,
    image: '/images/alfredo.jpg',
    category: 'Pasta',
    available: true,
  },
  // Salads
  {
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan cheese, and caesar dressing',
    price: 9.99,
    image: '/images/salad.jpg',
    category: 'Salads',
    available: true,
  },
  {
    name: 'Mediterranean Salad',
    description: 'Mixed greens, feta cheese, olives, tomatoes, and olive oil',
    price: 10.99,
    image: '/images/med-salad.jpg',
    category: 'Salads',
    available: true,
  },
  {
    name: 'Quinoa Bowl',
    description: 'Quinoa, roasted vegetables, chickpeas, and tahini dressing',
    price: 12.99,
    image: '/images/quinoa.jpg',
    category: 'Salads',
    available: true,
  },
  // Desserts
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 8.99,
    image: '/images/tiramisu.jpg',
    category: 'Desserts',
    available: true,
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 9.99,
    image: '/images/lava-cake.jpg',
    category: 'Desserts',
    available: true,
  },
  {
    name: 'Panna Cotta',
    description: 'Italian cream dessert with fresh berries and honey',
    price: 7.99,
    image: '/images/panna-cotta.jpg',
    category: 'Desserts',
    available: true,
  },
];

export async function seedMenu() {
  try {
    const db = await getDb();
    const collection = db.collection('menu');

    // Clear existing menu items
    await collection.deleteMany({});

    // Insert new menu items
    const result = await collection.insertMany(MENU_ITEMS);

    console.log(`Successfully seeded ${result.insertedCount} menu items`);
    return result;
  } catch (error) {
    console.error('Error seeding menu:', error);
    throw error;
  }
} 