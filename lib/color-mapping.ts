/**
 * Map color codes (last 2 digits of product ID) to hex colors
 */
export const COLOR_CODE_MAP: Record<string, string> = {
  // Blacks and Grays
  "10": "#000000", // Crna (Black)
  "12": "#808080", // Siva (Gray)
  "13": "#2F4F4F", // Tamno siva (Dark Gray)
  "23": "#A9A9A9", // Svetlo siva (Light Gray)

  // Blues
  "20": "#0047AB", // Plava (Blue)
  "21": "#87CEEB", // Svetlo plava (Light Blue)
  "24": "#4169E1", // Kraljevsko plava (Royal Blue)
  "25": "#000080", // Mornarsko plava (Navy Blue)

  // Reds and Pinks
  "30": "#DC143C", // Crvena (Red)
  "31": "#FFC0CB", // Roze (Pink)
  "32": "#8B0000", // Tamno crvena (Dark Red)
  "34": "#FF69B4", // Ružičasta (Hot Pink)

  // Yellows and Oranges
  "40": "#FFD700", // Žuta (Yellow)
  "41": "#FFFFE0", // Svetlo žuta (Light Yellow)
  "58": "#FFA500", // Narandžasta (Orange)
  "60": "#FF8C00", // Tamno narandžasta (Dark Orange)

  // Greens
  "50": "#228B22", // Zelena (Forest Green)
  "51": "#00FF00", // Lime zelena (Lime Green)
  "52": "#90EE90", // Svetlo zelena (Light Green)
  "54": "#006400", // Tamno zelena (Dark Green)
  "55": "#32CD32", // Limun zelena (Lime)

  // Browns and Beiges
  "70": "#8B4513", // Braon (Brown)
  "71": "#F5DEB3", // Bež (Beige)
  "72": "#D2691E", // Karamel (Caramel)

  // Whites
  "90": "#FFFFFF", // Bela (White)
  "91": "#F5F5F5", // Krem bela (Off-White)

  // Purples
  "80": "#800080", // Ljubičasta (Purple)
  "81": "#9370DB", // Srednje ljubičasta (Medium Purple)
  "82": "#4B0082", // Indigo

  // Other common colors
  "11": "#1C1C1C", // Antracit (Anthracite)
  "15": "#2C3E50", // Tamno siva (Charcoal)
  "22": "#6495ED", // Kornflower plava
  "33": "#FF4500", // Crveno narandžasta (Red-Orange)
  "35": "#DC143C", // Crimson
  "36": "#800020", // Burgundy
  "45": "#FADA5E", // Zlatna (Gold)
  "46": "#C0C0C0", // Srebrna (Silver)
  "61": "#FF6347", // Paradajz (Tomato)
  "62": "#FF7F50", // Koralna (Coral)
};

/**
 * Map API color string codes to hex colors and names
 * These are color codes like "B - PL", "B - ZL" returned directly from API
 */
export const COLOR_STRING_MAP: Record<string, { color: string; name: string }> = {
  "B - BL": { color: "#FFFFFF", name: "bela" },
  "B - BR": { color: "#8B4513", name: "braon" },
  "B - BŽ": { color: "#F5DEB3", name: "bež" },
  "B - CRN": { color: "#000000", name: "crna" },
  "B - CV": { color: "#DC143C", name: "crvena" },
  "B - LJ": { color: "#800080", name: "ljubičasta" },
  "B - OR": { color: "#FFA500", name: "narandžasta" },
  "B - PE": { color: "#A9A9A9", name: "pepeljasta" },
  "B - PK": { color: "#FFC0CB", name: "roze" },
  "B - PL": { color: "#40E0D0", name: "tirkizno plava" },
  "B - SI": { color: "#808080", name: "siva" },
  "B - SLV": { color: "#C0C0C0", name: "srebrna" },
  "B - ZL": { color: "#228B22", name: "zelena" },
  "B - ŽT": { color: "#FFD700", name: "žuta" },
};

/**
 * Map color codes to color names in Serbian
 */
export const COLOR_NAME_MAP: Record<string, string> = {
  "10": "crna",
  "11": "antracit",
  "12": "siva",
  "13": "tamno siva",
  "15": "tamno siva",
  "20": "plava",
  "21": "svetlo plava",
  "22": "kornflower plava",
  "23": "svetlo siva",
  "24": "kraljevsko plava",
  "25": "mornarsko plava",
  "30": "crvena",
  "31": "roze",
  "32": "tamno crvena",
  "33": "crveno narandžasta",
  "34": "ružičasta",
  "35": "crimson",
  "36": "burgundy",
  "40": "žuta",
  "41": "svetlo žuta",
  "45": "zlatna",
  "46": "srebrna",
  "50": "zelena",
  "51": "lime zelena",
  "52": "svetlo zelena",
  "54": "tamno zelena",
  "55": "limun zelena",
  "58": "narandžasta",
  "60": "tamno narandžasta",
  "61": "paradajz",
  "62": "koralna",
  "70": "braon",
  "71": "bež",
  "72": "karamel",
  "80": "ljubičasta",
  "81": "srednje ljubičasta",
  "82": "indigo",
  "90": "bela",
  "91": "krem bela",
};

/**
 * Extract color code from product ID
 * For IDs like "1021210" -> "10" (last 2 digits)
 * For IDs like "10.212.10" -> "10" (last 2 digits after last dot)
 */
export function getColorCodeFromId(productId: string): string | null {
  // Remove size suffixes like -XL, -S, etc.
  const cleanId = productId.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]+)$/i, "");

  if (cleanId.includes(".")) {
    // Format with dots: "10.212.10" -> "10"
    const parts = cleanId.split(".");
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart.length >= 2) {
      return lastPart.slice(-2);
    }
  } else {
    // Format without dots: "1021210" -> "10"
    if (cleanId.length >= 2) {
      return cleanId.slice(-2);
    }
  }

  return null;
}

/**
 * Get hex color for a product ID or color string
 * Accepts either product ID (e.g., "5003850") or color string (e.g., "B - PL")
 */
export function getColorForProductId(productIdOrColorString: string): string | null {
  // First check if it's a color string like "B - PL"
  if (COLOR_STRING_MAP[productIdOrColorString]) {
    return COLOR_STRING_MAP[productIdOrColorString].color;
  }

  // Otherwise try to extract color code from product ID
  const colorCode = getColorCodeFromId(productIdOrColorString);
  if (!colorCode) return null;

  return COLOR_CODE_MAP[colorCode] || null;
}

/**
 * Get color name in Serbian for a product ID or color string
 * Accepts either product ID (e.g., "5003850") or color string (e.g., "B - PL")
 */
export function getColorNameForProductId(productIdOrColorString: string): string | null {
  // First check if it's a color string like "B - PL"
  if (COLOR_STRING_MAP[productIdOrColorString]) {
    return COLOR_STRING_MAP[productIdOrColorString].name;
  }

  // Otherwise try to extract color code from product ID
  const colorCode = getColorCodeFromId(productIdOrColorString);
  if (!colorCode) return null;

  return COLOR_NAME_MAP[colorCode] || null;
}
