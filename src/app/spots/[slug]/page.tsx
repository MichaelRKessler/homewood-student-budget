import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, ExternalLink, Footprints, MapPin, Tag } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import { SpotCard } from "@/components/spot-card";
import { CATEGORY_BY_ID } from "@/lib/categories";
import { relatedSpots } from "@/lib/spot-filters";
import { getSpotBySlug, getSpots } from "@/lib/spots";
import { formatCategoryList, mapsUrl, walkingLabel } from "@/lib/utils";

export async function generateStaticParams() {
  const spots = await getSpots();
  return spots.map((spot) => ({ slug: spot.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spot = await getSpotBySlug(slug);

  if (!spot) {
    return { title: "Spot not found" };
  }

  return {
    title: spot.name,
    description: `${spot.tip} ${walkingLabel(spot.walkingMinutes)} from Homewood.`,
  };
}

export default async function SpotPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [spot, all] = await Promise.all([getSpotBySlug(slug), getSpots()]);

  if (!spot) {
    notFound();
  }

  const nearby = relatedSpots(spot, all);
  const categoryLabels = spot.categories.map((id) => CATEGORY_BY_ID[id].label);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/#spots"
        className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-terracotta"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to all spots
      </Link>

      <article className="mt-6 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_60px_-36px_rgba(14,35,64,0.45)]">
        <div className="border-b border-line bg-cream/70 px-6 py-8 sm:px-10">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
            {spot.neighborhood} · {spot.priceRange}
          </p>
          <h1 className="mt-2 font-display text-4xl text-navy sm:text-5xl">{spot.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {spot.categories.map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
          </div>
        </div>

        <div className="grid gap-10 px-6 py-8 sm:px-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-lg leading-relaxed text-ink/90">{spot.description}</p>
            <p className="mt-5 rounded-2xl bg-gold/15 px-4 py-3 text-[15px] leading-relaxed text-navy">
              <span className="font-semibold">Student tip. </span>
              {spot.tip}
            </p>
            {spot.studentDeal ? (
              <p className="mt-4 flex items-start gap-2 text-[15px] leading-relaxed text-ink/90">
                <Tag className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden />
                <span>
                  <span className="font-semibold text-navy">Deal note. </span>
                  {spot.studentDeal}
                </span>
              </p>
            ) : null}
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-xl text-navy">The walk</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/85">
              <li className="flex gap-2">
                <Footprints className="mt-0.5 h-4 w-4 text-navy/70" aria-hidden />
                {walkingLabel(spot.walkingMinutes)} from the Homewood quad
              </li>
              <li className="flex gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 text-navy/70" aria-hidden />
                {spot.hoursNote}
              </li>
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-navy/70" aria-hidden />
                {spot.address}
              </li>
            </ul>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={mapsUrl(spot.address)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-paper hover:bg-navy-ink"
              >
                Open in Maps
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
              {spot.website ? (
                <a
                  href={spot.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-navy hover:border-gold"
                >
                  Website
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Filed under {formatCategoryList(categoryLabels)}. Hours are notes,
              not a promise — kitchens change them.
            </p>
          </aside>
        </div>
      </article>

      {nearby.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-3xl text-navy">Also nearby</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {nearby.map((item) => (
              <SpotCard key={item.id} spot={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
