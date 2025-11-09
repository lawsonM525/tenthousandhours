import Link from "next/link";
import { Menu } from "lucide-react";

const navigation = [
  { name: "Product", href: "#product" },
  { name: "Insights", href: "#insights" },
  { name: "Timeline", href: "#timeline" },
  { name: "Categories", href: "#categories" },
  { name: "Principles", href: "#principles" },
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgba(11,13,16,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F11D75]/20 text-[#F11D75]">10k</span>
          <span className="text-base font-semibold text-white">10,000hours</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--muted)] md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="#"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="#get-started"
            className="rounded-full bg-[#F11D75] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(241,29,117,0.35)] transition hover:bg-[#ff2a86]"
          >
            Start free
          </Link>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </button>
      </div>
    </header>
  );
}
