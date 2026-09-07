import type { DictionaryKey } from "@/modules/catalog";

type SeedItem = { value: string; label: { en: string }; sortOrder: number };

export const dictionarySeed: Record<DictionaryKey, SeedItem[]> = {
  alloy_grade: [
    { value: "6063", label: { en: "6063" }, sortOrder: 0 },
    { value: "6061", label: { en: "6061" }, sortOrder: 1 },
    { value: "6082", label: { en: "6082" }, sortOrder: 2 },
    { value: "6351", label: { en: "6351" }, sortOrder: 3 },
    { value: "6005", label: { en: "6005" }, sortOrder: 4 },
    { value: "1050", label: { en: "1050" }, sortOrder: 5 },
    { value: "1100", label: { en: "1100" }, sortOrder: 6 },
    { value: "7075", label: { en: "7075" }, sortOrder: 7 },
    { value: "5083", label: { en: "5083" }, sortOrder: 8 },
  ],
  temper: [
    { value: "T4", label: { en: "T4" }, sortOrder: 0 },
    { value: "T5", label: { en: "T5" }, sortOrder: 1 },
    { value: "T6", label: { en: "T6" }, sortOrder: 2 },
    { value: "T66", label: { en: "T66" }, sortOrder: 3 },
    { value: "F", label: { en: "F (as fabricated)" }, sortOrder: 4 },
    { value: "O", label: { en: "O (annealed)" }, sortOrder: 5 },
  ],
  surface_finish: [
    { value: "mill", label: { en: "Mill finish" }, sortOrder: 0 },
    { value: "anodized", label: { en: "Anodized" }, sortOrder: 1 },
    { value: "powder_coated", label: { en: "Powder coated" }, sortOrder: 2 },
    { value: "brushed", label: { en: "Brushed" }, sortOrder: 3 },
    { value: "wood_grain", label: { en: "Wood-grain transfer" }, sortOrder: 4 },
  ],
  anodizing_color: [
    { value: "natural", label: { en: "Natural" }, sortOrder: 0 },
    { value: "bronze", label: { en: "Bronze" }, sortOrder: 1 },
    { value: "black", label: { en: "Black" }, sortOrder: 2 },
    { value: "champagne", label: { en: "Champagne" }, sortOrder: 3 },
    { value: "gold", label: { en: "Gold" }, sortOrder: 4 },
  ],
  ral_color: [
    { value: "RAL9016", label: { en: "RAL 9016 Traffic white" }, sortOrder: 0 },
    { value: "RAL7016", label: { en: "RAL 7016 Anthracite grey" }, sortOrder: 1 },
    { value: "RAL9005", label: { en: "RAL 9005 Jet black" }, sortOrder: 2 },
    { value: "RAL9006", label: { en: "RAL 9006 White aluminium" }, sortOrder: 3 },
    { value: "RAL5010", label: { en: "RAL 5010 Gentian blue" }, sortOrder: 4 },
  ],
  tolerance_standard: [
    { value: "IS", label: { en: "IS (Indian Standard)" }, sortOrder: 0 },
    { value: "ASTM", label: { en: "ASTM" }, sortOrder: 1 },
    { value: "EN", label: { en: "EN" }, sortOrder: 2 },
    { value: "DIN", label: { en: "DIN" }, sortOrder: 3 },
    { value: "JIS", label: { en: "JIS" }, sortOrder: 4 },
  ],
  packaging: [
    { value: "bundle", label: { en: "Bundle" }, sortOrder: 0 },
    { value: "crate", label: { en: "Wooden crate" }, sortOrder: 1 },
    { value: "pallet", label: { en: "Pallet" }, sortOrder: 2 },
    { value: "stretch_wrap", label: { en: "Stretch-wrapped bundle" }, sortOrder: 3 },
  ],
};
