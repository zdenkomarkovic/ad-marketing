"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImageIndex]}
          alt={productName || "Proizvod"}
          fill
          className="object-contain p-8"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative aspect-square bg-gray-100 rounded overflow-hidden cursor-pointer transition-all ${
                selectedImageIndex === idx
                  ? "ring-2 ring-primary"
                  : "hover:ring-2 hover:ring-gray-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} - slika ${idx + 1}`}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 25vw, 12vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
