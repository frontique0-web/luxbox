import { 
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type Brand,
  type InsertBrand,
  type Product,
  type InsertProduct,
  users,
  categories,
  subcategories,
  brands,
  products
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Subcategories
  getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  
  // Brands
  getBrandsBySubcategoryId(subcategoryId: number): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductsByCategoryId(categoryId: number): Promise<Product[]>;
  getProductsBySubcategoryId(subcategoryId: number): Promise<Product[]>;
  getProductsByBrandId(brandId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.displayOrder);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Subcategories
  async getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]> {
    return await db.select().from(subcategories)
      .where(eq(subcategories.categoryId, categoryId))
      .orderBy(subcategories.displayOrder);
  }

  async createSubcategory(insertSubcategory: InsertSubcategory): Promise<Subcategory> {
    const [subcategory] = await db.insert(subcategories).values(insertSubcategory).returning();
    return subcategory;
  }

  // Brands
  async getBrandsBySubcategoryId(subcategoryId: number): Promise<Brand[]> {
    return await db.select().from(brands)
      .where(eq(brands.subcategoryId, subcategoryId))
      .orderBy(brands.displayOrder);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const [brand] = await db.insert(brands).values(insertBrand).returning();
    return brand;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.isActive, true))
      .orderBy(products.displayOrder);
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(
        eq(products.categoryId, categoryId),
        eq(products.isActive, true)
      ))
      .orderBy(products.displayOrder);
  }

  async getProductsBySubcategoryId(subcategoryId: number): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(
        eq(products.subcategoryId, subcategoryId),
        eq(products.isActive, true)
      ))
      .orderBy(products.displayOrder);
  }

  async getProductsByBrandId(brandId: number): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(
        eq(products.brandId, brandId),
        eq(products.isActive, true)
      ))
      .orderBy(products.displayOrder);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
}

export const storage = new DatabaseStorage();
