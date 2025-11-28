// Quick test to debug API data
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

async function fetchCategories(token) {
  const response = await fetch(`${API_BASE_URL}/sr-Latin-CS/api/Category`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
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
  console.log('Logging in...');
  const token = await login();

  console.log('\n=== FETCHING CATEGORIES ===');
  const categories = await fetchCategories(token);
  console.log(`Total categories: ${categories.length}`);

  // Show all parent categories
  const parentCategories = categories.filter(c => c.Parent === '*');
  console.log(`\nParent categories: ${parentCategories.length}`);
  parentCategories.forEach(cat => {
    console.log(`- ${cat.Name} (${cat.Id})`);
  });

  // Show subcategories for each parent
  console.log('\n=== SUBCATEGORIES ===');
  parentCategories.forEach(parent => {
    const subs = categories.filter(c => c.Parent === parent.Id);
    if (subs.length > 0) {
      console.log(`\n${parent.Name}:`);
      subs.forEach(sub => {
        console.log(`  - ${sub.Name} (${sub.Id})`);
      });
    }
  });

  console.log('\n=== FETCHING PRODUCTS ===');
  const products = await fetchProducts(token);
  console.log(`Total products: ${products.length}`);

  // Sample first 3 products to see structure
  console.log('\n=== SAMPLE PRODUCTS ===');
  products.slice(0, 3).forEach((p, i) => {
    console.log(`\nProduct ${i + 1}: ${p.Name} (${p.Id})`);
    console.log(`  Category:`, typeof p.Category === 'object' ? p.Category : `String: ${p.Category}`);
    console.log(`  SubCategory:`, typeof p.SubCategory === 'object' ? p.SubCategory : `String: ${p.SubCategory}`);
  });

  // Count products per category
  console.log('\n=== PRODUCTS PER CATEGORY ===');
  const categoryCount = new Map();
  products.forEach(p => {
    if (p.Category) {
      const catId = typeof p.Category === 'object' ? p.Category.Id : p.Category;
      categoryCount.set(catId, (categoryCount.get(catId) || 0) + 1);
    }
    if (p.SubCategory) {
      const subId = typeof p.SubCategory === 'object' ? p.SubCategory.Id : p.SubCategory;
      categoryCount.set(subId, (categoryCount.get(subId) || 0) + 1);
    }
  });

  // Show counts
  parentCategories.forEach(parent => {
    const count = categoryCount.get(parent.Id) || 0;
    console.log(`\n${parent.Name} (${parent.Id}): ${count} products`);

    const subs = categories.filter(c => c.Parent === parent.Id);
    subs.forEach(sub => {
      const subCount = categoryCount.get(sub.Id) || 0;
      console.log(`  - ${sub.Name} (${sub.Id}): ${subCount} products`);
    });
  });
}

main().catch(console.error);
