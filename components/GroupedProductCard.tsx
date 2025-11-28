"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GroupedProduct } from "@/lib/product-grouping";
import { getVariantImagesClient } from "@/lib/product-images";

interface GroupedProductCardProps {
  product: GroupedProduct;
}

export default function GroupedProductCard({ product }: GroupedProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors.length > 0 ? product.availableColors[0].id : undefined
  );
  const [selectedSize, setSelectedSize] = useState(
    product.availableSizes.length > 0 ? product.availableSizes[0].id : undefined
  );
  const [currentImage, setCurrentImage] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);

  // Find the variant that matches selected color and size
  const selectedVariant = product.variants.find((v) => {
    const colorMatch = !selectedColor || v.color?.id === selectedColor;
    const sizeMatch = !selectedSize || v.size?.id === selectedSize;
    return colorMatch && sizeMatch;
  }) || product.defaultVariant;

  // Update image when variant changes
  useEffect(() => {
    setImageLoading(true);

    // Use the image from the variant if it exists, otherwise generate URL
    const imageUrl = selectedVariant.image || getVariantImagesClient(selectedVariant.id, 1)[0];

    // Preload image before showing it
    const img = document.createElement("img");
    img.onload = () => {
      setCurrentImage(imageUrl);
      setImageLoading(false);
    };
    img.onerror = () => {
      // Even if image fails to load, set it so Next.js Image component can handle fallback
      setCurrentImage(imageUrl);
      setImageLoading(false);
    };
    img.src = imageUrl;
  }, [selectedVariant.id, selectedVariant.image]);

  // Product image
  const productImage =
    currentImage ||
    selectedVariant.image ||
    product.defaultVariant.image ||
    `https://apiv2.promosolution.services/content/ModelItem/${product.baseId}_001.jpg`;

  // Product URL - use the specific variant ID
  const productUrl = `/products/${encodeURIComponent(selectedVariant.id)}`;

  // Show price range if variants have different prices
  const showPriceRange = product.minPrice !== product.maxPrice && product.minPrice && product.maxPrice;

  // Build variant name - replace last color in product name with selected color
  const variantName = (() => {
    let name = product.name;

    // If there's a selected color, replace the color at the end of the name
    if (selectedVariant.color?.name) {
      // Split by comma to get parts
      const parts = name.split(',').map(p => p.trim());

      if (parts.length > 1) {
        // Replace the last part (which is likely a color) with the selected color
        parts[parts.length - 1] = selectedVariant.color.name.toLowerCase();
        name = parts.join(', ');
      } else {
        // No comma, just append the color
        name = `${name}, ${selectedVariant.color.name.toLowerCase()}`;
      }
    }

    return name;
  })();

  return (
    <Link href={productUrl} className="block h-full group">
      <article className="bg-card rounded-lg overflow-hidden shadow-lg border border-border hover:shadow-xl transition-shadow h-full">
        <div className="relative h-[250px] bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <Image
            src={productImage}
            alt={variantName || "Proizvod"}
            fill
            className={`object-contain p-4 group-hover:scale-105 transition-all duration-300 ${
              imageLoading ? "opacity-50" : "opacity-100"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          {product.brand && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded z-20">
              {typeof product.brand === "string" ? product.brand : product.brand.id}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-primary line-clamp-2 flex-1">
              {variantName}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            Šifra: <span className="font-medium">{selectedVariant.id}</span>
          </p>

          {/* Color selector */}
          {product.availableColors.length > 1 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Boja:</p>
              <div className="flex flex-wrap gap-1.5">
                {product.availableColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(color.id);
                    }}
                    className={`group/color relative w-7 h-7 rounded-full border-2 transition-all ${
                      selectedColor === color.id
                        ? "border-primary scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    title={color.name}
                  >
                    {color.htmlColor ? (
                      <span
                        className="absolute inset-0.5 rounded-full"
                        style={{ backgroundColor: color.htmlColor }}
                      />
                    ) : (
                      <span className="absolute inset-0.5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600">
                        {color.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.availableSizes.length > 1 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Veličina:</p>
              <div className="flex flex-wrap gap-1.5">
                {product.availableSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSize(size.id);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded border transition-all ${
                      selectedSize === size.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Single color/size display */}
          {product.availableColors.length === 1 && (
            <div className="mb-2">
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                Boja: {product.availableColors[0].name}
              </span>
            </div>
          )}

          {product.availableSizes.length === 1 && (
            <div className="mb-2">
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                Veličina: {product.availableSizes[0].name}
              </span>
            </div>
          )}

          {/* Category */}
          {product.category && (
            <div className="mb-3">
              <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded">
                {typeof product.category === "string" ? product.category : product.category.name}
              </span>
            </div>
          )}

          {/* Price */}
          {selectedVariant.price ? (
            <div className="text-xl font-bold text-primary mt-2">
              €{selectedVariant.price.toLocaleString("sr-RS", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          ) : showPriceRange ? (
            <div className="text-lg font-bold text-primary mt-2">
              €{product.minPrice?.toLocaleString("sr-RS", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              -{" "}
              €{product.maxPrice?.toLocaleString("sr-RS", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          ) : null}

          {/* Stock availability */}
          {selectedVariant.stock !== undefined && (
            <div className="mt-2">
              {selectedVariant.stock > 0 ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Na stanju: {selectedVariant.stock.toLocaleString("sr-RS")} kom
                </span>
              ) : (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Nema na stanju
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
