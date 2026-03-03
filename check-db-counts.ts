import { db } from "./server/db";
import { categories, products } from "@shared/schema";

async function run() {
    try {
        const cats = await db.select().from(categories);
        const prods = await db.select().from(products);
        console.log("Categories:\n", JSON.stringify(cats, null, 2));
        console.log("Products:\n", JSON.stringify(prods, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
