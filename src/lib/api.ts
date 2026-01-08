/**
 * API Integration for Sirizone Marketplace
 * Connects to your cPanel server's eCommerce API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '';

// WooCommerce API Authentication
const getAuthHeader = (): HeadersInit => {
  // Always return string values; avoid optional undefined values to satisfy HeadersInit
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (WC_CONSUMER_KEY && WC_CONSUMER_SECRET) {
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
    headers.Authorization = `Basic ${credentials}`;
  }

  return headers;
};

/**
 * Fetch all products from your server
 */
export async function getProducts(params?: {
  per_page?: number;
  page?: number;
  category?: string;
  featured?: boolean;
  on_sale?: boolean;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.on_sale) queryParams.append('on_sale', 'true');

    const response = await fetch(`${API_URL}/products?${queryParams.toString()}`, {
      headers: getAuthHeader(),
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to local data if API fails
    const Product = await import('@/data/Product.json');
    return Product.default;
  }
}

/**
 * Fetch single product by slug or ID
 */
export async function getProduct(slugOrId: string | number) {
  try {
    const endpoint = typeof slugOrId === 'number' 
      ? `${API_URL}/products/${slugOrId}`
      : `${API_URL}/products?slug=${slugOrId}`;

    const response = await fetch(endpoint, {
      headers: getAuthHeader(),
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to local data
    const Product = await import('@/data/Product.json');
    return Product.default.find((p: any) => p.slug === slugOrId || p.id === slugOrId);
  }
}

/**
 * Fetch product categories
 */
export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/products/categories`, {
      headers: getAuthHeader(),
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Create order on your server
 */
export async function createOrder(orderData: any) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string) {
  try {
    const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(query)}`, {
      headers: getAuthHeader(),
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    // Fallback to local search
    const Product = await import('@/data/Product.json');
    return Product.default.filter((p: any) => 
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  }
}
