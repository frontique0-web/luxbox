import { db } from "./db";
import { categories, subcategories, products } from "@shared/schema";
import { sql } from "drizzle-orm";
import path from "path";

export async function autoSeed() {
  try {
    console.log("Checking database schema...");
    try {
      await db.execute(sql.raw(`
        CREATE TABLE IF NOT EXISTS "admins" (
          "id" serial PRIMARY KEY NOT NULL,
          "username" text NOT NULL,
          "password" text NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          CONSTRAINT "admins_username_unique" UNIQUE("username")
        );
        CREATE TABLE IF NOT EXISTS "categories" (
          "id" serial PRIMARY KEY NOT NULL,
          "name_ar" text NOT NULL,
          "name_en" text NOT NULL,
          "icon" text,
          "image_url" text,
          "slug" text NOT NULL,
          "display_order" integer DEFAULT 0 NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          CONSTRAINT "categories_slug_unique" UNIQUE("slug")
        );
        CREATE TABLE IF NOT EXISTS "subcategories" (
          "id" serial PRIMARY KEY NOT NULL,
          "category_id" integer NOT NULL,
          "name_ar" text NOT NULL,
          "name_en" text,
          "display_order" integer DEFAULT 0 NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL
        );
        CREATE TABLE IF NOT EXISTS "products" (
          "id" serial PRIMARY KEY NOT NULL,
          "name" text NOT NULL,
          "price" text NOT NULL,
          "category_id" integer NOT NULL,
          "subcategory_id" integer,
          "badge" text NOT NULL,
          "image_url" text NOT NULL,
          "image_url2" text,
          "image_url3" text,
          "description" text,
          "is_active" boolean DEFAULT true NOT NULL,
          "display_order" integer DEFAULT 0 NOT NULL,
          "code" varchar(5) DEFAULT (floor(random() * 90000 + 10000))::text NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL,
          CONSTRAINT "products_code_unique" UNIQUE("code")
        );
        CREATE TABLE IF NOT EXISTS "settings" (
          "id" serial PRIMARY KEY NOT NULL,
          "exchange_rate" text DEFAULT '15000' NOT NULL,
          "currency" text DEFAULT 'USD' NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );
        CREATE TABLE IF NOT EXISTS "users" (
          "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "username" text NOT NULL,
          "password" text NOT NULL,
          CONSTRAINT "users_username_unique" UNIQUE("username")
        );
        DO $$ BEGIN
          ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
        EXCEPTION WHEN duplicate_object THEN null; END $$;
        DO $$ BEGIN
          ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;
        EXCEPTION WHEN duplicate_object THEN null; END $$;
        DO $$ BEGIN
          ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
        EXCEPTION WHEN duplicate_object THEN null; END $$;
      `));
      console.log("✅ Database schema verified/applied successfully via raw SQL.");
    } catch (schemaErr: any) {
      console.warn("⚠️ Schema verification warning:", schemaErr.message);
    }

    const result = await db.select({ count: sql<number>`count(*)` }).from(categories);
    const count = Number(result[0]?.count ?? 0);

    if (count > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Empty database detected, auto-seeding...");

    const categoriesData = [
      { nameAr: "عطورات", nameEn: "Perfumes", icon: "SprayCan", slug: "perfumes", displayOrder: 1 },
      { nameAr: "مكياج وعناية", nameEn: "Makeup & Care", icon: "Palette", slug: "makeup", displayOrder: 2 },
      { nameAr: "ساعات", nameEn: "Watches", icon: "Watch", slug: "watches", displayOrder: 3 },
      { nameAr: "إكسسوارات", nameEn: "Accessories", icon: "Gem", slug: "accessories", displayOrder: 4 },
      { nameAr: "شناتي", nameEn: "Bags", icon: "ShoppingBag", slug: "bags", displayOrder: 5 },
      { nameAr: "كفرات موبايل", nameEn: "Mobile Covers", icon: "Smartphone", slug: "mobile-covers", displayOrder: 6 },
      { nameAr: "فيب", nameEn: "Vape", icon: "Cigarette", slug: "vape", displayOrder: 7 },
    ];

    const insertedCats = await db.insert(categories).values(categoriesData).returning();
    console.log(`Inserted ${insertedCats.length} categories`);

    const subcategoriesData = [
      { categoryId: insertedCats[0].id, nameAr: "عطورات فرنسية", nameEn: "French Perfumes", displayOrder: 1 },
      { categoryId: insertedCats[0].id, nameAr: "عطورات إماراتية", nameEn: "Emirati Perfumes", displayOrder: 2 },
      { categoryId: insertedCats[0].id, nameAr: "عطورات كوبي وان", nameEn: "Copy One Perfumes", displayOrder: 3 },
      { categoryId: insertedCats[1].id, nameAr: "مكياج", nameEn: "Makeup", displayOrder: 1 },
      { categoryId: insertedCats[1].id, nameAr: "عناية بالبشرة", nameEn: "Skincare", displayOrder: 2 },
      { categoryId: insertedCats[2].id, nameAr: "كوبي ماستر", nameEn: "Master Copy", displayOrder: 1 },
      { categoryId: insertedCats[2].id, nameAr: "أوريجنال", nameEn: "Original", displayOrder: 2 },
      { categoryId: insertedCats[3].id, nameAr: "أطقم", nameEn: "Sets", displayOrder: 1 },
      { categoryId: insertedCats[3].id, nameAr: "خواتم", nameEn: "Rings", displayOrder: 2 },
      { categoryId: insertedCats[3].id, nameAr: "سلاسل", nameEn: "Chains", displayOrder: 3 },
      { categoryId: insertedCats[4].id, nameAr: "شناتي نسائية", nameEn: "Women Bags", displayOrder: 1 },
      { categoryId: insertedCats[4].id, nameAr: "شناتي رجالية", nameEn: "Men Bags", displayOrder: 2 },
      { categoryId: insertedCats[5].id, nameAr: "آيفون", nameEn: "iPhone", displayOrder: 1 },
      { categoryId: insertedCats[5].id, nameAr: "سامسونج", nameEn: "Samsung", displayOrder: 2 },
      { categoryId: insertedCats[6].id, nameAr: "جوسات", nameEn: "Juices", displayOrder: 1 },
      { categoryId: insertedCats[6].id, nameAr: "سحبات السيكارة", nameEn: "Cigarette Disposables", displayOrder: 2 },
      { categoryId: insertedCats[6].id, nameAr: "سحبات الأركيلة", nameEn: "Hookah Disposables", displayOrder: 3 },
      { categoryId: insertedCats[6].id, nameAr: "Coil", nameEn: "Coil", displayOrder: 4 },
      { categoryId: insertedCats[6].id, nameAr: "Pod", nameEn: "Pod", displayOrder: 5 },
      { categoryId: insertedCats[6].id, nameAr: "Tank", nameEn: "Tank", displayOrder: 6 },
    ];

    const insertedSubs = await db.insert(subcategories).values(subcategoriesData).returning();
    console.log(`Inserted ${insertedSubs.length} subcategories`);

    const vapeSubs = insertedSubs.filter(s => [insertedCats[6].id].includes(s.categoryId));
    const juicesSub = vapeSubs.find(s => s.nameEn === "Juices")!;
    const cigDispSub = vapeSubs.find(s => s.nameEn === "Cigarette Disposables")!;
    const hookahDispSub = vapeSubs.find(s => s.nameEn === "Hookah Disposables")!;



    const sub = (nameEn: string) => insertedSubs.find(s => s.nameEn === nameEn)!;

    const productsData = [
      { name: "Imperial Leather", price: "$45", categoryId: insertedCats[0].id, subcategoryId: sub("French Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "عطر فرنسي فاخر", displayOrder: 1 },
      { name: "Royal Oud", price: "$38", categoryId: insertedCats[0].id, subcategoryId: sub("French Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "عطر عود ملكي", displayOrder: 2 },
      { name: "Midnight Rose", price: "$32", categoryId: insertedCats[0].id, subcategoryId: sub("French Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "عطر الوردة المسائية", displayOrder: 3 },
      { name: "Golden Elixir", price: "$55", categoryId: insertedCats[0].id, subcategoryId: sub("French Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "إكسير ذهبي فاخر", displayOrder: 4 },
      { name: "Oud Al Emarat", price: "$28", categoryId: insertedCats[0].id, subcategoryId: sub("Emirati Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "عود إماراتي أصلي", displayOrder: 1 },
      { name: "Musk Amber", price: "$35", categoryId: insertedCats[0].id, subcategoryId: sub("Emirati Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "مسك وعنبر إماراتي", displayOrder: 2 },
      { name: "Arabian Nights", price: "$42", categoryId: insertedCats[0].id, subcategoryId: sub("Emirati Perfumes").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "ليالي عربية", displayOrder: 3 },
      { name: "Sauvage Copy", price: "$12", categoryId: insertedCats[0].id, subcategoryId: sub("Copy One Perfumes").id, badge: "Copy One", imageUrl: "/assets/product-placeholder-1.png", description: "كوبي وان سوفاج", displayOrder: 1 },
      { name: "Bleu Copy", price: "$11", categoryId: insertedCats[0].id, subcategoryId: sub("Copy One Perfumes").id, badge: "Copy One", imageUrl: "/assets/product-placeholder-1.png", description: "كوبي وان بلو", displayOrder: 2 },
      { name: "Eros Copy", price: "$10", categoryId: insertedCats[0].id, subcategoryId: sub("Copy One Perfumes").id, badge: "Copy One", imageUrl: "/assets/product-placeholder-1.png", description: "كوبي وان إيروس", displayOrder: 3 },
      { name: "Velvet Matte Lip", price: "$8.50", categoryId: insertedCats[1].id, subcategoryId: sub("Makeup").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "أحمر شفاه مات", displayOrder: 1 },
      { name: "Foundation Pro", price: "$12", categoryId: insertedCats[1].id, subcategoryId: sub("Makeup").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "فاونديشن احترافي", displayOrder: 2 },
      { name: "Eye Palette", price: "$9.50", categoryId: insertedCats[1].id, subcategoryId: sub("Makeup").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "باليت ظلال عيون", displayOrder: 3 },
      { name: "Glow Serum", price: "$15", categoryId: insertedCats[1].id, subcategoryId: sub("Skincare").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "سيروم توهج البشرة", displayOrder: 1 },
      { name: "Moisturizer Cream", price: "$11", categoryId: insertedCats[1].id, subcategoryId: sub("Skincare").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "كريم مرطب", displayOrder: 2 },
      { name: "Chrono Gold", price: "$75", categoryId: insertedCats[2].id, subcategoryId: sub("Master Copy").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة كرونو ذهبية", displayOrder: 1 },
      { name: "Silver Classic", price: "$58", categoryId: insertedCats[2].id, subcategoryId: sub("Master Copy").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة كلاسيك فضية", displayOrder: 2 },
      { name: "Black Sport", price: "$62", categoryId: insertedCats[2].id, subcategoryId: sub("Master Copy").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة رياضية سوداء", displayOrder: 3 },
      { name: "Diamond Watch", price: "$120", categoryId: insertedCats[2].id, subcategoryId: sub("Original").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة ألماسية أصلية", displayOrder: 1 },
      { name: "Luxury Gold", price: "$98", categoryId: insertedCats[2].id, subcategoryId: sub("Original").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة ذهبية فاخرة", displayOrder: 2 },
      { name: "طقم ذهبي فاخر", price: "$45", categoryId: insertedCats[3].id, subcategoryId: sub("Sets").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "طقم إكسسوارات ذهبي", displayOrder: 1 },
      { name: "طقم فضي كلاسيك", price: "$28", categoryId: insertedCats[3].id, subcategoryId: sub("Sets").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "طقم إكسسوارات فضي", displayOrder: 2 },
      { name: "خاتم ذهبي", price: "$18", categoryId: insertedCats[3].id, subcategoryId: sub("Rings").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "خاتم ذهبي أنيق", displayOrder: 1 },
      { name: "خاتم فضي", price: "$12", categoryId: insertedCats[3].id, subcategoryId: sub("Rings").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "خاتم فضي كلاسيكي", displayOrder: 2 },
      { name: "سلسلة ذهبية", price: "$25", categoryId: insertedCats[3].id, subcategoryId: sub("Chains").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "سلسلة ذهبية فاخرة", displayOrder: 1 },
      { name: "حقيبة Louis Style", price: "$35", categoryId: insertedCats[4].id, subcategoryId: sub("Women Bags").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "حقيبة نسائية فاخرة", displayOrder: 1 },
      { name: "حقيبة Gucci Style", price: "$32", categoryId: insertedCats[4].id, subcategoryId: sub("Women Bags").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "حقيبة قوتشي ستايل", displayOrder: 2 },
      { name: "محفظة رجالية", price: "$15", categoryId: insertedCats[4].id, subcategoryId: sub("Men Bags").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "محفظة جلد فاخر", displayOrder: 1 },
      { name: "كفر iPhone 15 Pro", price: "$4.50", categoryId: insertedCats[5].id, subcategoryId: sub("iPhone").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "كفر حماية آيفون", displayOrder: 1 },
      { name: "كفر iPhone 14", price: "$3.50", categoryId: insertedCats[5].id, subcategoryId: sub("iPhone").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "كفر آيفون 14", displayOrder: 2 },
      { name: "كفر Galaxy S24", price: "$4.00", categoryId: insertedCats[5].id, subcategoryId: sub("Samsung").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "كفر جالكسي", displayOrder: 1 },
    ];

    const insertedProducts = await db.insert(products).values(productsData).returning();
    console.log(`Inserted ${insertedProducts.length} products`);

    console.log("Database auto-seeded successfully!");
  } catch (error) {
    console.error("Auto-seed error:", error);
  }
}
