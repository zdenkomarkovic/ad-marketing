// Test textile product grouping
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

function getBaseId(productId) {
  let baseId = productId;

  // Remove size suffixes
  baseId = baseId.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]+)$/i, "");

  if (baseId.includes(".")) {
    const colorCodePattern = /^(.+)\.(\d{1,3})$/;
    const colorMatch = baseId.match(colorCodePattern);
    if (colorMatch) {
      baseId = colorMatch[1];
    }
  } else {
    if (/^\d+$/.test(baseId) && baseId.length >= 5) {
      baseId = baseId.slice(0, -2);
    }
  }

  return baseId;
}

async function main() {
  const token = await login();
  const products = await fetchProducts(token);

  // Get textile products
  const textileProducts = products.filter(p => p.Category === 'TX');

  console.log(`Total textile products: ${textileProducts.length}`);

  // Sample some polo products to check grouping
  const poloProducts = textileProducts
    .filter(p => p.Name.toLowerCase().includes('polo'))
    .slice(0, 20);

  console.log('\n=== SAMPLE POLO PRODUCTS ===');
  const groupedMap = new Map();

  poloProducts.forEach(p => {
    const baseId = getBaseId(p.Id);
    if (!groupedMap.has(baseId)) {
      groupedMap.set(baseId, []);
    }
    groupedMap.get(baseId).push(p);

    console.log(`ID: ${p.Id}`);
    console.log(`  Base ID: ${baseId}`);
    console.log(`  Name: ${p.Name}`);
    console.log(`  Color: ${p.Color}`);
    console.log(`  Size: ${p.Size}`);
    console.log(`  Image: ${p.Image || 'NO IMAGE'}`);
    console.log(`  Model: ${p.Model || 'NO MODEL'}`);
    console.log('');
  });

  console.log('\n=== GROUPING ANALYSIS ===');
  console.log(`Total unique base IDs: ${groupedMap.size}`);
  groupedMap.forEach((variants, baseId) => {
    console.log(`\nBase ID: ${baseId} (${variants.length} variants)`);
    variants.forEach(v => {
      console.log(`  - ${v.Id} | Color: ${v.Color} | Size: ${v.Size || 'NO SIZE'}`);
    });
  });

  // Check a specific product's full structure
  console.log('\n=== FULL PRODUCT STRUCTURE (ONE POLO) ===');
  console.log(JSON.stringify(poloProducts[0], null, 2));
}

main().catch(console.error);
