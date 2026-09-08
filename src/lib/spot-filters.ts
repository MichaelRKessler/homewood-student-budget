import type { CategoryId, Spot } from "@/lib/types";

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
      const shared = candidate.categories.filter((id) => spot.categories.includes(id)).length;
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
