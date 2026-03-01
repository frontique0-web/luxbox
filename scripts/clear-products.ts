import "dotenv/config";
import { db } from "../server/db";
import { products } from "../shared/schema";
import { sql } from "drizzle-orm";

async function clearProducts() {
    try {
        console.log("Clearing products table...");
        // We execute raw SQL just in case Drizzle complains about missing columns in schema definition vs DB state
        await db.execute(sql`DELETE FROM products`);
        console.log("Deleted all products.");
        process.exit(0);
    } catch (error) {
        console.error("Error clearing products:", error);
        process.exit(1);
    }
}

clearProducts();
