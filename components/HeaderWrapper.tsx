import { fetchCategories } from "@/lib/promosolution-api";
import Header from "./Header";

/**
 * HeaderWrapper - NOT USED, kept for compatibility
 * ConditionalLayout is used instead
 */
export default async function HeaderWrapper() {
  // Only fetch categories - show all
  const categories = await fetchCategories("sr-Latin-CS");

  return <Header categories={categories} />;
}
