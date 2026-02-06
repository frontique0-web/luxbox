import { db } from "../server/db";
import { categories, subcategories, products } from "@shared/schema";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Seed Categories
    const categoriesData = [
      { nameAr: "عطورات", nameEn: "Perfumes", icon: "SprayCan", slug: "perfumes", displayOrder: 1 },
      { nameAr: "مكياج وعناية", nameEn: "Makeup & Care", icon: "Palette", slug: "makeup_care", displayOrder: 2 },
      { nameAr: "ساعات", nameEn: "Watches", icon: "Watch", slug: "watches", displayOrder: 3 },
      { nameAr: "إكسسوارات", nameEn: "Accessories", icon: "Gem", slug: "accessories", displayOrder: 4 },
      { nameAr: "شناتي", nameEn: "Bags", icon: "ShoppingBag", slug: "bags", displayOrder: 5 },
      { nameAr: "كفرات موبايل", nameEn: "Mobile Covers", icon: "Smartphone", slug: "mobile", displayOrder: 6 },
    ];

    console.log("📁 Inserting categories...");
    const insertedCategories = await db.insert(categories).values(categoriesData).returning();
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Seed Subcategories
    const subcategoriesData = [
      // Perfumes subcategories (categoryId: 1)
      { categoryId: 1, nameAr: "عطورات فرنسية أصلي", nameEn: "Original French Perfumes", displayOrder: 1 },
      { categoryId: 1, nameAr: "عطورات إماراتية", nameEn: "Emirati Perfumes", displayOrder: 2 },
      { categoryId: 1, nameAr: "عطورات كوبي وان", nameEn: "Copy One Perfumes", displayOrder: 3 },
      
      // Makeup & Care subcategories (categoryId: 2)
      { categoryId: 2, nameAr: "مكياج", nameEn: "Makeup", displayOrder: 1 },
      { categoryId: 2, nameAr: "عناية بالبشرة", nameEn: "Skincare", displayOrder: 2 },
      
      // Watches subcategories (categoryId: 3)
      { categoryId: 3, nameAr: "كوبي ماستر", nameEn: "Master Copy", displayOrder: 1 },
      { categoryId: 3, nameAr: "كوبي وان", nameEn: "Copy One", displayOrder: 2 },
      { categoryId: 3, nameAr: "أوريجنال", nameEn: "Original", displayOrder: 3 },
      
      // Accessories subcategories (categoryId: 4)
      { categoryId: 4, nameAr: "أطقم كاملة", nameEn: "Complete Sets", displayOrder: 1 },
      { categoryId: 4, nameAr: "طوق", nameEn: "Necklace", displayOrder: 2 },
      { categoryId: 4, nameAr: "حلق", nameEn: "Earrings", displayOrder: 3 },
      { categoryId: 4, nameAr: "إسورة", nameEn: "Bracelet", displayOrder: 4 },
      { categoryId: 4, nameAr: "خاتم", nameEn: "Ring", displayOrder: 5 },
      
      // Bags subcategories (categoryId: 5)
      { categoryId: 5, nameAr: "شناتي نسائية", nameEn: "Women's Bags", displayOrder: 1 },
      
      // Mobile Covers subcategories (categoryId: 6)
      { categoryId: 6, nameAr: "كفرات آيفون", nameEn: "iPhone Cases", displayOrder: 1 },
      { categoryId: 6, nameAr: "كفرات سامسونج", nameEn: "Samsung Cases", displayOrder: 2 },
    ];

    console.log("📁 Inserting subcategories...");
    const insertedSubcategories = await db.insert(subcategories).values(subcategoriesData).returning();
    console.log(`✅ Inserted ${insertedSubcategories.length} subcategories`);

    // Seed Products
    const productsData = [
      // Perfumes
      { name: "Royal Essence", price: "450 AED", categoryId: 1, subcategoryId: 1, badge: "ORIGINAL", imageUrl: "/assets/product-placeholder-1.png", description: "Premium French perfume with luxurious notes", displayOrder: 1 },
      { name: "Desert Oud", price: "200 AED", categoryId: 1, subcategoryId: 2, badge: "LOCAL", imageUrl: "/assets/product-placeholder-1.png", description: "Authentic Emirati oud fragrance", displayOrder: 2 },
      { name: "Savage Copy", price: "120 AED", categoryId: 1, subcategoryId: 3, badge: "COPY 1", imageUrl: "/assets/product-placeholder-1.png", description: "High-quality inspired fragrance", displayOrder: 3 },
      
      // Makeup & Care
      { name: "Matte Lipstick Set", price: "150 AED", categoryId: 2, subcategoryId: 4, badge: "ORIGINAL", imageUrl: "/assets/product-placeholder-1.png", description: "Long-lasting matte lipstick collection", displayOrder: 1 },
      { name: "Hydrating Serum", price: "180 AED", categoryId: 2, subcategoryId: 5, badge: "ORGANIC", imageUrl: "/assets/product-placeholder-1.png", description: "Natural hydrating serum for all skin types", displayOrder: 2 },
      
      // Watches
      { name: "Rolex Master", price: "1200 AED", categoryId: 3, subcategoryId: 6, badge: "MASTER", imageUrl: "/assets/product-placeholder-1.png", description: "Premium master copy timepiece", displayOrder: 1 },
      { name: "Casio Vintage", price: "300 AED", categoryId: 3, subcategoryId: 8, badge: "ORIGINAL", imageUrl: "/assets/product-placeholder-1.png", description: "Authentic vintage Casio watch", displayOrder: 2 },
      
      // Accessories
      { name: "Gold Plated Set", price: "350 AED", categoryId: 4, subcategoryId: 9, badge: "NEW", imageUrl: "/assets/product-placeholder-1.png", description: "Complete jewelry set with gold plating", displayOrder: 1 },
      { name: "Diamond Studs", price: "90 AED", categoryId: 4, subcategoryId: 11, badge: "ELEGANT", imageUrl: "/assets/product-placeholder-1.png", description: "Elegant cubic zirconia earrings", displayOrder: 2 },
    ];

    console.log("📁 Inserting products...");
    const insertedProducts = await db.insert(products).values(productsData).returning();
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    console.log("✨ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
