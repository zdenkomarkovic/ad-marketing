// Test the fixed categorization
const API_BASE_URL = 'https://apiv1.promosolution.services';
const API_USERNAME = 'admarketing';
const API_PASSWORD = 'dRem-IpagI23C-hlpodAku';

async function login() {
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
  });

  const data = await response.json();
  return data.access_token;
}

async function fetchProducts(token) {
  const response = await fetch(`${API_BASE_URL}/sr-Latin-CS/api/Product`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const products = await response.json();

  // Fix textile product categorization
  const GROUP2_TO_SUBCATEGORY = {
    'TX-01': 'TX - 01', 'TX-02': 'TX - 02', 'TX-03': 'TX - 03',
    'TX-04': 'TX - 04', 'TX-05': 'TX - 05', 'TX-06': 'TX - 06',
    'TX-07': 'TX - 07', 'TX-10': 'TX - 05', 'TX-13': 'TX - 07',
    'TX-16': 'TX - 07', 'TX-19': 'TX - 10', 'TX-25': 'TX - 99',
    'WW-01': 'TX - 06', 'WW-03': 'TX - 06', 'WW-05': 'TX - 06', 'WW-07': 'TX - 06',
  };

  return products.map(product => {
    const categoryId = typeof product.Category === 'object' ? product.Category.Id : product.Category;

    if (categoryId === 'TX' && product.Group2) {
      const mappedSubCategory = GROUP2_TO_SUBCATEGORY[product.Group2];
      if (mappedSubCategory) {
        return { ...product, SubCategory: mappedSubCategory };
      }
    }

    return product;
  });
}

async function main() {
  const token = await login();
  const products = await fetchProducts(token);

  // Count products per subcategory
  const categoryProductCount = new Map();

  products.forEach((product) => {
    if (product.Category) {
      const categoryId = typeof product.Category === 'object' ? product.Category.Id : product.Category;
      categoryProductCount.set(categoryId, (categoryProductCount.get(categoryId) || 0) + 1);
    }
    if (product.SubCategory) {
      const subCategoryId = typeof product.SubCategory === 'object' ? product.SubCategory.Id : product.SubCategory;
      categoryProductCount.set(subCategoryId, (categoryProductCount.get(subCategoryId) || 0) + 1);
    }
  });

  console.log('=== TEXTILE PRODUCTS AFTER FIX ===');
  const textileSubcats = [
    'TX - 01', 'TX - 02', 'TX - 03', 'TX - 04', 'TX - 05',
    'TX - 06', 'TX - 07', 'TX - 10', 'TX - 12', 'TX - 99'
  ];

  textileSubcats.forEach(subcat => {
    const count = categoryProductCount.get(subcat) || 0;
    if (count > 0) {
      console.log(`${subcat}: ${count} products`);
    }
  });

  // Sample products from different subcategories
  console.log('\n=== SAMPLE PRODUCTS ===');
  const samples = [
    { subcat: 'TX - 04', name: 'Polo majice' },
    { subcat: 'TX - 10', name: 'Peškiri' },
    { subcat: 'TX - 01', name: 'Unisex majice' },
    { subcat: 'TX - 05', name: 'Sportska oprema' },
    { subcat: 'TX - 07', name: 'Poslovna oprema' },
  ];

  samples.forEach(({ subcat, name }) => {
    const sample = products.find(p => p.SubCategory === subcat);
    if (sample) {
      console.log(`\n${name} (${subcat}):`);
      console.log(`  ${sample.Name}`);
      console.log(`  Original Group2: ${sample.Group2}`);
    }
  });
}

main().catch(console.error);
