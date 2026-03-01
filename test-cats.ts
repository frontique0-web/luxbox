import { db } from "./server/db";
import { categories } from "@shared/schema";

async function getCats() {
    try {
        const cats = await db.select().from(categories);
        console.log(JSON.stringify(cats, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

getCats();
