// Test to see what fields are available in product detail API
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

async function getProductDetails(token, productId) {
  const response = await fetch(`${API_BASE_URL}/sr-Latin-CS/api/Product/${productId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return await response.json();
  }
  return null;
}

async function main() {
  const token = await login();

  // Test with a known product ID
  const productId = '1021210';

  console.log(`=== TESTING PRODUCT DETAILS FOR ${productId} ===\n`);

  const product = await getProductDetails(token, productId);

  if (product) {
    console.log('Full product structure:');
    console.log(JSON.stringify(product, null, 2));

    console.log('\n=== CHECKING SPECIFIC FIELDS ===\n');

    // Pakovanje
    console.log('Package:', product.Package);
    console.log('PackageInfo:', product.PackageInfo);
    console.log('Packaging:', product.Packaging);

    // Težina
    console.log('\nWeight:', product.Weight);
    console.log('WeightUM:', product.WeightUM);
    console.log('NetWeight:', product.NetWeight);
    console.log('WeightBtto:', product.WeightBtto);

    // Dimenzije
    console.log('\nDimensions:', product.Dimensions);
    console.log('Width:', product.Width);
    console.log('Height:', product.Height);
    console.log('Depth:', product.Depth);
    console.log('DimUM:', product.DimUM);

    // Materijal
    console.log('\nMaterial:', product.Material);

    // Barkod
    console.log('\nBarcode:', product.Barcode);
    console.log('EAN:', product.EAN);
  } else {
    console.log('Failed to get product details');
  }
}

main().catch(console.error);
