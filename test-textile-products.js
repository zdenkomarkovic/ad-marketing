// Check textile product structure
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
  return await response.json();
}

async function main() {
  const token = await login();
  const products = await fetchProducts(token);

  // Find textile products
  const textileProducts = products.filter(p => {
    const catId = typeof p.Category === 'object' ? p.Category.Id : p.Category;
    return catId === 'TX';
  });

  console.log(`Total textile products: ${textileProducts.length}`);
  console.log('\n=== SAMPLE TEXTILE PRODUCTS ===');

  // Sample 10 products
  textileProducts.slice(0, 10).forEach((p, i) => {
    console.log(`\nProduct ${i + 1}: ${p.Name}`);
    console.log(`  ID: ${p.Id}`);
    console.log(`  Category:`, p.Category);
    console.log(`  SubCategory:`, p.SubCategory);
    console.log(`  Model:`, p.Model?.Name || 'N/A');
    console.log(`  Brand:`, typeof p.Brand === 'object' ? p.Brand.Id : p.Brand);
  });

  // Check if there are products with different subcategories
  console.log('\n=== SUBCATEGORY DISTRIBUTION ===');
  const subCategoryCount = new Map();
  textileProducts.forEach(p => {
    const subCat = typeof p.SubCategory === 'object' ? p.SubCategory.Id : (p.SubCategory || 'NONE');
    subCategoryCount.set(subCat, (subCategoryCount.get(subCat) || 0) + 1);
  });

  Array.from(subCategoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([subCat, count]) => {
      console.log(`${subCat}: ${count} products`);
    });

  // Check for products with "majica" or "polo" in name
  console.log('\n=== PRODUCTS WITH "MAJICA" OR "POLO" ===');
  const majicaProducts = textileProducts.filter(p =>
    p.Name.toLowerCase().includes('majica') ||
    p.Name.toLowerCase().includes('polo') ||
    p.Model?.Name?.toLowerCase().includes('majica') ||
    p.Model?.Name?.toLowerCase().includes('polo')
  );
  console.log(`Found ${majicaProducts.length} products with "majica" or "polo"`);
  majicaProducts.slice(0, 5).forEach(p => {
    console.log(`- ${p.Name} (${p.Id}) - SubCat: ${typeof p.SubCategory === 'object' ? p.SubCategory.Id : p.SubCategory}`);
  });
}

main().catch(console.error);
