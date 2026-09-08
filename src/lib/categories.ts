import type { CategoryId } from "@/lib/types";

export type CategoryMeta = {
  id: CategoryId;
  label: string;
  shortLabel: string;
  description: string;
};

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "cheap-eats",
    label: "Cheap Eats",
    shortLabel: "Cheap eats",
    description: "Filling meals that stay in student-budget range.",
  },
  {
    id: "student-discounts",
    label: "Student Discounts",
    shortLabel: "Student deals",
    description: "Rewards, campus staples, and spots priced for Hopkins kids.",
  },
  {
    id: "late-night",
    label: "Late Night",
    shortLabel: "Late night",
    description: "Open late enough for a post-library or post-lab run.",
  },
  {
    id: "coffee-study",
    label: "Coffee / Study snacks",
    shortLabel: "Coffee & study",
    description: "Cafes and counters that work for laptops and between-class fuel.",
  },
];

export const CATEGORY_BY_ID: Record<CategoryId, CategoryMeta> = {
  "cheap-eats": {
    id: "cheap-eats",
    label: "Cheap Eats",
    shortLabel: "Cheap eats",
    description: "Filling meals that stay in student-budget range.",
  },
  "student-discounts": {
    id: "student-discounts",
    label: "Student Discounts",
    shortLabel: "Student deals",
    description: "Rewards, campus staples, and spots priced for Hopkins kids.",
  },
  "late-night": {
    id: "late-night",
    label: "Late Night",
    shortLabel: "Late night",
    description: "Open late enough for a post-library or post-lab run.",
  },
  "coffee-study": {
    id: "coffee-study",
    label: "Coffee / Study snacks",
    shortLabel: "Coffee & study",
    description: "Cafes and counters that work for laptops and between-class fuel.",
  },
};

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}
