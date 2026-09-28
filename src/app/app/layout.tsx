import { requireUser } from "@/lib/auth/require";
import { AppNav } from "@/components/app/AppNav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh bg-[var(--ivory)]">
      <AppNav fullName={user.fullName} />
      <main className="wf-section py-10">{children}</main>
    </div>
  );
}
