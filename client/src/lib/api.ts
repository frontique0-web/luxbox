import type { Category, Subcategory, Brand, Product } from "@shared/schema";

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function fetchSubcategories(categoryId: number): Promise<Subcategory[]> {
  const response = await fetch(`/api/categories/${categoryId}/subcategories`);
  if (!response.ok) {
    throw new Error("Failed to fetch subcategories");
  }
  return response.json();
}

export async function fetchBrands(subcategoryId: number): Promise<Brand[]> {
  const response = await fetch(`/api/subcategories/${subcategoryId}/brands`);
  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }
  return response.json();
}

export async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Failed to search products");
  }
  return response.json();
}

export async function fetchProducts(categoryId?: number, subcategoryId?: number, brandId?: number): Promise<Product[]> {
  const params = new URLSearchParams();
  if (categoryId) params.append("categoryId", categoryId.toString());
  if (subcategoryId) params.append("subcategoryId", subcategoryId.toString());
  if (brandId) params.append("brandId", brandId.toString());
  
  const response = await fetch(`/api/products?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}
