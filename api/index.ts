import express from "express";
import { autoSeed } from "../server/auto-seed.js";
import { storage } from "../server/storage.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

let isInitialized = false;

async function initVercel() {
    if (isInitialized) return;
    try {
        await autoSeed();

        // ── Categories ──
        app.get("/api/categories", async (req, res) => {
            try {
                const allCategories = await storage.getAllCategories();
                res.json(allCategories);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch categories" });
            }
        });

        app.get("/api/admin/seed-test", async (req, res) => {
            try {
                await autoSeed();
                res.json({ success: true, message: "Seed endpoint executed successfully" });
            } catch (e: any) {
                res.status(500).json({ success: false, error: e.message, stack: e.stack });
            }
        });

        app.get("/api/categories/:categoryId/subcategories", async (req, res) => {
            try {
                const categoryId = parseInt(req.params.categoryId);
                const subs = await storage.getSubcategoriesByCategoryId(categoryId);
                res.json(subs);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch subcategories" });
            }
        });

        // ── Products ──
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
                res.status(500).json({ error: "Failed to search products" });
            }
        });

        app.get("/api/products", async (req, res) => {
            try {
                const { categoryId, subcategoryId } = req.query;
                let allProducts;
                if (subcategoryId) {
                    allProducts = await storage.getProductsBySubcategoryId(parseInt(subcategoryId as string));
                } else if (categoryId) {
                    allProducts = await storage.getProductsByCategoryId(parseInt(categoryId as string));
                } else {
                    allProducts = await storage.getAllProducts();
                }
                res.json(allProducts);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch products" });
            }
        });

        app.get("/api/products/:id", async (req, res) => {
            try {
                const product = await storage.getProductById(Number(req.params.id));
                if (!product) {
                    return res.status(404).json({ error: "Product not found" });
                }
                res.json(product);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch product" });
            }
        });

        // ── Admin Auth ──
        app.post("/api/admin/login", async (req, res) => {
            try {
                const { username, password } = req.body;
                const admin = await storage.getAdminByUsername(username?.trim());
                if (!admin || admin.password !== password?.trim()) {
                    return res.status(401).json({ error: "Invalid credentials" });
                }
                res.json({ success: true, username: admin.username, adminId: admin.id });
            } catch (error) {
                res.status(500).json({ error: "Login failed" });
            }
        });

        // ── Admin Categories ──
        app.post("/api/admin/categories", async (req, res) => {
            try {
                const category = await storage.createCategory(req.body);
                res.status(201).json(category);
            } catch (error) {
                res.status(500).json({ error: "Failed to create category" });
            }
        });

        app.patch("/api/admin/categories/:id", async (req, res) => {
            try {
                const category = await storage.updateCategory(Number(req.params.id), req.body);
                res.json(category);
            } catch (error) {
                res.status(500).json({ error: "Failed to update category" });
            }
        });

        app.delete("/api/admin/categories/:id", async (req, res) => {
            try {
                await storage.deleteCategory(Number(req.params.id));
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: "Failed to delete category" });
            }
        });

        // ── Admin Subcategories ──
        app.post("/api/admin/subcategories", async (req, res) => {
            try {
                const subcategory = await storage.createSubcategory(req.body);
                res.status(201).json(subcategory);
            } catch (error) {
                res.status(500).json({ error: "Failed to create subcategory" });
            }
        });

        app.patch("/api/admin/subcategories/:id", async (req, res) => {
            try {
                const subcategory = await storage.updateSubcategory(Number(req.params.id), req.body);
                res.json(subcategory);
            } catch (error) {
                res.status(500).json({ error: "Failed to update subcategory" });
            }
        });

        app.delete("/api/admin/subcategories/:id", async (req, res) => {
            try {
                await storage.deleteSubcategory(Number(req.params.id));
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: "Failed to delete subcategory" });
            }
        });

        // ── Admin Products ──
        app.get("/api/admin/products", async (req, res) => {
            try {
                const allProducts = await storage.adminGetProducts();
                res.json(allProducts);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch products" });
            }
        });

        app.post("/api/admin/products", async (req, res) => {
            try {
                const product = await storage.createProduct(req.body);
                res.status(201).json(product);
            } catch (error: any) {
                if (error.code === '23505' || error.message?.includes('unique')) {
                    return res.status(400).json({ message: "كود المنتج مستخدم بالفعل" });
                }
                res.status(500).json({ error: "Failed to create product" });
            }
        });

        app.patch("/api/admin/products/:id", async (req, res) => {
            try {
                const product = await storage.adminUpdateProduct(Number(req.params.id), req.body);
                res.json(product);
            } catch (error: any) {
                if (error.code === '23505' || error.message?.includes('unique')) {
                    return res.status(400).json({ message: "كود المنتج مستخدم بالفعل" });
                }
                res.status(500).json({ error: "Failed to update product" });
            }
        });

        app.delete("/api/admin/products/:id", async (req, res) => {
            try {
                await storage.adminDeleteProduct(Number(req.params.id));
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: "Failed to delete product" });
            }
        });

        app.patch("/api/admin/products/:id/status", async (req, res) => {
            try {
                const { isActive } = req.body;
                const updatedProduct = await storage.adminUpdateProductStatus(Number(req.params.id), isActive);
                res.json(updatedProduct);
            } catch (error) {
                res.status(500).json({ error: "Failed to update product status" });
            }
        });

        // ── Admin Stats ──
        app.get("/api/admin/stats", async (req, res) => {
            try {
                const stats = await storage.getDashboardStats();
                res.json(stats);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch stats" });
            }
        });

        // ── Settings ──
        app.get("/api/settings", async (req, res) => {
            try {
                const settings = await storage.getSettings();
                res.json(settings);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch settings" });
            }
        });

        app.post("/api/admin/settings", async (req, res) => {
            try {
                const { exchangeRate, currency } = req.body;
                const currentSettings = await storage.getSettings();
                const newSettings = await storage.updateSettings(currentSettings.id, { exchangeRate, currency });
                res.json(newSettings);
            } catch (error) {
                res.status(500).json({ error: "Failed to update settings" });
            }
        });

        // ── Hero Sliders ──
        app.get("/api/hero-sliders", async (req, res) => {
            try {
                const sliders = await storage.getHeroSliders();
                res.json(sliders);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch hero sliders" });
            }
        });

        app.get("/api/admin/hero-sliders", async (req, res) => {
            try {
                const sliders = await storage.adminGetHeroSliders();
                res.json(sliders);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch admin hero sliders" });
            }
        });

        app.post("/api/admin/hero-sliders", async (req, res) => {
            try {
                const slider = await storage.createHeroSlider(req.body);
                res.status(201).json(slider);
            } catch (error) {
                console.error("Failed to create hero slider:", error);
                res.status(500).json({ error: "Failed to create hero slider" });
            }
        });

        app.patch("/api/admin/hero-sliders/:id", async (req, res) => {
            try {
                const slider = await storage.updateHeroSlider(Number(req.params.id), req.body);
                res.json(slider);
            } catch (error) {
                res.status(500).json({ error: "Failed to update hero slider" });
            }
        });

        app.delete("/api/admin/hero-sliders/:id", async (req, res) => {
            try {
                await storage.deleteHeroSlider(Number(req.params.id));
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: "Failed to delete hero slider" });
            }
        });

        isInitialized = true;
        console.log("✅ Vercel API initialized successfully");
    } catch (error) {
        console.error("Vercel initialization failed:", error);
        throw error;
    }
}

export default async function handler(req: any, res: any) {
    if (!process.env.DATABASE_URL) {
        return res.status(500).json({
            error: "CRITICAL: DATABASE_URL is missing from Vercel Environment Variables.",
            help: "Go to Vercel -> Settings -> Environment Variables -> Add DATABASE_URL"
        });
    }

    try {
        await initVercel();
        return app(req, res);
    } catch (error: any) {
        console.error('Vercel API error:', error);
        res.status(500).json({
            error: 'Vercel Initialization Error',
            message: error.message || String(error),
        });
    }
}
