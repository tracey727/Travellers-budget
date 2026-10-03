import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <LegalPage title="Contact" updated="today">
      <p>Questions, feedback or a problem with your account — reach out any time.</p>
      <p>
        <a
          href={`mailto:${BUSINESS.contactEmail}`}
          className="font-semibold text-[var(--brass-deep)] hover:underline"
        >
          {BUSINESS.contactEmail}
        </a>
      </p>
    </LegalPage>
  );
}
