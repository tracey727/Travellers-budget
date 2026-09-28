import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MockAppPreview } from "@/components/marketing/MockAppPreview";
import { IconGlobe, IconChart, IconCompass, IconDevices, IconShield, IconSuitcase } from "@/components/marketing/icons";
import { Photo } from "@/components/Photo";
import { DESTINATION_PHOTO_KEYS } from "@/lib/photos";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Travel Budgeting, Done Beautifully",
};

const FEATURES = [
  {
    icon: IconGlobe,
    title: "Any currency, one clear number",
    body: "Log an expense in baht, yen or euros and Wayfarer converts it to your trip currency automatically, so your budget is never a guessing game.",
  },
  {
    icon: IconChart,
    title: "Budget by category, not by vibes",
    body: "Flights, stays, food, activities — set what each one is worth to you, and watch a live bar tell you exactly how much runway is left.",
  },
  {
    icon: IconCompass,
    title: "Every trip, kept separate",
    body: "Plan next month's city break and next year's round-the-world trip side by side, without one budget bleeding into the other.",
  },
  {
    icon: IconDevices,
    title: "Log it the second it happens",
    body: "Add an expense from your phone at the counter, not from memory three days later on a laptop. It's just a browser tab, everywhere.",
  },
  {
    icon: IconShield,
    title: "Your data, not an advertiser's",
    body: "No bank connections to authorise, no card numbers to hand over. You control every number that goes in.",
  },
  {
    icon: IconSuitcase,
    title: "Built only for travel",
    body: "Not a general ledger with a suitcase icon bolted on — every field exists because it's what a trip actually needs.",
  },
];

const COMPARISON = [
  { spreadsheet: "A new tab, a new formula, every single trip", wayfarer: "Create a trip in 30 seconds, categories included" },
  { spreadsheet: "Manual currency math you hope you got right", wayfarer: "Converts to your trip currency as you type" },
  { spreadsheet: "Opens properly on a laptop, barely on a phone", wayfarer: "Built to be used standing in an airport queue" },
  { spreadsheet: "One long list, no sense of what's left", wayfarer: "A live bar for every category, updated instantly" },
];

export default async function HomePage() {
  const user = await getSessionUser().catch(() => null);
  const primaryHref = user ? "/app" : "/signup";
  const primaryLabel = user ? "Go to your dashboard" : "Start planning — it's free";

  return (
    <div className="min-h-dvh bg-[var(--ivory)]">
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
        <Photo photoKey="hero" priority width={2400} className="absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-[var(--teal-deep)]" />
        <SiteHeader transparent />

        <div className="wf-section relative w-full pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-xl text-white">
              <span className="wf-pill bg-white/10 text-white border-white/25">
                Now in early access
              </span>
              <h1 className="wf-display mt-5 text-5xl font-semibold leading-[1.08] sm:text-6xl">
                Plan the trip.
                <br />
                Not the spreadsheet.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/80">
                Wayfarer is the travel budgeting app that tracks every flight, night and
                meal against your plan — in any currency, for any trip. Know exactly what&apos;s
                left before you order the next round.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href={primaryHref} className="wf-btn-primary px-7 py-3.5 text-base">
                  {primaryLabel}
                </Link>
                <Link href="#how-it-works" className="wf-btn-ghost-light px-7 py-3.5 text-base">
                  See how it works
                </Link>
              </div>
              <p className="mt-5 text-sm text-white/55">
                No credit card. No bank connection required. Just your trip and your numbers.
              </p>
            </div>

            <div className="hidden justify-self-end lg:flex">
              <MockAppPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Features */}
      <section id="features" className="wf-section py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="wf-pill">What Wayfarer does</p>
          <h2 className="wf-display mt-4 text-4xl font-semibold text-[var(--teal-deep)]">
            Everything a real trip budget needs
          </h2>
          <p className="mt-4 text-lg wf-muted">
            No modules to enable, no upsells hiding the useful part. This is the whole app.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="wf-card">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "rgba(185,131,42,0.12)", color: "var(--brass-deep)" }}
              >
                <f.icon />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--teal-deep)]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed wf-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------- Destinations */}
      <section id="destinations" className="py-24" style={{ background: "var(--paper)" }}>
        <div className="wf-section">
          <div className="mx-auto max-w-2xl text-center">
            <p className="wf-pill">Wherever you&apos;re headed</p>
            <h2 className="wf-display mt-4 text-4xl font-semibold text-[var(--teal-deep)]">
              Built for every kind of trip
            </h2>
            <p className="mt-4 text-lg wf-muted">
              A weekend city break or a six-month circuit — same app, same clarity.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {DESTINATION_PHOTO_KEYS.map((key, i) => (
              <div
                key={key}
                className={`group relative aspect-[3/4] overflow-hidden rounded-2xl ${
                  i === 0 ? "col-span-2 row-span-2 aspect-auto sm:aspect-[4/5]" : ""
                }`}
              >
                <Photo
                  photoKey={key}
                  width={i === 0 ? 1200 : 600}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- How it works */}
      <section id="how-it-works" className="wf-section py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="wf-pill">Three steps</p>
          <h2 className="wf-display mt-4 text-4xl font-semibold text-[var(--teal-deep)]">
            From idea to itinerary-ready budget
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {[
            {
              step: "01",
              title: "Create your trip",
              body: "Name it, set the dates, pick the currency you'll mostly spend in. Eight standard categories are ready the moment you save it.",
            },
            {
              step: "02",
              title: "Set what each part is worth",
              body: "Give flights, stays, food and the rest a number. It's your trip, so it's your split — change it anytime before or during travel.",
            },
            {
              step: "03",
              title: "Log it as you spend",
              body: "One line per expense: what, how much, which currency. Wayfarer converts it and updates every bar the instant you save.",
            },
          ].map((s) => (
            <div key={s.step} className="wf-card">
              <span className="wf-display text-4xl font-semibold text-[var(--brass)]">
                {s.step}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-[var(--teal-deep)]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed wf-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ Comparison */}
      <section className="py-24" style={{ background: "var(--ivory-dim)" }}>
        <div className="wf-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="wf-display text-4xl font-semibold text-[var(--teal-deep)]">
              Retire the trip spreadsheet
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="grid grid-cols-2 divide-x divide-black/10">
              <div className="bg-black/[0.03] px-6 py-4 text-sm font-bold uppercase tracking-[0.1em] wf-muted">
                The old way
              </div>
              <div className="px-6 py-4 text-sm font-bold uppercase tracking-[0.1em] text-[var(--brass-deep)]">
                With Wayfarer
              </div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 divide-x divide-black/10 ${
                  i % 2 === 1 ? "bg-black/[0.015]" : ""
                }`}
              >
                <div className="px-6 py-4 text-sm wf-muted">{row.spreadsheet}</div>
                <div className="px-6 py-4 text-sm font-medium text-[var(--teal-deep)]">
                  {row.wayfarer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Final CTA */}
      <section className="relative overflow-hidden py-28">
        <Photo photoKey="airplaneWing" width={2400} className="absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-[var(--teal-deep)]/80" />
        <div className="wf-section text-center text-white">
          <h2 className="wf-display text-4xl font-semibold sm:text-5xl">
            Your next trip deserves a real budget
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Free to start. No card, no bank link — just the trip you&apos;re planning and the
            numbers behind it.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href={primaryHref} className="wf-btn-primary px-8 py-3.5 text-base">
              {primaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
