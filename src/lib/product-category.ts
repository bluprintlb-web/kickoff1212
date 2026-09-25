export const PRODUCT_CATEGORIES = [
  "JERSEY",
  "TROPHY",
  "BALL",
  "GLOVES",
  "BODYWEAR",
  "SHIN_PADS",
  "SOCKS",
  "BOOTS",
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProductCategoryValue, string> = {
  JERSEY: "Jerseys",
  TROPHY: "Trophies",
  BALL: "Balls",
  GLOVES: "Gloves",
  BODYWEAR: "Bodywear",
  SHIN_PADS: "Shin pads",
  SOCKS: "Socks",
  BOOTS: "Boots",
};

export const AGE_GROUPS = ["KIDS", "ADULT"] as const;
export type AgeGroupValue = (typeof AGE_GROUPS)[number];

// Only meaningful when category = JERSEY — see Product.jerseyType in
// prisma/schema.prisma.
export const JERSEY_TYPES = ["FAN", "PLAYER", "RETRO"] as const;
export type JerseyTypeValue = (typeof JERSEY_TYPES)[number];

export const JERSEY_TYPE_LABELS: Record<JerseyTypeValue, string> = {
  FAN: "Fan version",
  PLAYER: "Player version",
  RETRO: "Retro",
};
