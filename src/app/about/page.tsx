import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "What Homewood on a Budget covers — and what it leaves out.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        A student-made field guide
      </p>
      <h1 className="mt-3 font-display text-4xl text-navy sm:text-5xl">
        Built for Homewood, not the whole city
      </h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/90">
        <p>
          Homewood on a Budget helps Johns Hopkins Homewood students find cheap
          eats, student-friendly deals, coffee tables, and late-night backups
          within walking distance of campus.
        </p>
        <p>
          The map stops at Charles Village, Remington, Waverly, and nearby
          Hampden. It does not cover East Baltimore, the medical campus, or
          Harbor East date nights. If you cannot walk it between sections, it
          does not belong here.
        </p>
        <p>
          There is no JHED login and no university SSO. Browse as a guest. A
          light email or magic-link account can come later; it is not required
          for this MVP.
        </p>
        <p>
          Hours and prices move. Treat every hours note as a tip, then check the
          shop. Open now uses structured weekly hours in America/New_York. Spots
          we cannot schedule stay under Hours unknown instead of being silently
          included or dropped. Seeded spots are real neighborhood places students
          actually use — including Chipotle, honeygrow, Tamber&apos;s, One World
          Cafe, Bird in Hand, and Nori on The Avenue. Alem is not listed because
          it is not a Baltimore restaurant.
        </p>
      </div>
      <Link
        href="/#spots"
        className="mt-10 inline-flex rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-paper hover:bg-navy-ink"
      >
        Find something cheap
      </Link>
    </div>
  );
}
