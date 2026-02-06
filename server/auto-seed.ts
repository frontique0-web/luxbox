import { db } from "./db";
import { categories, subcategories, brands, products } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function autoSeed() {
  try {
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

    const brandsData = [
      { subcategoryId: juicesSub.id, nameAr: "جوس 120 ml 3 mg", nameEn: "Juice 120ml 3mg", displayOrder: 1 },
      { subcategoryId: juicesSub.id, nameAr: "جوس 60 ml 3 mg", nameEn: "Juice 60ml 3mg", displayOrder: 2 },
      { subcategoryId: juicesSub.id, nameAr: "جوس 60 ml 12-18 mg", nameEn: "Juice 60ml 12-18mg", displayOrder: 3 },
      { subcategoryId: juicesSub.id, nameAr: "جوس 30 ml 30-35-50 mg", nameEn: "Juice 30ml 30-50mg", displayOrder: 4 },
      { subcategoryId: cigDispSub.id, nameAr: "Freeton Alpha", nameEn: "Freeton Alpha", puffs: "25000", displayOrder: 1 },
      { subcategoryId: cigDispSub.id, nameAr: "Oxbar Icenic", nameEn: "Oxbar Icenic", puffs: "35000", displayOrder: 2 },
      { subcategoryId: cigDispSub.id, nameAr: "Vozol Star", nameEn: "Vozol Star", puffs: "40000", displayOrder: 3 },
      { subcategoryId: cigDispSub.id, nameAr: "Oxbar Fusion", nameEn: "Oxbar Fusion", puffs: "45000", displayOrder: 4 },
      { subcategoryId: cigDispSub.id, nameAr: "Oxbar Dualblend", nameEn: "Oxbar Dualblend", puffs: "50000", displayOrder: 5 },
      { subcategoryId: cigDispSub.id, nameAr: "Oxbar & Dr Vape", nameEn: "Oxbar & Dr Vape", puffs: "50000", displayOrder: 6 },
      { subcategoryId: cigDispSub.id, nameAr: "Vozol Gear Ice & Sweet", nameEn: "Vozol Gear Ice & Sweet", puffs: "50000", displayOrder: 7 },
      { subcategoryId: hookahDispSub.id, nameAr: "Vozol Gear Shisha", nameEn: "Vozol Gear Shisha", puffs: "25000", displayOrder: 1 },
      { subcategoryId: hookahDispSub.id, nameAr: "Al Fakher", nameEn: "Al Fakher", puffs: "36000", displayOrder: 2 },
      { subcategoryId: hookahDispSub.id, nameAr: "Kief King", nameEn: "Kief King", puffs: "50000", displayOrder: 3 },
    ];

    const insertedBrands = await db.insert(brands).values(brandsData).returning();
    console.log(`Inserted ${insertedBrands.length} brands`);

    const sub = (nameEn: string) => insertedSubs.find(s => s.nameEn === nameEn)!;

    const productsData = [
      { name: "Imperial Leather", price: "450,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("French Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "عطر فرنسي فاخر", displayOrder: 1 },
      { name: "Royal Oud", price: "380,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("French Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "عطر عود ملكي", displayOrder: 2 },
      { name: "Midnight Rose", price: "320,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("French Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "عطر الوردة المسائية", displayOrder: 3 },
      { name: "Golden Elixir", price: "550,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("French Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "إكسير ذهبي فاخر", displayOrder: 4 },
      { name: "Oud Al Emarat", price: "280,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("Emirati Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "عود إماراتي أصلي", displayOrder: 1 },
      { name: "Musk Amber", price: "350,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("Emirati Perfumes").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "مسك وعنبر إماراتي", displayOrder: 2 },
      { name: "Arabian Nights", price: "420,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("Emirati Perfumes").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "ليالي عربية", displayOrder: 3 },
      { name: "Sauvage Copy", price: "120,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("Copy One Perfumes").id, badge: "Copy One", imageUrl: "/assets/product-placeholder-1.png", description: "كوبي وان سوفاج", displayOrder: 1 },
      { name: "Bleu Copy", price: "110,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("Copy One Perfumes").id, badge: "Copy One", imageUrl: "/assets/product-placeholder-1.png", description: "كوبي وان بلو", displayOrder: 2 },
      { name: "Eros Copy", price: "100,000 ل.س", categoryId: insertedCats[0].id, subcategoryId: sub("Copy One Perfumes").id, badge: "Copy One", imageUrl: "/assets/product-placeholder-1.png", description: "كوبي وان إيروس", displayOrder: 3 },
      { name: "Velvet Matte Lip", price: "85,000 ل.س", categoryId: insertedCats[1].id, subcategoryId: sub("Makeup").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "أحمر شفاه مات", displayOrder: 1 },
      { name: "Foundation Pro", price: "120,000 ل.س", categoryId: insertedCats[1].id, subcategoryId: sub("Makeup").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "فاونديشن احترافي", displayOrder: 2 },
      { name: "Eye Palette", price: "95,000 ل.س", categoryId: insertedCats[1].id, subcategoryId: sub("Makeup").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "باليت ظلال عيون", displayOrder: 3 },
      { name: "Glow Serum", price: "150,000 ل.س", categoryId: insertedCats[1].id, subcategoryId: sub("Skincare").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "سيروم توهج البشرة", displayOrder: 1 },
      { name: "Moisturizer Cream", price: "110,000 ل.س", categoryId: insertedCats[1].id, subcategoryId: sub("Skincare").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "كريم مرطب", displayOrder: 2 },
      { name: "Chrono Gold", price: "750,000 ل.س", categoryId: insertedCats[2].id, subcategoryId: sub("Master Copy").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة كرونو ذهبية", displayOrder: 1 },
      { name: "Silver Classic", price: "580,000 ل.س", categoryId: insertedCats[2].id, subcategoryId: sub("Master Copy").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة كلاسيك فضية", displayOrder: 2 },
      { name: "Black Sport", price: "620,000 ل.س", categoryId: insertedCats[2].id, subcategoryId: sub("Master Copy").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة رياضية سوداء", displayOrder: 3 },
      { name: "Diamond Watch", price: "1,200,000 ل.س", categoryId: insertedCats[2].id, subcategoryId: sub("Original").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة ألماسية أصلية", displayOrder: 1 },
      { name: "Luxury Gold", price: "980,000 ل.س", categoryId: insertedCats[2].id, subcategoryId: sub("Original").id, badge: "Original", imageUrl: "/assets/product-placeholder-1.png", description: "ساعة ذهبية فاخرة", displayOrder: 2 },
      { name: "طقم ذهبي فاخر", price: "450,000 ل.س", categoryId: insertedCats[3].id, subcategoryId: sub("Sets").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "طقم إكسسوارات ذهبي", displayOrder: 1 },
      { name: "طقم فضي كلاسيك", price: "280,000 ل.س", categoryId: insertedCats[3].id, subcategoryId: sub("Sets").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "طقم إكسسوارات فضي", displayOrder: 2 },
      { name: "خاتم ذهبي", price: "180,000 ل.س", categoryId: insertedCats[3].id, subcategoryId: sub("Rings").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "خاتم ذهبي أنيق", displayOrder: 1 },
      { name: "خاتم فضي", price: "120,000 ل.س", categoryId: insertedCats[3].id, subcategoryId: sub("Rings").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "خاتم فضي كلاسيكي", displayOrder: 2 },
      { name: "سلسلة ذهبية", price: "250,000 ل.س", categoryId: insertedCats[3].id, subcategoryId: sub("Chains").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "سلسلة ذهبية فاخرة", displayOrder: 1 },
      { name: "حقيبة Louis Style", price: "350,000 ل.س", categoryId: insertedCats[4].id, subcategoryId: sub("Women Bags").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "حقيبة نسائية فاخرة", displayOrder: 1 },
      { name: "حقيبة Gucci Style", price: "320,000 ل.س", categoryId: insertedCats[4].id, subcategoryId: sub("Women Bags").id, badge: "Master Copy", imageUrl: "/assets/product-placeholder-1.png", description: "حقيبة قوتشي ستايل", displayOrder: 2 },
      { name: "محفظة رجالية", price: "150,000 ل.س", categoryId: insertedCats[4].id, subcategoryId: sub("Men Bags").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "محفظة جلد فاخر", displayOrder: 1 },
      { name: "كفر iPhone 15 Pro", price: "45,000 ل.س", categoryId: insertedCats[5].id, subcategoryId: sub("iPhone").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "كفر حماية آيفون", displayOrder: 1 },
      { name: "كفر iPhone 14", price: "35,000 ل.س", categoryId: insertedCats[5].id, subcategoryId: sub("iPhone").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "كفر آيفون 14", displayOrder: 2 },
      { name: "كفر Galaxy S24", price: "40,000 ل.س", categoryId: insertedCats[5].id, subcategoryId: sub("Samsung").id, badge: "Premium", imageUrl: "/assets/product-placeholder-1.png", description: "كفر جالكسي", displayOrder: 1 },
    ];

    const insertedProducts = await db.insert(products).values(productsData).returning();
    console.log(`Inserted ${insertedProducts.length} products`);

    console.log("Database auto-seeded successfully!");
  } catch (error) {
    console.error("Auto-seed error:", error);
  }
}
