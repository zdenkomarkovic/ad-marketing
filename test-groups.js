// Check Group fields
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

  // Get textile products
  const textileProducts = products.filter(p => p.Category === 'TX');

  console.log('=== TEXTILE GROUP2 VALUES ===');
  const group2Map = new Map();
  textileProducts.forEach(p => {
    if (p.Group2) {
      group2Map.set(p.Group2, (group2Map.get(p.Group2) || 0) + 1);
    }
  });

  Array.from(group2Map.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([group, count]) => {
      console.log(`${group}: ${count} products`);
    });

  console.log('\n=== TEXTILE GROUP3 VALUES (top 30) ===');
  const group3Map = new Map();
  textileProducts.forEach(p => {
    if (p.Group3) {
      group3Map.set(p.Group3, (group3Map.get(p.Group3) || 0) + 1);
    }
  });

  Array.from(group3Map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([group, count]) => {
      console.log(`${group}: ${count} products`);
    });

  // Sample products with different Group2 values
  console.log('\n=== SAMPLE PRODUCTS BY GROUP2 ===');
  const sampleGroups = Array.from(group2Map.keys()).slice(0, 10);
  sampleGroups.forEach(groupValue => {
    const sample = textileProducts.find(p => p.Group2 === groupValue);
    console.log(`\nGroup2: ${groupValue}`);
    console.log(`  Sample: ${sample.Name}`);
    console.log(`  SubCategory: ${sample.SubCategory}`);
    console.log(`  Group3: ${sample.Group3}`);
  });

  // Check if there are products with "polo" in name and what Group2/Group3 they have
  console.log('\n=== POLO PRODUCTS GROUP ANALYSIS ===');
  const poloProducts = textileProducts.filter(p => p.Name.toLowerCase().includes('polo'));
  console.log(`Total polo products: ${poloProducts.length}`);

  const poloGroup2 = new Map();
  poloProducts.forEach(p => {
    if (p.Group2) {
      poloGroup2.set(p.Group2, (poloGroup2.get(p.Group2) || 0) + 1);
    }
  });

  console.log('Polo products by Group2:');
  Array.from(poloGroup2.entries()).forEach(([group, count]) => {
    console.log(`  ${group}: ${count} products`);
  });

  // Check if there are products with "peškir" in name
  console.log('\n=== PEŠKIR PRODUCTS GROUP ANALYSIS ===');
  const peskirProducts = textileProducts.filter(p =>
    p.Name.toLowerCase().includes('peškir') ||
    p.Name.toLowerCase().includes('peskir')
  );
  console.log(`Total peškir products: ${peskirProducts.length}`);

  const peskirGroup2 = new Map();
  peskirProducts.forEach(p => {
    if (p.Group2) {
      peskirGroup2.set(p.Group2, (peskirGroup2.get(p.Group2) || 0) + 1);
    }
  });

  console.log('Peškir products by Group2:');
  Array.from(peskirGroup2.entries()).forEach(([group, count]) => {
    console.log(`  ${group}: ${count} products`);
  });
}

main().catch(console.error);
