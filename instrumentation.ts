import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './lib/db/schema';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export async function register() {
    // Only run migrations in Node.js runtime (not Edge)
    if (process.env.NEXT_RUNTIME !== 'nodejs') {
        return;
    }

    // Skip if DATABASE_URL is not available
    if (!process.env.DATABASE_URL) {
        console.warn('DATABASE_URL not found, skipping migrations');
        return;
    }

    try {
        const db = drizzle(process.env.DATABASE_URL, {
            schema: { ...schema },
            logger: false // Disable logger during migrations to reduce noise
        });

        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('✅ Database migrations completed successfully');
    } catch (error) {
        console.error('❌ Migration error:', error);
        // Don't throw - allow server to start even if migrations fail
        // This prevents the entire app from crashing if DB is temporarily unavailable
    }
}

