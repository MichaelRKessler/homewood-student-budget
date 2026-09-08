import Link from "next/link";
import { Clock3, Footprints, MapPin } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import type { Spot } from "@/lib/types";
import { walkingLabel } from "@/lib/utils";

export function SpotCard({ spot }: { spot: Spot }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_10px_30px_-24px_rgba(14,35,64,0.45)] transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_18px_40px_-24px_rgba(14,35,64,0.55)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {spot.neighborhood}
          </p>
          <h2 className="mt-1 font-display text-2xl leading-tight text-navy">
            <Link href={`/spots/${spot.slug}`} className="hover:text-terracotta">
              {spot.name}
            </Link>
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-cream px-2.5 py-1 text-sm font-semibold text-navy">
          {spot.priceRange}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {spot.categories.map((category) => (
          <CategoryBadge key={category} category={category} compact />
        ))}
      </div>

      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/85">{spot.tip}</p>

      <dl className="mt-5 grid gap-2 text-sm text-muted">
        <div className="flex items-center gap-2">
          <Footprints className="h-4 w-4 text-navy/70" aria-hidden />
          <dt className="sr-only">Walk from Homewood</dt>
          <dd>{walkingLabel(spot.walkingMinutes)} from Homewood</dd>
        </div>
        <div className="flex items-start gap-2">
          <Clock3 className="mt-0.5 h-4 w-4 text-navy/70" aria-hidden />
          <dt className="sr-only">Hours</dt>
          <dd>{spot.hoursNote}</dd>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-navy/70" aria-hidden />
          <dt className="sr-only">Address</dt>
          <dd>
            {spot.address}
          </dd>
        </div>
      </dl>

      <Link
        href={`/spots/${spot.slug}`}
        className="mt-5 inline-flex items-center text-sm font-semibold text-navy group-hover:text-terracotta"
      >
        Spot details
        <span aria-hidden className="ml-1 transition group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </article>
  );
}
