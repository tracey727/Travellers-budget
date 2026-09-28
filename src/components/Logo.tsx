import Link from "next/link";

/** A typographic wordmark — no image asset required, crisp at any size, real text for screen readers. */
export function Logo({
  size = "md",
  dark = false,
  href = "/",
}: {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
  href?: string | null;
}) {
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";
  const mark = (
    <span className={`inline-flex items-center gap-2 ${textSize} font-display font-semibold`}>
      <span
        className="inline-flex h-[1.5em] w-[1.5em] items-center justify-center rounded-full text-[0.55em]"
        style={{
          background: "linear-gradient(180deg, #e6bd5c, #b9832a)",
          color: "#1c1206",
        }}
        aria-hidden
      >
        ✦
      </span>
      <span className={dark ? "text-[var(--ivory)]" : "text-[var(--teal-deep)]"}>Wayfarer</span>
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} aria-label="Wayfarer home">
      {mark}
    </Link>
  );
}
