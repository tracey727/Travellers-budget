import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/marketing/LegalPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = { title: "Legal" };

export default function LegalIndexPage() {
  return (
    <LegalPage title="Legal" updated="today">
      <p>
        Wayfarer is operated by {BUSINESS.operatorName}. The documents below cover how the
        app may be used and how your data is handled.
      </p>
      <ul>
        <li>
          <Link href="/terms" className="font-semibold text-[var(--brass-deep)] hover:underline">
            Terms of Use
          </Link>{" "}
          — what the app is and is not, and your account responsibilities.
        </li>
        <li>
          <Link href="/privacy" className="font-semibold text-[var(--brass-deep)] hover:underline">
            Privacy Policy
          </Link>{" "}
          — what&apos;s collected, how it&apos;s stored, and your rights over it.
        </li>
        <li>
          <Link href="/contact" className="font-semibold text-[var(--brass-deep)] hover:underline">
            Contact
          </Link>{" "}
          — how to reach us.
        </li>
      </ul>
      <p className="wf-muted text-xs">
        Contact: {BUSINESS.contactEmail} · Governing law: {BUSINESS.jurisdiction}
      </p>
    </LegalPage>
  );
}
