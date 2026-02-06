import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Database pool error:", err.message);
});

export const db = drizzle(pool, { schema });
