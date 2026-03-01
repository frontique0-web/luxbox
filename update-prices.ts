import { db } from './server/db';
import { products } from './shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('Fetching products...');
    const allProducts = await db.select().from(products);

    if (allProducts.length === 0) {
        console.log("No products found in DB. You might need to run the auto-seeder.");
        return;
    }

    console.log(`Found ${allProducts.length} products. Reviewing prices...`);

    for (const product of allProducts) {
        const originalPrice = product.price;
        let newPrice = originalPrice;

        // Check for AED or EAD or ل.س
        if (/AED/i.test(newPrice) || /EAD/i.test(newPrice) || /د\.إ/i.test(newPrice)) {
            const num = parseInt(newPrice.replace(/[^0-9]/g, ''));
            if (!isNaN(num)) {
                newPrice = `$${Math.round(num / 10)}`; // Example logic: 450 AED -> $45
            } else {
                newPrice = `$${newPrice.replace(/[^0-9]/g, '')}`;
            }
        } else if (/ل\.س/i.test(newPrice)) {
            const num = parseInt(newPrice.replace(/[^0-9]/g, ''));
            if (!isNaN(num)) {
                newPrice = `$${Math.round(num / 10000)}`; // Example logic: 450000 ل.س -> $45
            }
        } else if (!newPrice.includes("$")) {
            const num = parseInt(newPrice.replace(/[^0-9]/g, ''));
            if (!isNaN(num)) {
                newPrice = `$${num}`;
            }
        }

        if (newPrice !== originalPrice) {
            console.log(`Updating ${product.name}: ${originalPrice} -> ${newPrice}`);
            await db.update(products).set({ price: newPrice }).where(eq(products.id, product.id));
        }
    }

    console.log('All prices updated to USD successfully!');
    process.exit(0);
}

main().catch(console.error);
