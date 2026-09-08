export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function walkingLabel(minutes: number): string {
  if (minutes <= 5) {
    return `${minutes} min walk`;
  }
  return `~${minutes} min walk`;
}

export function formatCategoryList(labels: string[]): string {
  if (labels.length === 0) {
    return "";
  }
  if (labels.length === 1) {
    return labels[0] ?? "";
  }
  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}
