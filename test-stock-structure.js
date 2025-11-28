// Test to see stock structure for products with multiple variants
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

  // Find products with base ID "10.212" (from user's example: 10.212.10, 10.212.20, etc.)
  const variants = products.filter(p =>
    p.Id.startsWith('10.212.') || p.Id.startsWith('10212')
  );

  if (variants.length === 0) {
    console.log('No products found with base ID 10.212');
    return;
  }

  console.log(`=== FOUND ${variants.length} VARIANTS FOR BASE ID 10.212 ===\n`);

  variants.forEach((v, index) => {
    console.log(`\n--- Variant ${index + 1}: ${v.Id} ---`);
    console.log(`Name: ${v.Name}`);
    console.log(`Color: ${typeof v.Color === 'object' ? v.Color.Name : v.Color}`);
    console.log(`Price: ${v.Price}€`);
    console.log(`Limit: ${v.Limit}`);

    // Check all fields that might contain stock information
    const stockRelatedFields = Object.keys(v).filter(key =>
      key.toLowerCase().includes('stock') ||
      key.toLowerCase().includes('quantity') ||
      key.toLowerCase().includes('available') ||
      key.toLowerCase().includes('zalihe') ||
      key.toLowerCase().includes('reserve')
    );

    if (stockRelatedFields.length > 0) {
      console.log(`Stock-related fields:`, stockRelatedFields.map(f => `${f}: ${v[f]}`).join(', '));
    }

    // Show all fields for first variant to see structure
    if (index === 0) {
      console.log('\n=== FULL STRUCTURE OF FIRST VARIANT ===');
      console.log(JSON.stringify(v, null, 2));
    }
  });
}

main().catch(console.error);
