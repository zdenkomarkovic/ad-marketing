import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/promosolution-api";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Extract base ID (remove size suffix like -XL, -XXL, etc.)
  // Example: "5001090-XL" -> "5001090"
  const baseId = product.Id.split('-')[0];

  // Generate product image URL using the PromoSolution API v2 pattern
  // Format: https://apiv2.promosolution.services/content/ModelItem/{BaseId}_001.jpg
  const productImage = product.Image ||
    `https://apiv2.promosolution.services/content/ModelItem/${baseId}_001.jpg`;

  // Encode the product ID for URL
  const productUrl = `/products/${encodeURIComponent(product.Id)}`;

  return (
    <Link href={productUrl} className="block h-full">
      <article className="bg-card rounded-lg overflow-hidden shadow-lg border border-border hover:shadow-xl transition-shadow h-full group">
      <div className="relative h-[250px] bg-gray-100">
        <Image
          src={productImage}
          alt={product.Name || "Proizvod"}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        {product.Brand && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            {typeof product.Brand === 'string' ? product.Brand : product.Brand.Id}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-primary line-clamp-2 flex-1">
            {product.Name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-2">
          Šifra: {product.Id}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {product.Category && (
            <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded">
              {typeof product.Category === 'string' ? product.Category : product.Category.Name}
            </span>
          )}
          {product.Color && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
              {typeof product.Color === 'string' ? product.Color : product.Color.Name}
            </span>
          )}
          {product.Size && product.Size !== "*" && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
              Veličina: {typeof product.Size === "string" ? product.Size : product.Size.Id}
            </span>
          )}
        </div>

        {product.Price && (
          <div className="text-xl font-bold text-primary mt-2">
            €{product.Price.toLocaleString("sr-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        )}

        {product.Status && (
          <div className="mt-2 text-sm">
            <span className={`inline-block px-2 py-1 rounded text-xs ${
              product.Status === "active" || product.Status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {product.Status}
            </span>
          </div>
        )}
      </div>
    </article>
    </Link>
  );
}
