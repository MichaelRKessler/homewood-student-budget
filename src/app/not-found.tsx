import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-start px-4 py-20 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">404</p>
      <h1 className="mt-3 font-display text-4xl text-navy">That spot is off the map</h1>
      <p className="mt-4 text-muted">
        It may have closed, moved, or never been in walking range of Homewood.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-paper hover:bg-navy-ink"
      >
        Back to the guide
      </Link>
    </div>
  );
}
