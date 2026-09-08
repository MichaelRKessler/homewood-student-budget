"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SpotCard } from "@/components/spot-card";
import { CATEGORIES } from "@/lib/categories";
import { filterSpots } from "@/lib/spots";
import type { CategoryId, Spot } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterId = "all" | CategoryId;

export function SpotExplorer({ spots }: { spots: Spot[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FilterId>("all");

  const visible = useMemo(
    () => filterSpots(spots, { query, category }),
    [spots, query, category],
  );

  return (
    <section id="spots" className="scroll-mt-24">
      <div className="rounded-3xl border border-line bg-white/80 p-4 shadow-[0_20px_50px_-36px_rgba(14,35,64,0.55)] sm:p-6">
        <label className="relative block">
          <span className="sr-only">Search spots</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bagels, late night, Hampden, vegetarian…"
            className="w-full rounded-2xl border border-line bg-paper py-3 pr-4 pl-10 text-base text-ink outline-none ring-gold/40 placeholder:text-muted/80 focus:border-gold focus:ring-2"
          />
        </label>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip
            active={category === "all"}
            onClick={() => setCategory("all")}
            label="All spots"
          />
          {CATEGORIES.map((item) => (
            <FilterChip
              key={item.id}
              active={category === item.id}
              onClick={() => setCategory(item.id)}
              label={item.label}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {visible.length} {visible.length === 1 ? "spot" : "spots"}
        {category !== "all" ? ` in ${CATEGORIES.find((item) => item.id === category)?.label}` : ""}
        {query.trim() ? ` matching “${query.trim()}”` : ""}.
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-cream/60 px-6 py-14 text-center">
          <p className="font-display text-2xl text-navy">No matches in walking range.</p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Try a neighborhood, a dish, or clear the search. This guide stays west of
            downtown — Charles Village, Remington, Waverly, and Hampden.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-5 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-paper hover:bg-navy-ink"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition",
        active
          ? "bg-navy text-paper"
          : "bg-cream text-navy ring-1 ring-line hover:bg-gold-soft/70",
      )}
    >
      {label}
    </button>
  );
}
