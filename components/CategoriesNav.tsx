import { fetchCategories } from "@/lib/promosolution-api";
import CategoriesNavClient from "./CategoriesNavClient";

export default async function CategoriesNav() {
  const categories = await fetchCategories("sr-Latin-CS");

  // Get parent categories
  const parentCategories = categories.filter((c) => c.Parent === "*");

  // Group subcategories by parent
  const categoriesWithSubs = parentCategories.map((parent) => ({
    ...parent,
    subcategories: categories.filter((c) => c.Parent === parent.Id),
  }));

  return <CategoriesNavClient categories={categoriesWithSubs} />;
}
