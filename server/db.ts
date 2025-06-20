import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

let pool: Pool;
let db: ReturnType<typeof drizzle>;

try {
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  db = drizzle({ client: pool, schema });
  
  // Test the connection
  pool.on('connect', () => {
    console.log('Database connected successfully');
  });
  
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
  
} catch (error) {
  console.error('Database connection failed:', error);
  throw error;
}

// Function to ensure database connection is alive
export async function ensureConnection() {
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    console.log('Database connection lost, attempting to reconnect...');
    // The pool will automatically reconnect on next query
  }
}

export { pool, db };