// Analyze different ID formats in textile products
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
  baseId = baseId.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]XL|[0-9]+)$/i, "");

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

  const textileProducts = products.filter(p => p.Category === 'TX');

  console.log(`Total textile products: ${textileProducts.length}`);

  // Sample different ID formats
  console.log('\n=== SAMPLE TEXTILE ID FORMATS ===');
  const idFormats = new Map();

  textileProducts.slice(0, 100).forEach(p => {
    const hasSize = p.Size && p.Size !== '*';
    const hasDot = p.Id.includes('.');
    const hasDash = p.Id.includes('-');
    const length = p.Id.length;

    const format = `${hasDot ? 'DOT' : 'NO-DOT'}_${hasDash ? 'DASH' : 'NO-DASH'}_LEN${length}`;

    if (!idFormats.has(format)) {
      idFormats.set(format, []);
    }

    if (idFormats.get(format).length < 3) {
      idFormats.get(format).push({
        id: p.Id,
        name: p.Name,
        size: p.Size,
        model: p.Model,
        baseId: getBaseId(p.Id)
      });
    }
  });

  idFormats.forEach((samples, format) => {
    console.log(`\n${format}:`);
    samples.forEach(s => {
      console.log(`  ${s.id} -> base: ${s.baseId} | size: ${s.size} | model: ${s.model}`);
    });
  });

  // Group and analyze
  console.log('\n=== GROUPING STATISTICS ===');
  const grouped = new Map();
  textileProducts.forEach(p => {
    const baseId = getBaseId(p.Id);
    if (!grouped.has(baseId)) {
      grouped.set(baseId, []);
    }
    grouped.get(baseId).push(p);
  });

  const groupSizes = new Map();
  grouped.forEach((variants, baseId) => {
    const size = variants.length;
    groupSizes.set(size, (groupSizes.get(size) || 0) + 1);
  });

  console.log('\nGroup size distribution:');
  Array.from(groupSizes.entries()).sort((a, b) => a[0] - b[0]).forEach(([size, count]) => {
    console.log(`  ${size} variant${size > 1 ? 's' : ''}: ${count} groups`);
  });

  // Find products that should be grouped but aren't
  console.log('\n=== SINGLE-ITEM GROUPS (might be grouping issues) ===');
  const singleGroups = [];
  grouped.forEach((variants, baseId) => {
    if (variants.length === 1) {
      singleGroups.push(variants[0]);
    }
  });

  console.log(`Total single-item groups: ${singleGroups.length}`);
  console.log('\nSample single-item products:');
  singleGroups.slice(0, 10).forEach(p => {
    console.log(`  ${p.Id} | ${p.Name} | Model: ${p.Model || 'N/A'} | Size: ${p.Size || 'N/A'}`);
  });

  // Check ID formats with dots
  console.log('\n=== DOT FORMAT ANALYSIS ===');
  const dotProducts = textileProducts.filter(p => p.Id.includes('.'));
  console.log(`Products with dots: ${dotProducts.length}`);
  dotProducts.slice(0, 10).forEach(p => {
    console.log(`  ${p.Id} -> base: ${getBaseId(p.Id)} | ProductIdView: ${p.ProductIdView || 'N/A'}`);
  });
}

main().catch(console.error);
