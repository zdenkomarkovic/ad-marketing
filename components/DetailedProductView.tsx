"use client";

import { useState, useEffect } from "react";
import { GroupedProduct } from "@/lib/product-grouping";
import { Product } from "@/lib/promosolution-api";
import { extractProductDetails } from "@/lib/product-details";
import ProductGallery from "./ProductGallery";
import Link from "next/link";
import { getVariantImagesClient } from "@/lib/product-images";
import { Package } from "lucide-react";

interface DetailedProductViewProps {
  groupedProduct: GroupedProduct;
  currentVariantId: string;
  fullProduct?: Product; // Full product data from API with all fields
}

export default function DetailedProductView({
  groupedProduct,
  currentVariantId,
  fullProduct,
}: DetailedProductViewProps) {
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
  const [currentProductDetails, setCurrentProductDetails] =
    useState(fullProduct);

  // Debug: Log available colors
  useEffect(() => {
    console.log(
      "[DetailedProductView] Available colors:",
      groupedProduct.availableColors
    );
    console.log(
      "[DetailedProductView] Available sizes:",
      groupedProduct.availableSizes
    );
    console.log(
      "[DetailedProductView] All variants:",
      groupedProduct.variants.map((v) => ({
        id: v.id,
        color: v.color,
        size: v.size,
      }))
    );
  }, [groupedProduct]);

  // Find the variant that matches selected color and size
  const selectedVariant =
    groupedProduct.variants.find((v) => {
      const colorMatch = !selectedColor || v.color?.id === selectedColor;
      const sizeMatch = !selectedSize || v.size?.id === selectedSize;
      return colorMatch && sizeMatch;
    }) || groupedProduct.defaultVariant;

  // Extract product details
  const productDetails = currentProductDetails
    ? extractProductDetails(currentProductDetails)
    : {
        code: selectedVariant.id,
        model: groupedProduct.baseId,
        color: selectedVariant.color?.name || "",
      };

  // Load product details when variant changes
  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const response = await fetch(
          `/api/product/${encodeURIComponent(selectedVariant.id)}`
        );
        if (response.ok) {
          const data = await response.json();
          setCurrentProductDetails(data);
        }
      } catch (error) {
        console.error("Failed to load product details:", error);
      }
    };

    // Only load if variant changed from initial
    if (selectedVariant.id !== currentVariantId) {
      loadProductDetails();
    }
  }, [selectedVariant.id, currentVariantId]);

  // Load images when variant changes
  useEffect(() => {
    const loadImages = async () => {
      setIsLoadingImages(true);

      const variantImages = getVariantImagesClient(selectedVariant.id, 8);
      const validImages: string[] = [];

      for (const imageUrl of variantImages) {
        try {
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
            break;
          }
        } catch {
          break;
        }
      }

      if (validImages.length === 0) {
        validImages.push(variantImages[0]);
      }

      setProductImages(validImages);
      setIsLoadingImages(false);
    };

    loadImages();
  }, [selectedVariant.id]);

  // Build dynamic product name based on selected variant
  const variantName = (() => {
    let name = groupedProduct.name;

    // If there's a selected color, replace the color at the end of the name
    if (selectedVariant.color?.name) {
      // Split by comma to get parts
      const parts = name.split(",").map((p) => p.trim());

      if (parts.length > 1) {
        // Replace the last part (which is likely a color) with the selected color
        parts[parts.length - 1] = selectedVariant.color.name.toLowerCase();
        name = parts.join(", ");
      } else {
        // No comma, just append the color
        name = `${name}, ${selectedVariant.color.name.toLowerCase()}`;
      }
    }

    return name;
  })();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {variantName}
              </h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-sm text-muted-foreground">
                Šifra:{" "}
                <span className="font-mono font-semibold text-foreground">
                  {selectedVariant.id}
                </span>
              </div>

              {groupedProduct.brand && (
                <>
                  <div className="text-sm text-muted-foreground">Brand:</div>
                  <div className="inline-block bg-primary text-primary-foreground text-sm px-3 py-1 rounded">
                    {typeof groupedProduct.brand === "string"
                      ? groupedProduct.brand
                      : groupedProduct.brand.id}
                  </div>
                </>
              )}
            </div>
          </div>
          {selectedVariant.price && (
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">
                {selectedVariant.price.toLocaleString("sr-RS", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                €
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div className="relative">
          {isLoadingImages && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Učitavanje slika...</p>
              </div>
            </div>
          )}
          <ProductGallery
            images={productImages}
            productName={groupedProduct.name}
          />
        </div>

        {/* Right: Variant Selection */}
        <div className="space-y-6">
          {/* Color Selector */}
          {groupedProduct.availableColors.length > 0 ? (
            <div className="bg-card rounded-lg p-6 shadow border border-border">
              <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                Izaberi boju ({groupedProduct.availableColors.length} dostupno)
                {selectedColor && (
                  <span className="text-base font-normal text-muted-foreground">
                    -{" "}
                    {
                      groupedProduct.availableColors.find(
                        (c) => c.id === selectedColor
                      )?.name
                    }
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap gap-3">
                {groupedProduct.availableColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`group/color relative w-16 h-16 rounded-lg border-3 transition-all ${
                      selectedColor === color.id
                        ? "border-primary scale-110 shadow-lg ring-2 ring-primary ring-offset-2"
                        : "border-gray-300 hover:border-primary/50 hover:scale-105"
                    }`}
                    title={color.name}
                  >
                    {color.htmlColor ? (
                      <span
                        className="absolute inset-1 rounded-md ring-1 ring-gray-200"
                        style={{ backgroundColor: color.htmlColor }}
                      />
                    ) : (
                      <span className="absolute inset-1 rounded-md bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                        {color.name.substring(0, 3).toUpperCase()}
                      </span>
                    )}
                    {/* Tooltip */}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Debug:</strong> Nema dostupnih boja. Total variants:{" "}
                {groupedProduct.variants.length}
              </p>
            </div>
          )}

          {/* Size Selector */}
          {groupedProduct.availableSizes.length > 0 && (
            <div className="bg-card rounded-lg p-6 shadow border border-border">
              <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                Izaberi veličinu
                {selectedSize && (
                  <span className="text-base font-normal text-muted-foreground">
                    -{" "}
                    {
                      groupedProduct.availableSizes.find(
                        (s) => s.id === selectedSize
                      )?.name
                    }
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

          {/* Stock Info */}
          {selectedVariant.stock !== undefined && (
            <div className="bg-card rounded-lg p-4 ">
              <p className=" font-semibold">
                Zalihe: {selectedVariant.stock.toLocaleString("sr-RS")}
              </p>
            </div>
          )}
          <div className="bg-card rounded-lg p-6 shadow border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Opšte informacije
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Šifra:</span>
                <span className="font-mono font-semibold text-foreground">
                  {productDetails.code}
                </span>
              </div>
              {productDetails.model && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-semibold text-foreground">
                    {productDetails.model}
                  </span>
                </div>
              )}
              {productDetails.color && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Boja:</span>
                  <span className="font-semibold text-foreground">
                    {productDetails.color}
                  </span>
                </div>
              )}
              {productDetails.packaging && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Pakovanje:</span>
                  <span className="font-semibold text-foreground">
                    {productDetails.packaging}
                  </span>
                </div>
              )}
              {productDetails.netWeight && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Neto težina:</span>
                  <span className="font-semibold text-foreground">
                    {productDetails.netWeight}
                  </span>
                </div>
              )}
              {productDetails.dimensions && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Dimenzija:</span>
                  <span className="font-semibold text-foreground">
                    {productDetails.dimensions}
                  </span>
                </div>
              )}
              {productDetails.productType && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Tip proizvoda:</span>
                  <span className="font-semibold text-foreground">
                    {productDetails.productType}
                  </span>
                </div>
              )}
              {productDetails.material && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Materijal:</span>
                  <span className="font-semibold text-foreground">
                    {productDetails.material}
                  </span>
                </div>
              )}
              {productDetails.barcode && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Barkod:</span>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {productDetails.barcode}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {(groupedProduct.description || groupedProduct.model?.Description) && (
        <div className="bg-card rounded-lg p-6 shadow border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Opis</h2>
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

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 shadow-lg text-center">
        <h3 className="text-2xl font-bold text-primary-foreground mb-4">
          Zainteresovani ste za ovaj proizvod?
        </h3>
        <p className="text-primary-foreground/90 mb-6">
          Kontaktirajte nas za ponudu i više informacija
        </p>
        <Link
          href="/kontakt"
          className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Kontaktirajte nas
        </Link>
      </div>
    </div>
  );
}
