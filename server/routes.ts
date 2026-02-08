import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await storage.getAllCategories();
      res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get subcategories by category ID
  app.get("/api/categories/:categoryId/subcategories", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const subs = await storage.getSubcategoriesByCategoryId(categoryId);
      res.json(subs);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });

  // Get brands by subcategory ID
  app.get("/api/subcategories/:subcategoryId/brands", async (req, res) => {
    try {
      const subcategoryId = parseInt(req.params.subcategoryId);
      const brandsList = await storage.getBrandsBySubcategoryId(subcategoryId);
      res.json(brandsList);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  // Search products
  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length === 0) {
        res.json([]);
        return;
      }
      const results = await storage.searchProducts(query.trim());
      res.json(results);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Failed to search products" });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, subcategoryId, brandId } = req.query;
      
      let allProducts;
      if (brandId) {
        allProducts = await storage.getProductsByBrandId(parseInt(brandId as string));
      } else if (subcategoryId) {
        allProducts = await storage.getProductsBySubcategoryId(parseInt(subcategoryId as string));
      } else if (categoryId) {
        allProducts = await storage.getProductsByCategoryId(parseInt(categoryId as string));
      } else {
        allProducts = await storage.getAllProducts();
      }
      
      res.json(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  return httpServer;
}
