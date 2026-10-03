import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--teal-deep)" }} className="text-[var(--ivory)]">
      <div className="wf-section grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo dark href={null} />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Plan the trip, not the spreadsheet. Wayfarer tracks every flight, night and meal
            against your budget, in any currency.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-white/50">Product</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/#features" className="text-white/75 hover:text-white">Features</Link></li>
            <li><Link href="/#destinations" className="text-white/75 hover:text-white">Destinations</Link></li>
            <li><Link href="/#how-it-works" className="text-white/75 hover:text-white">How it works</Link></li>
            <li><Link href="/signup" className="text-white/75 hover:text-white">Get started</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-white/50">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/legal" className="text-white/75 hover:text-white">Legal</Link></li>
            <li><Link href="/terms" className="text-white/75 hover:text-white">Terms of Use</Link></li>
            <li><Link href="/privacy" className="text-white/75 hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/contact" className="text-white/75 hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-white/50">Account</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/login" className="text-white/75 hover:text-white">Log in</Link></li>
            <li><Link href="/signup" className="text-white/75 hover:text-white">Sign up</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wf-section flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Wayfarer. All rights reserved.</p>
          <p>Built for travellers, not accountants.</p>
        </div>
      </div>
    </footer>
  );
}
