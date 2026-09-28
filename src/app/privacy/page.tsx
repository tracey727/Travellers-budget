import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="today">
      <p>
        This Policy explains what {BUSINESS.operatorName} collects through Wayfarer and how
        it&apos;s used.
      </p>

      <h2>What&apos;s collected</h2>
      <ul>
        <li>Account details: your name, email address and a hashed password.</li>
        <li>
          Trip data you enter yourself: trip names, destinations, dates, budgets, categories
          and expenses.
        </li>
        <li>
          Standard technical logs (IP address, browser type) kept briefly for security and
          abuse prevention.
        </li>
      </ul>
      <p>
        Wayfarer never asks for bank credentials or card numbers, and never connects to your
        bank account. Every number in the app is one you typed in yourself.
      </p>

      <h2>How it&apos;s used</h2>
      <p>
        Solely to run the Service: to show you your own trips, calculate your own budgets, and
        keep your account secure. It is not sold, and not shared with advertisers.
      </p>

      <h2>Where it&apos;s stored</h2>
      <p>
        Data is stored in a managed Postgres database (Neon) and served through Cloudflare&apos;s
        network. Passwords are hashed and never stored in plain text; session tokens are
        stored as one-way hashes, so a database copy alone cannot be used to sign in as you.
      </p>

      <h2>Your rights</h2>
      <p>
        You can review and edit your trip data at any time inside the app. Delete a trip from
        its page, or email {BUSINESS.contactEmail} to request full account deletion.
      </p>

      <h2>Changes</h2>
      <p>We may update this Policy as the Service evolves; the date above reflects the latest version.</p>

      <h2>Contact</h2>
      <p>Questions about this Policy: {BUSINESS.contactEmail}</p>
    </LegalPage>
  );
}
