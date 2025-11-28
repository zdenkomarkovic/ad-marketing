"use client";

import { useState, useEffect } from "react";
import { GroupedProduct } from "@/lib/product-grouping";
import ProductGallery from "./ProductGallery";
import Link from "next/link";
import { getVariantImagesClient } from "@/lib/product-images";

interface ProductVariantSelectorProps {
  groupedProduct: GroupedProduct;
  currentVariantId: string;
}

export default function ProductVariantSelector({
  groupedProduct,
  currentVariantId,
}: ProductVariantSelectorProps) {
  const initialVariant =
    groupedProduct.variants.find((v) => v.id === currentVariantId) ||
    groupedProduct.defaultVariant;

  const [selectedColor, setSelectedColor] = useState(
    initialVariant.color?.id || groupedProduct.availableColors[0]?.id
  );
  const [selectedSize, setSelectedSize] = useState(
    initialVariant.size?.id || groupedProduct.availableSizes[0]?.id
  );
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Find the variant that matches selected color and size
  const selectedVariant =
    groupedProduct.variants.find((v) => {
      const colorMatch = !selectedColor || v.color?.id === selectedColor;
      const sizeMatch = !selectedSize || v.size?.id === selectedSize;
      return colorMatch && sizeMatch;
    }) || groupedProduct.defaultVariant;

  // Load images when variant changes
  useEffect(() => {
    const loadImages = async () => {
      setIsLoadingImages(true);

      // Generate image URLs for the selected variant
      const variantImages = getVariantImagesClient(selectedVariant.id, 8);

      // Check which images actually exist
      const validImages: string[] = [];

      for (const imageUrl of variantImages) {
        try {
          // Create a new image to test if it loads
          const img = document.createElement("img");
          const loadPromise = new Promise<boolean>((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imageUrl;
          });

          const loaded = await loadPromise;
          if (loaded) {
            validImages.push(imageUrl);
          } else {
            // If an image fails, stop checking (assume no more images)
            break;
          }
        } catch {
          break;
        }
      }

      // If no valid images, use the first one as fallback
      if (validImages.length === 0) {
        validImages.push(variantImages[0]);
      }

      setProductImages(validImages);
      setIsLoadingImages(false);
    };

    loadImages();
  }, [selectedVariant.id]);

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="relative">
        {isLoadingImages && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Učitavanje slika...</p>
            </div>
          </div>
        )}
        <ProductGallery images={productImages} productName={groupedProduct.name} />
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {groupedProduct.brand && (
          <div className="inline-block bg-primary text-primary-foreground text-sm px-3 py-1 rounded">
            {typeof groupedProduct.brand === "string"
              ? groupedProduct.brand
              : groupedProduct.brand.id}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          {groupedProduct.name}
        </h1>

        <div className="text-sm text-muted">
          Šifra proizvoda: <span className="font-mono font-semibold">{selectedVariant.id}</span>
        </div>

        {/* Color Selector */}
        {groupedProduct.availableColors.length > 0 && (
          <div className="border-t border-muted pt-6">
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Izaberite boju:
              {selectedColor && (
                <span className="text-base font-normal text-muted-foreground ml-2">
                  {groupedProduct.availableColors.find((c) => c.id === selectedColor)?.name}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-3">
              {groupedProduct.availableColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`group/color relative w-12 h-12 rounded-full border-3 transition-all ${
                    selectedColor === color.id
                      ? "border-primary scale-110 shadow-lg"
                      : "border-gray-300 hover:border-gray-400 hover:scale-105"
                  }`}
                  title={color.name}
                >
                  {color.htmlColor ? (
                    <span
                      className="absolute inset-1 rounded-full ring-1 ring-gray-200"
                      style={{ backgroundColor: color.htmlColor }}
                    />
                  ) : (
                    <span className="absolute inset-1 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {color.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                  {/* Tooltip */}
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        {groupedProduct.availableSizes.length > 0 && (
          <div className="border-t border-muted pt-6">
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Izaberite veličinu:
              {selectedSize && (
                <span className="text-base font-normal text-muted-foreground ml-2">
                  {groupedProduct.availableSizes.find((s) => s.id === selectedSize)?.name}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {groupedProduct.availableSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                    selectedSize === size.id
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                      : "bg-background border-border hover:border-primary hover:scale-105"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        {selectedVariant.price && (
          <div className="border-t border-muted pt-6">
            <div className="text-4xl font-bold text-primary">
              €
              {selectedVariant.price.toLocaleString("sr-RS", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="border-t border-muted pt-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Detalji proizvoda</h2>

          <div className="grid grid-cols-2 gap-4">
            {groupedProduct.category && (
              <div>
                <div className="text-sm text-muted-foreground">Kategorija</div>
                <div className="font-medium text-foreground">
                  {typeof groupedProduct.category === "string"
                    ? groupedProduct.category
                    : groupedProduct.category.name}
                </div>
              </div>
            )}

            {selectedVariant.color && (
              <div>
                <div className="text-sm text-muted-foreground">Boja</div>
                <div className="font-medium text-foreground">
                  {selectedVariant.color.name}
                </div>
              </div>
            )}

            {selectedVariant.size && (
              <div>
                <div className="text-sm text-muted-foreground">Veličina</div>
                <div className="font-medium text-foreground">
                  {selectedVariant.size.name}
                </div>
              </div>
            )}

            {selectedVariant.stock !== undefined && (
              <div>
                <div className="text-sm text-muted-foreground">Na stanju</div>
                <div className="font-medium text-foreground">
                  {selectedVariant.stock > 0 ? "Dostupno" : "Nije dostupno"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {(groupedProduct.description || groupedProduct.model?.Description) && (
          <div className="border-t border-muted pt-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">Opis</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              {groupedProduct.description && <p>{groupedProduct.description}</p>}
              {groupedProduct.model?.Description && (
                <p>{groupedProduct.model.Description}</p>
              )}
              {groupedProduct.model?.Description2 && (
                <p>{groupedProduct.model.Description2}</p>
              )}
            </div>
          </div>
        )}

        {/* All Variants */}
        <div className="border-t border-muted pt-6">
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            Sve varijante ({groupedProduct.variants.length})
          </h2>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {groupedProduct.variants.map((variant) => (
              <div
                key={variant.id}
                className={`p-3 rounded-lg border transition-colors ${
                  variant.id === selectedVariant.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-mono text-sm font-semibold text-foreground">
                      {variant.id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {variant.color && `${variant.color.name}`}
                      {variant.color && variant.size && " • "}
                      {variant.size && `Veličina: ${variant.size.name}`}
                    </div>
                  </div>
                  {variant.price && (
                    <div className="text-sm font-bold text-primary">
                      €
                      {variant.price.toLocaleString("sr-RS", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="border-t border-muted pt-6">
          <Link
            href="/kontakt"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Kontaktirajte nas za ponudu
          </Link>
        </div>
      </div>
    </div>
  );
}
