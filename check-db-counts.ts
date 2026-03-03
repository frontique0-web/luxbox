import { db } from './server/db';
import { products, categories, subcategories } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function check() {
    try {
        const pCount = await db.select({ count: sql<number>`count(*)` }).from(products);
        const cCount = await db.select({ count: sql<number>`count(*)` }).from(categories);
        const scCount = await db.select({ count: sql<number>`count(*)` }).from(subcategories);

        console.log(`Products: ${pCount[0]?.count}`);
        console.log(`Categories: ${cCount[0]?.count}`);
        console.log(`Subcategories: ${scCount[0]?.count}`);

        if (pCount[0]?.count > 0) {
            const sample = await db.select().from(products).limit(1);
            console.log('Sample Product:', sample[0]?.name);
        }
    } catch (e) {
        console.error('Database Error:', e);
    } finally {
        process.exit(0);
    }
}

check();
