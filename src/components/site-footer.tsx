import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-cream">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Homewood on a Budget — Charles Village, Remington, and nearby. Not East
          Baltimore. Not a university login wall.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="text-navy hover:text-terracotta">
            About
          </Link>
          <Link href="/#spots" className="text-navy hover:text-terracotta">
            Browse spots
          </Link>
        </div>
      </div>
    </footer>
  );
}
