// Deep dive into product structure
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

async function main() {
  const token = await login();
  const [products, categories] = await Promise.all([
    fetchProducts(token),
    fetchCategories(token)
  ]);

  // Check all textile subcategories
  console.log('=== ALL TEXTILE SUBCATEGORIES ===');
  const textileSubcats = categories.filter(c => c.Parent === 'TX');
  textileSubcats.forEach(sub => {
    console.log(`${sub.Id}: ${sub.Name}`);
  });

  // Take one product and show ALL fields
  console.log('\n=== FULL STRUCTURE OF ONE TEXTILE PRODUCT ===');
  const oneTextile = products.find(p => {
    const catId = typeof p.Category === 'object' ? p.Category.Id : p.Category;
    return catId === 'TX';
  });
  console.log(JSON.stringify(oneTextile, null, 2));

  // Check if products have Category/SubCategory objects with different structure
  console.log('\n=== CHECKING CATEGORY OBJECT STRUCTURES ===');
  const productsWithObjectCategory = products.filter(p => typeof p.Category === 'object' && p.Category !== null);
  console.log(`Products with Category as object: ${productsWithObjectCategory.length}`);
  if (productsWithObjectCategory.length > 0) {
    console.log('Sample Category object:', productsWithObjectCategory[0].Category);
  }

  const productsWithObjectSubCategory = products.filter(p => typeof p.SubCategory === 'object' && p.SubCategory !== null);
  console.log(`Products with SubCategory as object: ${productsWithObjectSubCategory.length}`);
  if (productsWithObjectSubCategory.length > 0) {
    console.log('Sample SubCategory object:', productsWithObjectSubCategory[0].SubCategory);
  }

  // Check all unique subcategory values in the entire dataset
  console.log('\n=== ALL UNIQUE SUBCATEGORY VALUES ===');
  const allSubcats = new Set();
  products.forEach(p => {
    if (p.SubCategory) {
      const subCat = typeof p.SubCategory === 'object' ? p.SubCategory.Id : p.SubCategory;
      allSubcats.add(subCat);
    }
  });
  console.log('Total unique subcategories in products:', allSubcats.size);
  Array.from(allSubcats).sort().forEach(sub => {
    const count = products.filter(p => {
      const subCat = typeof p.SubCategory === 'object' ? p.SubCategory.Id : p.SubCategory;
      return subCat === sub;
    }).length;
    console.log(`${sub}: ${count} products`);
  });
}

main().catch(console.error);
