// Test image endpoints
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

async function checkImage(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { url, status: response.status, ok: response.ok };
  } catch (error) {
    return { url, status: 'ERROR', ok: false, error: error.message };
  }
}

async function main() {
  const token = await login();

  // Test various image URL formats
  const testUrls = [
    'https://apiv2.promosolution.services/content/ModelItem/50038_001.jpg',
    'https://apiv2.promosolution.services/content/ModelItem/UNO_001.jpg',
    'https://apiv1.promosolution.services/sr-Latin-CS/api/ModelItem/50038',
    'https://apiv1.promosolution.services/sr-Latin-CS/api/ModelItem/UNO',
  ];

  console.log('=== TESTING IMAGE URLS ===');
  for (const url of testUrls) {
    const result = await checkImage(url);
    console.log(`${result.ok ? '✓' : '✗'} ${url} -> ${result.status}`);
  }

  // Try to get image from API using token
  console.log('\n=== TESTING API IMAGE ENDPOINTS WITH TOKEN ===');
  const apiTests = [
    `${API_BASE_URL}/sr-Latin-CS/api/ModelItem/50038`,
    `${API_BASE_URL}/sr-Latin-CS/api/ModelItem/UNO`,
    `${API_BASE_URL}/sr-Latin-CS/api/ProductImage/5003850-L`,
  ];

  for (const url of apiTests) {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(`\n${url}:`);
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(`\n${url}: ERROR - ${error.message}`);
    }
  }
}

main().catch(console.error);
