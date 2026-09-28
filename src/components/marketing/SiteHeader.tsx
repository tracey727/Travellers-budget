import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  return (
    <header
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-20"
          : "relative z-20 border-b border-black/5 bg-white"
      }
    >
      <div className="wf-section flex h-20 items-center justify-between">
        <Logo dark={transparent} />
        <nav className="hidden items-center gap-8 md:flex">
          {[
            ["Features", "/#features"],
            ["Destinations", "/#destinations"],
            ["How it works", "/#how-it-works"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={
                transparent
                  ? "text-sm font-medium text-white/85 hover:text-white"
                  : "text-sm font-medium text-[var(--ink-dim)] hover:text-[var(--teal-deep)]"
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={
              transparent
                ? "hidden text-sm font-semibold text-white/90 hover:text-white sm:inline"
                : "hidden text-sm font-semibold text-[var(--teal-deep)] hover:underline sm:inline"
            }
          >
            Log in
          </Link>
          <Link href="/signup" className="wf-btn-primary">
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
