import type { HoursSpec } from "@/lib/hours";

export const CATEGORY_IDS = [
  "cheap-eats",
  "student-discounts",
  "late-night",
  "coffee-study",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const PRICE_RANGES = ["$", "$$", "$$$"] as const;

export type PriceRange = (typeof PRICE_RANGES)[number];

export type Spot = {
  id: string;
  slug: string;
  name: string;
  categories: CategoryId[];
  priceRange: PriceRange;
  tip: string;
  walkingMinutes: number;
  hoursNote: string;
  hours: HoursSpec;
  address: string;
  neighborhood: string;
  description: string;
  website: string | null;
  studentDeal: string | null;
};
