import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Admins Table (for simple custom dashboard auth)
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// App Settings Table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  exchangeRate: text("exchange_rate").notNull().default("15000"), // E.g. "15000" SYP for 1 USD
  currency: text("currency").notNull().default("USD"), // "USD" or "SYP"
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Setting = typeof settings.$inferSelect;


// Categories Table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(), // Arabic name
  nameEn: text("name_en").notNull(), // English name
  icon: text("icon"), // Icon identifier (optional now)
  imageUrl: text("image_url"), // Base64 or URL for the category image
  slug: text("slug").notNull().unique(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Subcategories Table
export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubcategorySchema = createInsertSchema(subcategories).omit({
  id: true,
  createdAt: true,
});
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type Subcategory = typeof subcategories.$inferSelect;



// Products Table (flavors - level 4)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  subcategoryId: integer("subcategory_id").references(() => subcategories.id),
  badge: text("badge").notNull(),
  imageUrl: text("image_url").notNull(),
  imageUrl2: text("image_url2"),
  imageUrl3: text("image_url3"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  code: varchar("code", { length: 5 }).notNull().default(sql`(floor(random() * 90000 + 10000))::text`).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products, {
  code: z.string().length(5, "كود المنتج يجب أن يتكون من 5 أرقام").regex(/^\d+$/, "كود المنتج يجب أن يحتوي على أرقام فقط"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
