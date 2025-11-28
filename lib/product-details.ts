import { Product } from "./promosolution-api";

export interface ProductDetails {
  // Osnovne informacije
  code: string;
  model: string;
  color: string;
  packaging?: string;
  netWeight?: string;
  dimensions?: string;
  productType?: string;
  material?: string;
  barcode?: string;

  // Informacije o štampi
  printType?: string;
  printingTechnique?: string;

  // Logistički podaci
  boxQuantity?: number;
  boxDimensions?: string;
  boxWeight?: string;
  boxVolume?: string;
  countryOfOrigin?: string;
  customsTariff?: string;
}

/**
 * Extract all available details from a product
 */
export function extractProductDetails(product: Product): ProductDetails {
  const details: ProductDetails = {
    code: product.Id,
    model: product.Model?.Id || product.Model?.Name || "",
    color: typeof product.Color === "string" ? product.Color : product.Color?.Name || "",
  };

  // Try to get data from the product object
  // The API might return these fields with different names, so we check multiple possibilities

  // Packaging - API uses Package and PackageInfo
  if (product.Package) {
    details.packaging = product.Package;
  } else if (product.PackageInfo) {
    details.packaging = product.PackageInfo;
  } else if (product.Packaging) {
    details.packaging = product.Packaging;
  } else if (product.Model?.Packaging) {
    details.packaging = product.Model.Packaging;
  }

  // Net Weight - API uses Weight field
  if (product.Weight && product.WeightUM) {
    details.netWeight = `${product.Weight} ${product.WeightUM}`;
  } else if (product.Weight) {
    details.netWeight = `${product.Weight} kg`;
  } else if (product.NetWeight) {
    details.netWeight = `${product.NetWeight} kg`;
  } else if (product.Model?.NetWeight) {
    details.netWeight = `${product.Model.NetWeight} kg`;
  } else if (product.Model?.Weight) {
    details.netWeight = `${product.Model.Weight} kg`;
  }

  // Dimensions - Check Specifications array first, then dimensional fields
  // Look for exact "Dimenzija" first, not "Preporučena dimenzija štampe"
  if (product.Specifications) {
    const dimSpec = product.Specifications.find((s: any) =>
      s.Name && (s.Name.toLowerCase() === 'dimenzija' || s.Name.toLowerCase() === 'dimension')
    );
    if (dimSpec && dimSpec.Value) {
      details.dimensions = dimSpec.Value.trim();
    } else {
      // Fallback to any field containing dimension
      const anyDimSpec = product.Specifications.find((s: any) =>
        s.Name && (s.Name.toLowerCase().includes('dimenzija') || s.Name.toLowerCase().includes('dimension')) &&
        !s.Name.toLowerCase().includes('štampe') && !s.Name.toLowerCase().includes('print')
      );
      if (anyDimSpec && anyDimSpec.Value) {
        details.dimensions = anyDimSpec.Value.trim();
      }
    }
  }

  // If not found in Specifications, check Width/Height/Depth
  if (!details.dimensions && product.Width && product.Height && product.Depth &&
      (product.Width > 0 || product.Height > 0 || product.Depth > 0)) {
    const unit = product.DimUM || 'm';
    details.dimensions = `${product.Width} x ${product.Height} x ${product.Depth} ${unit}`;
  } else if (!details.dimensions && product.Dimensions) {
    details.dimensions = product.Dimensions;
  } else if (!details.dimensions && product.Model?.Dimensions) {
    details.dimensions = product.Model.Dimensions;
  } else if (!details.dimensions && product.Model?.Size) {
    details.dimensions = product.Model.Size;
  }

  // Product Type
  if (product.ProductType) {
    details.productType = product.ProductType;
  } else if (product.Model?.Type) {
    details.productType = product.Model.Type;
  } else if (product.SubCategory) {
    details.productType = typeof product.SubCategory === "string" ? product.SubCategory : product.SubCategory.Name;
  }

  // Material - Check Specifications first, then Stickers, then direct field
  if (product.Specifications) {
    const materialSpec = product.Specifications.find((s: any) =>
      s.Name && (s.Name.toLowerCase().includes('materijal') || s.Name.toLowerCase().includes('material'))
    );
    if (materialSpec && materialSpec.Value) {
      details.material = materialSpec.Value.trim();
    }
  }

  // If not found in Specifications, check Stickers for material-related info
  if (!details.material && product.Stickers) {
    const materialSticker = product.Stickers.find((s: any) =>
      s.Name && (s.Name.toLowerCase().includes('plastika') ||
                 s.Name.toLowerCase().includes('metal') ||
                 s.Name.toLowerCase().includes('drvo') ||
                 s.Name.toLowerCase().includes('tkanina') ||
                 s.Name.toLowerCase().includes('papir'))
    );
    if (materialSticker) {
      details.material = materialSticker.Name;
    }
  }

  // Fallback to direct fields
  if (!details.material && product.Material) {
    details.material = product.Material;
  } else if (!details.material && product.Model?.Material) {
    details.material = product.Model.Material;
  }

  // Barcode - API uses EAN field
  if (product.EAN) {
    details.barcode = product.EAN;
  } else if (product.Barcode) {
    details.barcode = product.Barcode;
  } else if (product.Model?.Barcode) {
    details.barcode = product.Model.Barcode;
  } else if (product.Model?.EAN) {
    details.barcode = product.Model.EAN;
  }

  // Print Type
  if (product.PrintType) {
    details.printType = product.PrintType;
  } else if (product.Model?.PrintType) {
    details.printType = product.Model.PrintType;
  } else if (product.Model?.RecommendedPrint) {
    details.printType = product.Model.RecommendedPrint;
  }

  // Printing Technique
  if (product.PrintingTechnique) {
    details.printingTechnique = product.PrintingTechnique;
  } else if (product.Model?.PrintingTechnique) {
    details.printingTechnique = product.Model.PrintingTechnique;
  }

  // Box Quantity
  if (product.BoxQuantity) {
    details.boxQuantity = product.BoxQuantity;
  } else if (product.Model?.BoxQuantity) {
    details.boxQuantity = product.Model.BoxQuantity;
  } else if (product.Model?.QuantityPerBox) {
    details.boxQuantity = product.Model.QuantityPerBox;
  }

  // Box Dimensions
  if (product.BoxDimensions) {
    details.boxDimensions = product.BoxDimensions;
  } else if (product.Model?.BoxDimensions) {
    details.boxDimensions = product.Model.BoxDimensions;
  } else if (product.Model?.PackageDimensions) {
    details.boxDimensions = product.Model.PackageDimensions;
  }

  // Box Weight
  if (product.BoxWeight) {
    details.boxWeight = `${product.BoxWeight} kg`;
  } else if (product.Model?.BoxWeight) {
    details.boxWeight = `${product.Model.BoxWeight} kg`;
  } else if (product.Model?.GrossWeight) {
    details.boxWeight = `${product.Model.GrossWeight} kg`;
  }

  // Box Volume
  if (product.BoxVolume) {
    details.boxVolume = `${product.BoxVolume} m³`;
  } else if (product.Model?.BoxVolume) {
    details.boxVolume = `${product.Model.BoxVolume} m³`;
  } else if (product.Model?.Volume) {
    details.boxVolume = `${product.Model.Volume} m³`;
  }

  // Country of Origin
  if (product.CountryOfOrigin) {
    details.countryOfOrigin = product.CountryOfOrigin;
  } else if (product.Model?.CountryOfOrigin) {
    details.countryOfOrigin = product.Model.CountryOfOrigin;
  } else if (product.Model?.Origin) {
    details.countryOfOrigin = product.Model.Origin;
  }

  // Customs Tariff
  if (product.CustomsTariff) {
    details.customsTariff = product.CustomsTariff;
  } else if (product.Model?.CustomsTariff) {
    details.customsTariff = product.Model.CustomsTariff;
  } else if (product.Model?.TariffCode) {
    details.customsTariff = product.Model.TariffCode;
  }

  return details;
}
