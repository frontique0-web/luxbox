import "dotenv/config";
import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";

async function fixProducts() {
    try {
        console.log("Fetching all products...");
        const allProducts = await db.select().from(products);
        console.log(`Found ${allProducts.length} products.`);

        for (let i = 0; i < allProducts.length; i++) {
            const p = allProducts[i];
            // Generate a unique 5-digit code based on the index to ensure uniqueness for fixing
            const newCode = String(10000 + i).slice(0, 5);
            console.log(`Updating product ${p.id} (${p.name}) code to: ${newCode}, isActive: true`);

            await db.update(products)
                .set({ code: newCode, isActive: true })
                .where(eq(products.id, p.id));
        }

        console.log("Done updating products.");
        process.exit(0);
    } catch (error) {
        console.error("Error fixing products:", (error as any).message || error);
        process.exit(1);
    }
}

fixProducts();
