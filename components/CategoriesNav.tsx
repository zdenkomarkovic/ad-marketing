import { fetchCategories, fetchProducts } from "@/lib/promosolution-api";
import CategoriesNavClient from "./CategoriesNavClient";

export default async function CategoriesNav() {
  const [categories, products] = await Promise.all([
    fetchCategories("sr-Latin-CS"),
    fetchProducts("sr-Latin-CS"),
  ]);

  // Count products per category
  const categoryProductCount = new Map<string, number>();

  products.forEach((product) => {
    // Add main category
    if (product.Category) {
      const categoryId = typeof product.Category === "object" ? product.Category.Id : product.Category;
      categoryProductCount.set(categoryId, (categoryProductCount.get(categoryId) || 0) + 1);
    }
    // Add subcategory
    if (product.SubCategory) {
      const subCategoryId = typeof product.SubCategory === "object" ? product.SubCategory.Id : product.SubCategory;
      categoryProductCount.set(subCategoryId, (categoryProductCount.get(subCategoryId) || 0) + 1);
    }
  });

  // Get parent categories and filter those with products or subcategories with products
  const parentCategories = categories.filter((c) => {
    if (c.Parent !== "*") return false;

    const hasDirectProducts = (categoryProductCount.get(c.Id) || 0) > 0;
    const hasSubcategoriesWithProducts = categories.some(
      (subcat) => subcat.Parent === c.Id && (categoryProductCount.get(subcat.Id) || 0) > 0
    );

    return hasDirectProducts || hasSubcategoriesWithProducts;
  });

  // Group subcategories by parent - only include subcategories with products
  const categoriesWithSubs = parentCategories.map((parent) => ({
    ...parent,
    subcategories: categories.filter((c) =>
      c.Parent === parent.Id && (categoryProductCount.get(c.Id) || 0) > 0
    ),
  }));

  return <CategoriesNavClient categories={categoriesWithSubs} />;
}
