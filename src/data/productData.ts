import { ProductSpec, IngredientFeature, CircularBadge, StatItem } from '../types';

export const BRAND_NAME = "NÉCTAR";
export const BRAND_TAGLINE = "Artisanal Fruit Confection";
export const BRAND_VERSION = "JAR_CORE_OS // V1.0.4";
export const BRAND_SPEC = "SPEC_APOTHECARY // 450G";

export const PRODUCT_SPEC: ProductSpec = {
  headline: "Pure Fruit Nectar From Sunlit Orchards",
  subheading: "Real Fruit Pulp // Zero Artificial Glaze",
  description: "Formulated without compromise. Hand-selected Alphonso mango, white peach, wild alpine berry, and Sicilian citrus are gently cold-reduced to preserve delicate volatiles, bound with pure citrus pectin, and sealed in an apothecary-grade fluted crystal jar.",
  weight: "450G",
  weightUnit: "NET WT",
  bulletPoints: [
    "100% Cold-Reduced Fruit Puree",
    "Citrus Pectin Structural Matrix",
    "Zero Corn Syrup or Waxy Glazes",
    "Fluted UV-Protective Glassware"
  ]
};

export const INGREDIENTS_LIST: IngredientFeature[] = [
  {
    id: "ing-1",
    name: "Pure Fruit Extract",
    value: "100%",
    detail: "Direct cold-pressed Alphonso mango, white peach & wild berry pulp"
  },
  {
    id: "ing-2",
    name: "Added Refined Sugar",
    value: "0g",
    detail: "Sweetened naturally with low-glycemic fruit nectar reduction"
  },
  {
    id: "ing-3",
    name: "Artisanal Citrus Pectin",
    value: "3,200 mg",
    detail: "Extracted from Mediterranean lemon peels for clean, tender tooth-feel"
  },
  {
    id: "ing-4",
    name: "Wild Organic Acerola Vitamin C",
    value: "180 mg",
    detail: "Synergistic antioxidant preservation without synthetic ascorbic acid"
  },
  {
    id: "ing-5",
    name: "Organic Carnauba Dew",
    value: "Trace Pure",
    detail: "Whisper-light botanical gloss coating replacing industrial paraffin waxes"
  }
];

export const CIRCULAR_BADGES: CircularBadge[] = [
  {
    id: "badge-top",
    label: "ZERO REFINED SUGAR",
    angleDeg: 270,
    accentText: "NATURAL FRUIT NECTAR"
  },
  {
    id: "badge-right",
    label: "100% CITRUS PECTIN",
    angleDeg: 15,
    accentText: "GELATIN-FREE"
  },
  {
    id: "badge-bottom",
    label: "450G APOTHECARY JAR",
    angleDeg: 90,
    accentText: "HEAVY FLUTED GLASS"
  },
  {
    id: "badge-left",
    label: "5 HERITAGE FLAVORS",
    angleDeg: 195,
    accentText: "SUNLIT BOTANICALS"
  }
];

export const FOOTER_STATS: StatItem[] = [
  {
    id: "stat-1",
    value: "5",
    label: "HERITAGE FLAVORS",
    detail: "Mango, Peach, Blackberry, Blood Orange, Green Apple"
  },
  {
    id: "stat-2",
    value: "450G",
    label: "JAR CAPACITY",
    detail: "Approx. 65 hand-poured geometric fruit gems"
  },
  {
    id: "stat-3",
    value: "100%",
    label: "NATURAL PECTIN",
    detail: "100% Plant-derived, zero animal gelatin"
  },
  {
    id: "stat-4",
    value: "ZERO",
    label: "SYNTHETIC DYES",
    detail: "Colored solely by elderberry, paprika & chlorophyll"
  }
];
