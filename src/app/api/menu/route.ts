import { NextResponse } from 'next/server';
import { getDb } from '@/utils/mongodb';
import { MenuItem } from '@/types/menu';

export async function GET() {
  try {
    console.log('Fetching menu items from MongoDB...');
    const db = await getDb();
    const menuItems = await db.collection<MenuItem>('menu').find({}).toArray();
    
    console.log(`Found ${menuItems.length} menu items`);
    
    // Group items by category
    const categories = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    // Convert to array format
    const menuCategories = Object.entries(categories).map(([category, items]) => ({
      category,
      items,
    }));

    console.log('Successfully processed menu categories');
    return NextResponse.json(menuCategories);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
} 