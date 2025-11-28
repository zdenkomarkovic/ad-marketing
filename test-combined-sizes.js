// Test combined size removal
function getIdWithoutSize(productId) {
  let id = productId;
  // Remove combined sizes first
  id = id.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]XL)\/([A-Z0-9]+)$/i, "");  // Combined letter sizes
  id = id.replace(/-\d+\/\d+$/i, "");  // Combined numeric sizes
  // Then remove single sizes
  id = id.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]XL|\d+\.\d+|\d+)$/i, "");
  return id;
}

console.log('=== TESTING COMBINED SIZE REMOVAL ===\n');

const testCases = [
  { input: '5812510-XXL/3XL', expected: '5812510' },
  { input: '5812610-XXL/3XL', expected: '5812610' },
  { input: '5812311-45/48', expected: '5812311' },
  { input: '5812311-40/44', expected: '5812311' },
  { input: '5812311-36/39', expected: '5812311' },
  { input: '5008290-XS/S', expected: '5008290' },
  { input: '5008290-M/L', expected: '5008290' },
  { input: '5008290-XL/XXL', expected: '5008290' },
  { input: '5003850-L', expected: '5003850' },
  { input: '5003830-3XL', expected: '5003830' },
  { input: '5812810-39.5', expected: '5812810' },
];

let passed = 0;
let failed = 0;

testCases.forEach(({ input, expected }) => {
  const result = getIdWithoutSize(input);
  const status = result === expected ? '✓ PASS' : '✗ FAIL';

  if (result === expected) {
    passed++;
  } else {
    failed++;
  }

  console.log(`${status}: ${input} -> ${result} (expected: ${expected})`);
});

console.log(`\n=== RESULTS ===`);
console.log(`Passed: ${passed}/${testCases.length}`);
console.log(`Failed: ${failed}/${testCases.length}`);
