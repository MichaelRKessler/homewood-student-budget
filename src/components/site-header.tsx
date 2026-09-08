import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-navy text-[11px] font-semibold tracking-tight text-gold-soft"
          >
            HB
          </span>
          <span className="font-display text-lg tracking-tight text-navy sm:text-xl">
            Homewood on a Budget
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-navy">
          <Link href="/#spots" className="hover:text-terracotta">
            Spots
          </Link>
          <Link href="/about" className="hover:text-terracotta">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
