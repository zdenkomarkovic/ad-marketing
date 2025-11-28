// Test to discover available API endpoints and detailed product info
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

async function testEndpoint(token, endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/sr-Latin-CS/api/${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function getProductDetails(token, productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/sr-Latin-CS/api/Product/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  const token = await login();
  console.log('✓ Logged in successfully\n');

  // Test potential endpoints
  const endpoints = [
    'Stock',
    'Inventory',
    'Availability',
    'Warehouse',
    'Product/Stock',
    'ProductStock',
  ];

  console.log('=== TESTING POTENTIAL ENDPOINTS ===\n');
  for (const endpoint of endpoints) {
    const result = await testEndpoint(token, endpoint);
    if (result.success) {
      console.log(`✓ ${endpoint}: SUCCESS`);
      if (Array.isArray(result.data)) {
        console.log(`  Returns array with ${result.data.length} items`);
        if (result.data.length > 0) {
          console.log(`  First item keys:`, Object.keys(result.data[0]).join(', '));
          console.log(`  First item:`, JSON.stringify(result.data[0], null, 2));
        }
      } else {
        console.log(`  Returns:`, JSON.stringify(result.data, null, 2));
      }
    } else {
      console.log(`✗ ${endpoint}: ${result.status || result.error}`);
    }
    console.log('');
  }

  // Test getting single product details (might have more info than list)
  console.log('\n=== TESTING SINGLE PRODUCT DETAIL ===\n');
  const productDetail = await getProductDetails(token, '1021210');
  if (productDetail.success) {
    console.log('✓ Product detail retrieved successfully');
    console.log(JSON.stringify(productDetail.data, null, 2));
  } else {
    console.log('✗ Failed to get product detail:', productDetail.status || productDetail.error);
  }
}

main().catch(console.error);
