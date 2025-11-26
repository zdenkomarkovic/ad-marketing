// PromoSolution API helper functions

const API_BASE_URL = 'https://apiv1.promosolution.services';
const API_USERNAME = 'admarketing';
const API_PASSWORD = 'dRem-IpagI23C-hlpodAku';

// Types
export interface Product {
  LanguageId: string;
  Id: string;
  Name: string;
  Brand: { Id: string; Image: string } | string;
  Category: { Id: string; Name: string } | string;
  SubCategory?: { Id: string; Name: string } | string;
  Color: { Id: string; Name: string; Image: string; HtmlColor: string } | string;
  Shade: { Id: string; Name: string; Image: string; HtmlColor: string } | string;
  Size: { Id: string; KidsSize: boolean; Image: string; Category: string } | string | null;
  Model?: { Id: string; Name: string; Image: string; ImageWebP?: string; Description?: string; Description2?: string };
  Images?: Array<{ No: number; Image: string; ImageWebP?: string; ImageGif?: string; Video?: string }>;
  Price?: number;
  Image?: string;
  Description?: string;
  Stock?: number;
  Status?: string;
}

export interface Category {
  Id: string;
  Name: string;
  Parent: string;
  Image?: string;
}

export interface Brand {
  Id: string;
  Name: string;
  Image?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Cache for access token
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Login to PromoSolution API and get access token
 */
async function login(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', API_USERNAME);
  formData.append('password', API_PASSWORD);

  const response = await fetch(`${API_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }

  const data: LoginResponse = await response.json();

  // Cache the token (expire 5 minutes before actual expiry for safety)
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  return data.access_token;
}

/**
 * Fetch all products from PromoSolution API
 * @param language - Language code (sr-Latin-CS, en-US, de-DE, mk-MK)
 */
export async function fetchProducts(language: string = 'sr-Latin-CS'): Promise<Product[]> {
  try {
    const token = await login();

    const response = await fetch(`${API_BASE_URL}/${language}/api/Product`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const products: Product[] = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 * @param productId - Product ID (e.g., "5301610-L")
 * @param language - Language code
 */
export async function fetchProduct(productId: string, language: string = 'sr-Latin-CS'): Promise<Product | null> {
  try {
    const token = await login();

    // Handle products with "/" in size (encode as %2F)
    const encodedId = productId.replace(/\//g, '%2F');
    const url = productId.includes('/')
      ? `${API_BASE_URL}/${language}/api/Product/?id=${encodedId}`
      : `${API_BASE_URL}/${language}/api/Product/${productId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }

    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Fetch product images
 * @param productId - Product ID
 * @param language - Language code
 */
export async function fetchProductImages(productId: string, language: string = 'sr-Latin-CS'): Promise<string[]> {
  try {
    const token = await login();

    const response = await fetch(`${API_BASE_URL}/${language}/api/ProductImage/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const images: Array<{ Image: string }> = await response.json();
    return images.map(img => img.Image);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
}

/**
 * Fetch all categories
 * @param language - Language code
 */
export async function fetchCategories(language: string = 'sr-Latin-CS'): Promise<Category[]> {
  try {
    const token = await login();

    const response = await fetch(`${API_BASE_URL}/${language}/api/Category`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch all brands
 * @param language - Language code
 */
export async function fetchBrands(language: string = 'sr-Latin-CS'): Promise<Brand[]> {
  try {
    const token = await login();

    const response = await fetch(`${API_BASE_URL}/${language}/api/Brand`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}
