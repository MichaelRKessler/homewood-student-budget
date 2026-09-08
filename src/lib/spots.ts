import { spots as seedSpots } from "@/data/spots";
import {
  CATEGORY_IDS,
  PRICE_RANGES,
  type CategoryId,
  type PriceRange,
  type Spot,
} from "@/lib/types";
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
