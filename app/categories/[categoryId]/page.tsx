import { fetchProducts, fetchCategories } from "@/lib/promosolution-api";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import CategoriesNav from "@/components/CategoriesNav";

interface Props {
  params: Promise<{
    categoryId: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categoryId } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10);
  const itemsPerPage = 12;

  // Decode the category ID from URL
  const decodedCategoryId = decodeURIComponent(categoryId);

  // Fetch all products and categories
  const allProducts = await fetchProducts("sr-Latin-CS");
  const allCategories = await fetchCategories("sr-Latin-CS");

  // Find category name
  const category = allCategories.find((c) => c.Id === decodedCategoryId);
  const categoryName = category?.Name || decodedCategoryId;

  console.log("=== CATEGORY DEBUG ===");
  console.log("Category ID:", decodedCategoryId);
  console.log("Category Name:", categoryName);
  console.log("Total products:", allProducts.length);

  // Log first 3 products to see their structure
  console.log("Sample products:");
  allProducts.slice(0, 3).forEach((p, i) => {
    console.log(`Product ${i}:`, {
      id: p.Id,
      name: p.Name,
      category: p.Category,
      subCategory: p.SubCategory
    });
  });

  // Filter products by category or subcategory
  const filteredProducts = allProducts.filter((product) => {
    // Check Category field
    let categoryMatch = false;
    if (typeof product.Category === "object" && product.Category !== null) {
      categoryMatch = product.Category.Id === decodedCategoryId;
    } else if (typeof product.Category === "string") {
      categoryMatch = product.Category === decodedCategoryId;
    }

    // Check SubCategory field
    let subCategoryMatch = false;
    if (product.SubCategory) {
      if (typeof product.SubCategory === "object" && product.SubCategory !== null) {
        subCategoryMatch = product.SubCategory.Id === decodedCategoryId;
      } else if (typeof product.SubCategory === "string") {
        subCategoryMatch = product.SubCategory === decodedCategoryId;
      }
    }

    const matches = categoryMatch || subCategoryMatch;

    return matches;
  });

  console.log("Filtered products count:", filteredProducts.length);
  console.log("===================");

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <>
      <CategoriesNav />
      <div className="pt-4">
        <section className="py-10 md:py-20 bg-background">
          <div className="max-w-[80rem] mx-auto px-4 md:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-10 md:mb-16">
              {categoryName}
            </h2>

            {filteredProducts.length === 0 ? (
              <div className="text-center text-muted-foreground">
                Nema proizvoda u ovoj kategoriji.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.Id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`/categories/${encodeURIComponent(categoryId)}`}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
