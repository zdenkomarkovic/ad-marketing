// Test extractProductDetails function
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

// Simulate extractProductDetails function
function extractProductDetails(product) {
  const details = {
    code: product.Id,
    model: product.Model?.Id || product.Model?.Name || "",
    color: typeof product.Color === "string" ? product.Color : product.Color?.Name || "",
  };

  // Packaging
  if (product.Package) {
    details.packaging = product.Package;
  } else if (product.PackageInfo) {
    details.packaging = product.PackageInfo;
  }

  // Weight
  if (product.Weight && product.WeightUM) {
    details.netWeight = `${product.Weight} ${product.WeightUM}`;
  } else if (product.Weight) {
    details.netWeight = `${product.Weight} kg`;
  }

  // Dimensions from Specifications
  if (product.Specifications) {
    const dimSpec = product.Specifications.find(s =>
      s.Name && (s.Name.toLowerCase().includes('dimenzija') || s.Name.toLowerCase().includes('dimension'))
    );
    if (dimSpec && dimSpec.Value) {
      details.dimensions = dimSpec.Value.trim();
    }
  }

  // Material from Stickers
  if (product.Stickers) {
    const materialSticker = product.Stickers.find(s =>
      s.Name && (s.Name.toLowerCase().includes('plastika') ||
                 s.Name.toLowerCase().includes('metal') ||
                 s.Name.toLowerCase().includes('drvo'))
    );
    if (materialSticker) {
      details.material = materialSticker.Name;
    }
  }

  // Barcode
  if (product.EAN) {
    details.barcode = product.EAN;
  }

  return details;
}

async function main() {
  const token = await login();

  const productId = '1021210';

  console.log(`=== TESTING PRODUCT DETAILS EXTRACTION FOR ${productId} ===\n`);

  const product = await getProductDetails(token, productId);

  if (product) {
    const details = extractProductDetails(product);

    console.log('Extracted Details:');
    console.log('─────────────────────────────────────────');
    console.log(`Code:       ${details.code}`);
    console.log(`Model:      ${details.model}`);
    console.log(`Color:      ${details.color}`);
    console.log(`Packaging:  ${details.packaging || 'N/A'}`);
    console.log(`Weight:     ${details.netWeight || 'N/A'}`);
    console.log(`Dimensions: ${details.dimensions || 'N/A'}`);
    console.log(`Material:   ${details.material || 'N/A'}`);
    console.log(`Barcode:    ${details.barcode || 'N/A'}`);
    console.log('─────────────────────────────────────────');
  } else {
    console.log('Failed to get product details');
  }
}

main().catch(console.error);
