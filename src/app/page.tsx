import { SpotExplorer } from "@/components/spot-explorer";
import { getSpots } from "@/lib/spots";

export const revalidate = 3600;

export default async function Home() {
  const spots = await getSpots();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-navy text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, rgba(196,163,90,0.45), transparent 34%), radial-gradient(circle at 88% 10%, rgba(196,93,58,0.28), transparent 28%)",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-gold-soft uppercase">
              Johns Hopkins Homewood · student field guide
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
              Homewood on a Budget
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">
              Cheap eats, student discounts, and late-night spots you can walk to
              from campus. Charles Village, Remington, Waverly, and a stretch into
              Hampden — not East Baltimore, not a dining-hall rumor mill.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#spots"
                className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-ink hover:bg-gold-soft"
              >
                Browse spots
              </a>
              <a
                href="/about"
                className="rounded-full border border-paper/20 px-5 py-2.5 text-sm font-semibold text-paper hover:border-gold/50 hover:text-gold-soft"
              >
                How this works
              </a>
            </div>
          </div>
          <aside className="rounded-3xl border border-gold/40 bg-paper px-6 py-6 text-navy shadow-[0_16px_40px_-28px_rgba(0,0,0,0.6)]">
            <p className="font-display text-2xl text-navy">No JHED required</p>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-ink/80">
              <li>Browse without signing in. Optional accounts can wait.</li>
              <li>Walking times are from the Homewood quad, not from the hospital.</li>
              <li>Hours change. Treat them as a tip, then confirm.</li>
            </ul>
          </aside>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-3xl text-navy sm:text-4xl">What&apos;s close and cheap</h2>
          <p className="mt-3 text-muted">
            Filter by Cheap Eats, Student Discounts, Late Night, Coffee / Study
            snacks, or Open now (Baltimore time). {spots.length} real neighborhood
            spots, seeded for a working demo.
          </p>
        </div>
        <SpotExplorer spots={spots} />
      </div>
    </div>
  );
}
