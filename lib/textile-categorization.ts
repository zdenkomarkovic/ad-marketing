/**
 * Mapping of Group2 values to proper SubCategory IDs for textile products
 * This is needed because the API sets all textile products to "TX - 12" in SubCategory field,
 * but the real categorization is in the Group2 field.
 */
export const GROUP2_TO_SUBCATEGORY: Record<string, string> = {
  'TX-01': 'TX - 01', // Unisex majice
  'TX-02': 'TX - 02', // Ženske majice
  'TX-03': 'TX - 03', // Dečije majice
  'TX-04': 'TX - 04', // Polo majice
  'TX-05': 'TX - 05', // Sportska oprema
  'TX-06': 'TX - 06', // Radna oprema
  'TX-07': 'TX - 07', // Poslovna oprema (dukserici, termo odeća)
  'TX-10': 'TX - 05', // Prsluci -> Sportska oprema
  'TX-13': 'TX - 07', // Jakne -> Poslovna oprema
  'TX-16': 'TX - 07', // Košulje -> Poslovna oprema
  'TX-19': 'TX - 10', // Peškiri
  'TX-25': 'TX - 99', // Kape i dodaci -> Razno
  // Keep WW (Work Wear) products in their special category for now
  'WW-01': 'TX - 06', // Radna oprema - Prsluci
  'WW-03': 'TX - 06', // Radna oprema - Jakne
  'WW-05': 'TX - 06', // Radna oprema - Zimske jakne
  'WW-07': 'TX - 06', // Radna oprema - Pantalone
};

/**
 * Get the proper subcategory for a textile product based on its Group2 field
 */
export function getTextileSubCategory(product: {
  Category: string | { Id: string };
  SubCategory?: string | { Id: string };
  Group2?: string;
}): string | undefined {
  const categoryId = typeof product.Category === 'object' ? product.Category.Id : product.Category;

  // Only apply this mapping for textile products
  if (categoryId !== 'TX') {
    return typeof product.SubCategory === 'object' ? product.SubCategory.Id : product.SubCategory;
  }

  // For textile products, use Group2 to determine the real subcategory
  if (product.Group2 && GROUP2_TO_SUBCATEGORY[product.Group2]) {
    return GROUP2_TO_SUBCATEGORY[product.Group2];
  }

  // Fallback to original SubCategory if no mapping found
  return typeof product.SubCategory === 'object' ? product.SubCategory.Id : product.SubCategory;
}
