import {
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type Product,
  type InsertProduct,
  type Admin,
  type InsertAdmin,
  type Setting,
  type InsertSettings,
  users,
  categories,
  subcategories,
  products,
  admins,
  settings
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and, or, ilike, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Subcategories
  getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  updateSubcategory(id: number, subcategory: Partial<InsertSubcategory>): Promise<Subcategory>;
  deleteSubcategory(id: number): Promise<void>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategoryId(categoryId: number): Promise<Product[]>;
  getProductsBySubcategoryId(subcategoryId: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Admin Products
  adminGetProducts(): Promise<Product[]>;
  adminUpdateProductStatus(id: number, isActive: boolean): Promise<Product>;
  adminUpdateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product>;
  adminDeleteProduct(id: number): Promise<void>;

  // Admins
  getAdminByUsername(username: string): Promise<Admin | undefined>;

  // Settings
  getSettings(): Promise<Setting>;
  updateSettings(id: number, settings: Partial<InsertSettings>): Promise<Setting>;

  // Stats
  getDashboardStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    totalCategories: number;
  }>;
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

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category> {
    const [category] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    if (!category) throw new Error("Category not found");
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
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

  async updateSubcategory(id: number, updateData: Partial<InsertSubcategory>): Promise<Subcategory> {
    const [subcategory] = await db
      .update(subcategories)
      .set(updateData)
      .where(eq(subcategories.id, id))
      .returning();
    if (!subcategory) throw new Error("Subcategory not found");
    return subcategory;
  }

  async deleteSubcategory(id: number): Promise<void> {
    await db.delete(subcategories).where(eq(subcategories.id, id));
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.isActive, true))
      .orderBy(products.displayOrder);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products)
      .where(eq(products.id, id));
    return product;
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

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = `%${query}%`;
    return await db.select().from(products)
      .where(and(
        eq(products.isActive, true),
        or(
          ilike(products.name, searchTerm),
          ilike(products.description, searchTerm),
          ilike(products.code, searchTerm)
        )
      ))
      .orderBy(products.displayOrder);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // Admin APIs
  async adminGetProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.displayOrder);
  }

  async adminUpdateProductStatus(id: number, isActive: boolean): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ isActive })
      .where(eq(products.id, id))
      .returning();
    if (!product) throw new Error("Product not found");
    return product;
  }

  async adminUpdateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    if (!product) throw new Error("Product not found");
    return product;
  }

  async adminDeleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Admins
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }

  // Settings
  async getSettings(): Promise<Setting> {
    let [setting] = await db.select().from(settings).limit(1);
    if (!setting) {
      // Create default settings if none exist
      [setting] = await db.insert(settings).values({}).returning();
    }
    return setting;
  }

  async updateSettings(id: number, updateData: Partial<InsertSettings>): Promise<Setting> {
    const [setting] = await db.update(settings)
      .set(updateData)
      .where(eq(settings.id, id))
      .returning();
    return setting;
  }

  // Stats
  async getDashboardStats() {
    const [totalProds] = await db.select({ value: count() }).from(products);
    const [activeProds] = await db.select({ value: count() }).from(products).where(eq(products.isActive, true));
    const [inactiveProds] = await db.select({ value: count() }).from(products).where(eq(products.isActive, false));
    const [totalCats] = await db.select({ value: count() }).from(categories);

    return {
      totalProducts: totalProds.value,
      activeProducts: activeProds.value,
      inactiveProducts: inactiveProds.value,
      totalCategories: totalCats.value,
    };
  }
}

export const storage = new DatabaseStorage();
