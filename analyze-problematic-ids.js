// Analyze problematic product IDs
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
  const textileProducts = products.filter(p => p.Category === 'TX');

  // Check combined sizes
  console.log('=== COMBINED SIZE FORMATS ===');
  const combinedSizes = textileProducts.filter(p =>
    p.Id.includes('/') ||
    (p.Size && typeof p.Size === 'string' && p.Size.includes('/'))
  );
  console.log(`Products with combined sizes: ${combinedSizes.length}`);
  combinedSizes.slice(0, 10).forEach(p => {
    console.log(`  ${p.Id} | Size: ${p.Size} | Model: ${p.Model}`);
  });

  // Check decimal sizes
  console.log('\n=== DECIMAL SIZE FORMATS ===');
  const decimalSizes = textileProducts.filter(p => p.Id.includes('.') && p.Id.match(/-\d+\.\d+$/));
  console.log(`Products with decimal sizes: ${decimalSizes.length}`);
  decimalSizes.slice(0, 10).forEach(p => {
    console.log(`  ${p.Id} | Size: ${p.Size} | Model: ${p.Model}`);
  });

  // Check products without size suffix
  console.log('\n=== PRODUCTS WITHOUT SIZE SUFFIX ===');
  const noSizeSuffix = textileProducts.filter(p =>
    !p.Id.includes('-') &&
    p.Id.length === 7
  );
  console.log(`Products without size suffix: ${noSizeSuffix.length}`);
  noSizeSuffix.slice(0, 15).forEach(p => {
    console.log(`  ${p.Id} | ${p.Name.substring(0, 50)} | Size: ${p.Size || 'NONE'} | Model: ${p.Model}`);
  });

  // Group peškiri by model
  const peskiri = noSizeSuffix.filter(p => p.Name.toLowerCase().includes('peškir'));
  console.log(`\nPeškiri: ${peskiri.length}`);

  // Check if they should be grouped by model
  const modelGroups = new Map();
  peskiri.forEach(p => {
    const model = p.Model || 'NO_MODEL';
    if (!modelGroups.has(model)) {
      modelGroups.set(model, []);
    }
    modelGroups.get(model).push(p);
  });

  console.log('\nPeškiri by model:');
  modelGroups.forEach((items, model) => {
    console.log(`  ${model}: ${items.length} items`);
    items.slice(0, 3).forEach(p => {
      console.log(`    - ${p.Id} | ${p.Name.substring(0, 60)}`);
    });
  });

  // Check products by Size field value
  console.log('\n=== UNIQUE SIZE VALUES ===');
  const sizeValues = new Map();
  textileProducts.forEach(p => {
    const size = typeof p.Size === 'string' ? p.Size : (p.Size ? 'OBJECT' : 'NONE');
    sizeValues.set(size, (sizeValues.get(size) || 0) + 1);
  });

  Array.from(sizeValues.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([size, count]) => {
      console.log(`  "${size}": ${count} products`);
    });
}

main().catch(console.error);
