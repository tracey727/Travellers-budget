import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/require";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="wf-display text-3xl font-semibold text-[var(--teal-deep)]">Settings</h1>
        <p className="mt-1 wf-muted">Your account, not anyone else&apos;s.</p>
      </div>

      <div className="wf-card">
        <h2 className="text-lg font-semibold text-[var(--teal-deep)]">Profile</h2>
        <ProfileForm fullName={user.fullName} homeCurrency={user.homeCurrency} email={user.email} />
      </div>

      <div className="wf-card">
        <h2 className="text-lg font-semibold text-[var(--teal-deep)]">Password</h2>
        <PasswordForm />
      </div>
    </div>
  );
}
