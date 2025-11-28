/**
 * Generate image URLs for a product variant
 * PromoSolution stores images in format: ModelItem/{ProductId}_001.jpg, _002.jpg, etc.
 * Note: Images are stored WITHOUT size suffix (e.g., 5003850_001.jpg not 5003850-L_001.jpg)
 */
export function generateVariantImageUrls(variantId: string, maxImages: number = 5): string[] {
  const baseUrl = "https://apiv2.promosolution.services/content/ModelItem";
  const images: string[] = [];

  // Remove size suffix from variant ID for image URL
  // Examples: "5003850-L" -> "5003850", "5008290-XS/S" -> "5008290", "5812810-39.5" -> "5812810"
  // "5812510-XXL/3XL" -> "5812510", "5812311-45/48" -> "5812311"
  let idWithoutSize = variantId;
  // Remove combined sizes first (must come before single sizes!)
  idWithoutSize = idWithoutSize.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]XL)\/([A-Z0-9]+)$/i, "");  // Combined letter sizes
  idWithoutSize = idWithoutSize.replace(/-\d+\/\d+$/i, "");  // Combined numeric sizes
  // Then remove single sizes
  idWithoutSize = idWithoutSize.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]XL|\d+\.\d+|\d+)$/i, "");

  for (let i = 1; i <= maxImages; i++) {
    const imageNumber = i.toString().padStart(3, "0");
    images.push(`${baseUrl}/${idWithoutSize}_${imageNumber}.jpg`);
  }

  return images;
}

/**
 * Check if an image exists by attempting to load it
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Load available images for a product variant
 * Returns array of valid image URLs
 */
export async function loadVariantImages(variantId: string, maxImages: number = 5): Promise<string[]> {
  const potentialImages = generateVariantImageUrls(variantId, maxImages);
  const validImages: string[] = [];

  // Check which images actually exist
  for (const imageUrl of potentialImages) {
    const exists = await checkImageExists(imageUrl);
    if (exists) {
      validImages.push(imageUrl);
    } else {
      // If we hit a missing image, assume no more images exist
      break;
    }
  }

  // If no images found, return at least the first one (it will show as broken or placeholder)
  if (validImages.length === 0) {
    validImages.push(potentialImages[0]);
  }

  return validImages;
}

/**
 * Client-side function to load images (doesn't wait for all checks)
 * Returns all potential URLs and lets the browser handle broken images
 */
export function getVariantImagesClient(variantId: string, count: number = 5): string[] {
  return generateVariantImageUrls(variantId, count);
}
