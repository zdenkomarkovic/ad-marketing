import ProductGrid from "@/components/ProductGrid";
import CategoriesNav from "@/components/CategoriesNav";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function ProizvodiPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  return (
    <>
      <CategoriesNav />
      <div className="">
        <ProductGrid page={page} />
      </div>
    </>
  );
}
