import type { Product } from '@/src/types/product';

const API_BASE_URL = 'http://localhost:8009';

export interface ProductsResponse {
  products: Product[];
}

/**
 * Fetch products from the backend API
 */
export async function fetchProducts(query?: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query || 'show me products',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const products = await fetchProducts(`product ${id}`);
    return products.find((p) => p.id === id) || null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Search products by category
 */
export async function searchProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    return await fetchProducts(`show ${category} products`);
  } catch (error) {
    console.error(`Error searching products in category ${category}:`, error);
    return [];
  }
}

/**
 * Search products by query
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    return await fetchProducts(query);
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    return [];
  }
}
