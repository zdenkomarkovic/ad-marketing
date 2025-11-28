// Test to verify stock integration is working
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

async function main() {
  const token = await login();

  // Fetch ProductStock data
  const stockResponse = await fetch(`${API_BASE_URL}/sr-Latin-CS/api/ProductStock`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const stockData = await stockResponse.json();

  console.log('=== PRODUCTSTOCK API RESULTS ===\n');
  console.log(`Total stock entries: ${stockData.length}\n`);

  // Find stock entries for product 1021210 (from earlier example)
  const product1021210Stocks = stockData.filter(s => s.ProductId === '1021210');
  console.log(`Stock for product 1021210:`);
  product1021210Stocks.forEach(s => {
    console.log(`  Warehouse: ${s.Warehouse}, Qty: ${s.Qty}`);
  });

  // Show some products with actual stock (not 0)
  console.log('\n=== PRODUCTS WITH STOCK > 0 ===\n');
  const productsWithStock = stockData
    .filter(s => s.Qty > 0)
    .slice(0, 10);

  productsWithStock.forEach(s => {
    console.log(`ProductId: ${s.ProductId}, Warehouse: ${s.Warehouse}, Qty: ${s.Qty}`);
  });

  // Count how many products have stock
  const uniqueProductsWithStock = new Set(
    stockData.filter(s => s.Qty > 0).map(s => s.ProductId)
  );
  console.log(`\n${uniqueProductsWithStock.size} unique products have stock > 0`);

  // Count how many products have stock = 0
  const uniqueProductsWithNoStock = new Set(
    stockData.filter(s => s.Qty === 0).map(s => s.ProductId)
  );
  console.log(`${uniqueProductsWithNoStock.size} unique products have stock = 0`);
}

main().catch(console.error);
