import { config } from 'dotenv';
import { resolve } from 'path';
import { seedMenu } from '../src/utils/seedMenu';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function main() {
  try {
    console.log('Starting database seeding...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    console.log('Database name:', process.env.MONGODB_DB);
    
    await seedMenu();
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main(); 