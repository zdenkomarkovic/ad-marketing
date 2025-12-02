import { getCachedCategories } from "@/lib/product-cache";
import PaginatedCategoryView from "@/components/PaginatedCategoryView";

interface Props {
  params: Promise<{
    categoryId: string;
  }>;
}

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = await params;
  const decodedCategoryId = decodeURIComponent(categoryId);

  // Fetch categories to get the category name
  const allCategories = await getCachedCategories("sr-Latin-CS");
  const category = allCategories.find((c) => c.Id === decodedCategoryId);
  const categoryName = category?.Name || decodedCategoryId;

  return (
    <>
      {/* Hero Section */}
      <div className="pt-32 pb-10 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-[80rem] mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-primary">{categoryName}</span>
          </h1>
        </div>
      </div>

      {/* Client-side paginated view - loads products via API */}
      <PaginatedCategoryView categoryId={decodedCategoryId} />
    </>
  );
}
