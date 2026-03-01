import "dotenv/config";
import { db } from "../server/db";
import { products, categories, subcategories } from "../shared/schema";
import { eq } from "drizzle-orm";

async function seedTwoProducts() {
    try {
        console.log("Seeding 2 default products...");

        // Get the first category to attach products to
        const cats = await db.select().from(categories).limit(1);
        if (cats.length === 0) {
            throw new Error("No categories found. Cannot insert products.");
        }
        const catId = cats[0].id;

        const productsData = [
            {
                name: "عطر ليالي الشرق",
                price: "450",
                categoryId: catId,
                badge: "مميز",
                imageUrl: "/assets/categories/perfumes.png",
                description: "عطر فاخر للمناسبات المميزة برائحة العود والخشب.",
                displayOrder: 1,
                isActive: true,
                code: "11111"
            },
            {
                name: "كفر آيفون 15 برو ماكس",
                price: "120",
                categoryId: catId,
                badge: "جديد",
                imageUrl: "/assets/categories/mobile-covers.png",
                description: "كفر حماية سيليكون أصلي بألوان متعددة.",
                displayOrder: 2,
                isActive: true,
                code: "22222"
            }
        ];

        await db.insert(products).values(productsData);

        console.log("Inserted 2 products successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error inserting products:", error);
        process.exit(1);
    }
}

seedTwoProducts();
