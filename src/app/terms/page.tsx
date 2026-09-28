import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="today">
      <p>
        These Terms govern your use of Wayfarer (the &ldquo;Service&rdquo;), operated by{" "}
        {BUSINESS.operatorName}. By creating an account you agree to them.
      </p>

      <h2>What Wayfarer is</h2>
      <p>
        Wayfarer is a record-keeping tool for planning and tracking travel budgets. It does
        not connect to your bank, does not move money, and does not provide financial, tax
        or investment advice. Every figure in the app is only as accurate as what you enter.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You&apos;re responsible for keeping your password confidential.</li>
        <li>You must provide a real, working email address to create an account.</li>
        <li>You&apos;re responsible for the accuracy of the trip and expense data you enter.</li>
        <li>You may delete a trip, or your entire account, at any time from Settings.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        Don&apos;t use the Service to store or transmit unlawful content, attempt to disrupt the
        Service, or attempt to access another person&apos;s account or data.
      </p>

      <h2>Availability</h2>
      <p>
        The Service is provided on an &ldquo;as is&rdquo; basis. We aim for it to be
        available and your data to be safe, but we do not guarantee uninterrupted access and
        recommend keeping your own copies of anything critical.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms as the Service evolves. Continuing to use Wayfarer after a
        change means you accept the update.
      </p>

      <h2>Contact</h2>
      <p>Questions about these Terms: {BUSINESS.contactEmail}</p>
      <p className="wf-muted text-xs">Governing law: {BUSINESS.jurisdiction}</p>
    </LegalPage>
  );
}
