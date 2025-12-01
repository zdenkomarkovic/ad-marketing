// PromoSolution API helper functions

const API_BASE_URL = "https://apiv1.promosolution.services";
const API_USERNAME = "admarketing";
const API_PASSWORD = "dRem-IpagI23C-hlpodAku";

// Types
export interface Product {
  LanguageId: string;
  Id: string;
  Name: string;
  Brand: { Id: string; Image: string } | string;
  Category: { Id: string; Name: string } | string;
  SubCategory?: { Id: string; Name: string } | string;
  Color:
    | { Id: string; Name: string; Image: string; HtmlColor: string }
    | string;
  Shade:
    | { Id: string; Name: string; Image: string; HtmlColor: string }
    | string;
  Size:
    | { Id: string; KidsSize: boolean; Image: string; Category: string }
    | string
    | null;
  Model?: {
    Id: string;
    Name: string;
    Image: string;
    ImageWebP?: string;
    Description?: string;
    Description2?: string;
    // Additional model fields that might be present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  Images?: Array<{
    No: number;
    Image: string;
    ImageWebP?: string;
    ImageGif?: string;
    Video?: string;
  }>;
  Price?: number;
  Image?: string;
  Description?: string;
  Limit?: number; // Stock/availability limit
  Status?: string;

  // Stock information (from ProductStock API or Product detail)
  Stocks?: Array<{ Warehouse: string; Qty: number }>;

  // Arrival information (from Product detail only)
  Arrivals?: Array<{ Arrival: string; Qty: number; Value: string }>;

  // Group fields for better categorization (especially for textile)
  Group1?: string;
  Group2?: string;
  Group3?: string;

  // Additional fields that might be in the API response
  Packaging?: string;
  Package?: string; // API field for packaging info
  PackageInfo?: string; // API field for packaging details
  NetWeight?: number;
  Weight?: number; // API field for weight
  WeightUM?: string; // API field for weight unit (kg, g, etc.)
  WeightBtto?: number; // Gross weight
  Dimensions?: string;
  Width?: number; // API field for width
  Height?: number; // API field for height
  Depth?: number; // API field for depth
  DimUM?: string; // API field for dimension unit
  WMSWidth?: number;
  WMSHeight?: number;
  WMSDepth?: number;
  WMSDimUM?: string;
  ProductType?: string;
  Material?: string;
  Barcode?: string;
  EAN?: string; // API field for barcode/EAN
  PrintType?: string;
  BoxQuantity?: number;
  BoxDimensions?: string;
  BoxWeight?: number;
  BoxVolume?: number;
  CountryOfOrigin?: string;
  OriginName?: string; // API field for country of origin
  OriginISOCode?: string;
  CustomsTariff?: string;
  CustTariff?: string; // API field for customs tariff
  CommercialPackage?: number;
  Carton?: number;
  UM?: string; // Unit of measure
  Specifications?: Array<{ Id: number; Name: string; Value: string }>; // Product specifications
  Stickers?: Array<{ Id: number; Name: string; Image: string; Sort: number }>; // Product stickers/tags
  Statuses?: Array<{ Id: number; Name: string; Image: string }>; // Product statuses

  // Catch-all for any other fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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

export interface ProductStock {
  LanguageId: string;
  ProductId: string;
  Warehouse: string;
  Qty: number;
  Created: string;
  Changed: string;
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
  formData.append("grant_type", "password");
  formData.append("username", API_USERNAME);
  formData.append("password", API_PASSWORD);

  const response = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    cache: "no-store",
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
export async function fetchProducts(
  language: string = "sr-Latin-CS"
): Promise<Product[]> {
  try {
    const token = await login();

    // Fetch products and stock data in parallel
    const [productsResponse, stockData] = await Promise.all([
      fetch(`${API_BASE_URL}/${language}/api/Product`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }),
      fetchProductStock(language),
    ]);

    if (!productsResponse.ok) {
      throw new Error(
        `Failed to fetch products: ${productsResponse.status} ${productsResponse.statusText}`
      );
    }

    const products: Product[] = await productsResponse.json();

    // Create a map of stock data by ProductId for quick lookup
    const stockMap = new Map<
      string,
      Array<{ Warehouse: string; Qty: number }>
    >();
    stockData.forEach((stock) => {
      if (!stockMap.has(stock.ProductId)) {
        stockMap.set(stock.ProductId, []);
      }
      stockMap.get(stock.ProductId)!.push({
        Warehouse: stock.Warehouse,
        Qty: stock.Qty,
      });
    });

    // Fix textile product categorization and add stock information
    const fixedProducts = products.map((product) => {
      const categoryId =
        typeof product.Category === "object"
          ? product.Category.Id
          : product.Category;

      const updatedProduct = { ...product };

      // Fix textile products - use Group2 instead of SubCategory
      if (categoryId === "TX" && product.Group2) {
        const GROUP2_TO_SUBCATEGORY: Record<string, string> = {
          "TX-01": "TX - 01",
          "TX-02": "TX - 02",
          "TX-03": "TX - 03",
          "TX-04": "TX - 04",
          "TX-05": "TX - 05",
          "TX-06": "TX - 06",
          "TX-07": "TX - 07",
          "TX-10": "TX - 05",
          "TX-13": "TX - 07",
          "TX-16": "TX - 07",
          "TX-19": "TX - 10",
          "TX-25": "TX - 99",
          "WW-01": "TX - 06",
          "WW-03": "TX - 06",
          "WW-05": "TX - 06",
          "WW-07": "TX - 06",
        };

        const mappedSubCategory = GROUP2_TO_SUBCATEGORY[product.Group2];
        if (mappedSubCategory) {
          updatedProduct.SubCategory = mappedSubCategory;
        }
      }

      // Add stock information
      const stocks = stockMap.get(product.Id);
      if (stocks && stocks.length > 0) {
        updatedProduct.Stocks = stocks;
      }

      return updatedProduct;
    });

    return fixedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 * @param productId - Product ID (e.g., "5301610-L")
 * @param language - Language code
 */
export async function fetchProduct(
  productId: string,
  language: string = "sr-Latin-CS"
): Promise<Product | null> {
  try {
    const token = await login();

    // Handle products with "/" in size (encode as %2F)
    const encodedId = productId.replace(/\//g, "%2F");
    const url = productId.includes("/")
      ? `${API_BASE_URL}/${language}/api/Product/?id=${encodedId}`
      : `${API_BASE_URL}/${language}/api/Product/${productId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `Failed to fetch product: ${response.status} ${response.statusText}`
      );
    }

    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

/**
 * Fetch product images
 * @param productId - Product ID
 * @param language - Language code
 */
export async function fetchProductImages(
  productId: string,
  language: string = "sr-Latin-CS"
): Promise<string[]> {
  try {
    const token = await login();

    const response = await fetch(
      `${API_BASE_URL}/${language}/api/ProductImage/${productId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const images: Array<{ Image: string }> = await response.json();
    return images.map((img) => img.Image);
  } catch (error) {
    console.error("Error fetching product images:", error);
    return [];
  }
}

/**
 * Fetch product stock information
 * @param language - Language code
 */
export async function fetchProductStock(
  language: string = "sr-Latin-CS"
): Promise<ProductStock[]> {
  try {
    const token = await login();

    const response = await fetch(
      `${API_BASE_URL}/${language}/api/ProductStock`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes (stock changes frequently)
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product stock: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product stock:", error);
    return [];
  }
}

/**
 * Fetch all categories
 * @param language - Language code
 */
export async function fetchCategories(
  language: string = "sr-Latin-CS"
): Promise<Category[]> {
  try {
    const token = await login();

    const response = await fetch(`${API_BASE_URL}/${language}/api/Category`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch all brands
 * @param language - Language code
 */
export async function fetchBrands(
  language: string = "sr-Latin-CS"
): Promise<Brand[]> {
  try {
    const token = await login();

    const response = await fetch(`${API_BASE_URL}/${language}/api/Brand`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}
