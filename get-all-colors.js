// Get all unique color codes from textile products
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

  // Collect all unique color codes with examples
  const colorMap = new Map();

  textileProducts.forEach(p => {
    const color = p.Color;
    if (color && typeof color === 'string') {
      if (!colorMap.has(color)) {
        colorMap.set(color, {
          code: color,
          examples: []
        });
      }

      if (colorMap.get(color).examples.length < 2) {
        colorMap.get(color).examples.push({
          id: p.Id,
          name: p.Name
        });
      }
    }
  });

  console.log('=== ALL UNIQUE COLOR CODES IN TEXTILE PRODUCTS ===\n');
  console.log(`Total unique colors: ${colorMap.size}\n`);

  // Sort by color code
  const sorted = Array.from(colorMap.values()).sort((a, b) => a.code.localeCompare(b.code));

  sorted.forEach(({ code, examples }) => {
    console.log(`Color Code: "${code}"`);
    examples.forEach(ex => {
      console.log(`  Example: ${ex.name}`);
    });
    console.log('');
  });
}

main().catch(console.error);
