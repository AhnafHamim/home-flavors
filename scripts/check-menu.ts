import { config } from 'dotenv';
import { resolve } from 'path';
import { getDb } from '../src/utils/mongodb';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function checkMenu() {
  try {
    console.log('Checking menu items in database...');
    const db = await getDb();
    const collection = db.collection('menu');
    
    // Get all menu items
    const items = await collection.find({}).toArray();
    
    console.log('\nFound menu items:');
    console.log('-----------------');
    items.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.name}`);
      console.log(`   Category: ${item.category}`);
      console.log(`   Price: $${item.price}`);
      console.log(`   Available: ${item.available}`);
    });
    
    console.log(`\nTotal items: ${items.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error checking menu:', error);
    process.exit(1);
  }
}

checkMenu(); 