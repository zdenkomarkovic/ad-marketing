import { fetchCategories, fetchProducts } from "@/lib/promosolution-api";
import Header from "./Header";

export default async function HeaderWrapper() {
  const [categories, products] = await Promise.all([
    fetchCategories("sr-Latin-CS"),
    fetchProducts("sr-Latin-CS"),
  ]);

  // Get all category IDs that have products (both direct products and through subcategories)
  const categoriesWithProducts = new Set<string>();
  const categoryProductCount = new Map<string, number>();

  products.forEach((product) => {
    // Add main category
    if (product.Category) {
      const categoryId = typeof product.Category === "object" ? product.Category.Id : product.Category;
      categoriesWithProducts.add(categoryId);
      categoryProductCount.set(categoryId, (categoryProductCount.get(categoryId) || 0) + 1);
    }
    // Add subcategory
    if (product.SubCategory) {
      const subCategoryId = typeof product.SubCategory === "object" ? product.SubCategory.Id : product.SubCategory;
      categoriesWithProducts.add(subCategoryId);
      categoryProductCount.set(subCategoryId, (categoryProductCount.get(subCategoryId) || 0) + 1);
    }
  });

  // Also include parent categories if any of their subcategories have products
  categories.forEach((category) => {
    if (category.Parent !== "*") {
      // This is a subcategory
      if (categoriesWithProducts.has(category.Id)) {
        // If subcategory has products, make sure parent is also included
        categoriesWithProducts.add(category.Parent);
      }
    }
  });

  // Filter categories to only include those with products or with subcategories that have products
  const filteredCategories = categories.filter((cat) => {
    if (cat.Parent === "*") {
      // Parent category - check if has direct products OR any subcategory with products
      const hasDirectProducts = (categoryProductCount.get(cat.Id) || 0) > 0;
      const hasSubcategoriesWithProducts = categories.some(
        (subcat) => subcat.Parent === cat.Id && (categoryProductCount.get(subcat.Id) || 0) > 0
      );
      return hasDirectProducts || hasSubcategoriesWithProducts;
    } else {
      // Subcategory - only include if it has products
      return (categoryProductCount.get(cat.Id) || 0) > 0;
    }
  });

  // Convert Map to plain object for serialization
  const categoryProductCountObj = Object.fromEntries(categoryProductCount);

  return <Header categories={filteredCategories} categoryProductCount={categoryProductCountObj} />;
}
