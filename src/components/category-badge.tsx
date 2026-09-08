import { CATEGORY_BY_ID } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE: Record<CategoryId, string> = {
  "cheap-eats": "bg-terracotta/10 text-terracotta ring-terracotta/20",
  "student-discounts": "bg-gold/20 text-navy ring-gold/40",
  "late-night": "bg-navy/10 text-navy ring-navy/15",
  "coffee-study": "bg-sage/10 text-sage ring-sage/20",
};

export function CategoryBadge({
  category,
  compact = false,
}: {
  category: CategoryId;
  compact?: boolean;
}) {
  const meta = CATEGORY_BY_ID[category];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ring-1",
        TONE[category],
        compact && "px-2",
      )}
    >
      {compact ? meta.shortLabel : meta.label}
    </span>
  );
}
