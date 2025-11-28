// Test file for getBaseId function
import { getBaseId } from "./product-grouping";

// Test cases
const testCases = [
  // Format with dots
  { input: "10.182.10", expected: "10.182", description: "With dots - variant 1" },
  { input: "10.182.20", expected: "10.182", description: "With dots - variant 2" },
  { input: "10.182.30", expected: "10.182", description: "With dots - variant 3" },
  { input: "11.079.20", expected: "11.079", description: "With dots - different base" },

  // Format without dots (last 2 digits are color)
  { input: "1018210", expected: "10182", description: "Without dots - variant 1" },
  { input: "1018290", expected: "10182", description: "Without dots - variant 2" },
  { input: "1018220", expected: "10182", description: "Without dots - variant 3" },
  { input: "5001090", expected: "50010", description: "Without dots - different base" },

  // With size suffix
  { input: "5001090-XL", expected: "50010", description: "Size suffix without dots" },
  { input: "10.182.10-XL", expected: "10.182", description: "Size suffix with dots" },
  { input: "1018210-L", expected: "10182", description: "Size suffix L" },
  { input: "1018290-M", expected: "10182", description: "Size suffix M" },

  // Edge cases
  { input: "ABC123", expected: "ABC123", description: "Non-numeric - should not change" },
  { input: "123.456.789", expected: "123.456", description: "Three segments with dots" },
  { input: "12345", expected: "123", description: "5 digits - remove last 2" },
  { input: "1234", expected: "1234", description: "4 digits - too short, no change" },
];

console.log("Testing getBaseId function:\n");
console.log("=".repeat(100));

testCases.forEach(({ input, expected, description }) => {
  const result = getBaseId(input);
  const status = result === expected ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} | ${description}`);
  console.log(`       Input: "${input}" -> Expected: "${expected}" | Got: "${result}"`);
  if (result !== expected) {
    console.log(`       ⚠️  MISMATCH!`);
  }
  console.log("");
});
