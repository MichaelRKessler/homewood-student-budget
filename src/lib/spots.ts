import { spots as seedSpots } from "@/data/spots";
import { CATEGORY_IDS, PRICE_RANGES, type CategoryId, type PriceRange, type Spot } from "@/lib/types";
import { getSupabase } from "@/lib/supabase";

type SpotRow = {
  id: string;
  slug: string;
  name: string;
  categories: string[];
  price_range: string;
  tip: string;
  walking_minutes: number;
  hours_note: string;
  address: string;
  neighborhood: string;
  description: string;
  website: string | null;
  student_deal: string | null;
};

function isCategoryId(value: string): value is CategoryId {
  return (CATEGORY_IDS as readonly string[]).includes(value);
}

function isPriceRange(value: string): value is PriceRange {
  return (PRICE_RANGES as readonly string[]).includes(value);
}

function mapRow(row: SpotRow): Spot | null {
  const categories = row.categories.filter(isCategoryId);
  if (categories.length === 0 || !isPriceRange(row.price_range)) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categories,
    priceRange: row.price_range,
    tip: row.tip,
    walkingMinutes: row.walking_minutes,
    hoursNote: row.hours_note,
    address: row.address,
    neighborhood: row.neighborhood,
    description: row.description,
    website: row.website,
    studentDeal: row.student_deal,
  };
}

function sortSpots(list: Spot[]): Spot[] {
  return [...list].sort((a, b) => {
    if (a.walkingMinutes !== b.walkingMinutes) {
      return a.walkingMinutes - b.walkingMinutes;
    }
    return a.name.localeCompare(b.name);
  });
}

export async function getSpots(): Promise<Spot[]> {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("spots")
      .select(
        "id, slug, name, categories, price_range, tip, walking_minutes, hours_note, address, neighborhood, description, website, student_deal",
      )
      .order("walking_minutes", { ascending: true });

    if (!error && data) {
      const mapped = (data as SpotRow[]).map(mapRow).filter((spot): spot is Spot => spot !== null);
      if (mapped.length > 0) {
        return sortSpots(mapped);
      }
    }
  }

  return sortSpots(seedSpots);
}

export async function getSpotBySlug(slug: string): Promise<Spot | null> {
  const all = await getSpots();
  return all.find((spot) => spot.slug === slug) ?? null;
}

export function filterSpots(
  all: Spot[],
  options: { query?: string; category?: CategoryId | "all" },
): Spot[] {
  const query = options.query?.trim().toLowerCase() ?? "";
  const category = options.category ?? "all";

  return all.filter((spot) => {
    const matchesCategory = category === "all" || spot.categories.includes(category);
    if (!matchesCategory) {
      return false;
    }
    if (!query) {
      return true;
    }

    const haystack = [
      spot.name,
      spot.neighborhood,
      spot.address,
      spot.tip,
      spot.description,
      spot.hoursNote,
      spot.studentDeal ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function relatedSpots(spot: Spot, all: Spot[], limit = 3): Spot[] {
  return all
    .filter((candidate) => candidate.slug !== spot.slug)
    .map((candidate) => {
      const shared = candidate.categories.filter((category) =>
        spot.categories.includes(category),
      ).length;
      const sameNeighborhood = candidate.neighborhood === spot.neighborhood ? 2 : 0;
      return { candidate, score: shared + sameNeighborhood };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.candidate.walkingMinutes - b.candidate.walkingMinutes;
    })
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
