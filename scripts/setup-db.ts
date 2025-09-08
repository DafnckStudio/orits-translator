#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from '../src/db/schema';

async function setupDatabase() {
  console.log('🗄️  Setting up database...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  try {
    // Create connection
    const connection = postgres(process.env.DATABASE_URL, { max: 1 });
    const db = drizzle(connection, { schema });

    console.log('📦 Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('✅ Database setup completed successfully!');
    
    // Test connection
    const result = await db.execute('SELECT 1 as test');
    console.log('🔗 Database connection test:', result[0]);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();

