"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { logoutAction } from "@/lib/actions/auth";

const LINKS = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/trips/new", label: "New trip" },
  { href: "/app/settings", label: "Settings" },
];

export function AppNav({ fullName }: { fullName: string }) {
  const pathname = usePathname();
  const firstName = fullName.split(" ")[0];

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="wf-section flex h-16 items-center justify-between">
        <Logo href="/app" size="sm" />
        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/app" ? pathname === "/app" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[var(--teal-deep)] text-white"
                    : "text-[var(--ink-dim)] hover:bg-black/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm wf-muted sm:inline">Hi, {firstName}</span>
          <form action={logoutAction}>
            <button type="submit" className="wf-btn-secondary px-4 py-2 text-sm">
              Log out
            </button>
          </form>
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-black/5 px-4 py-2 sm:hidden">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold text-[var(--ink-dim)] hover:bg-black/5"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
