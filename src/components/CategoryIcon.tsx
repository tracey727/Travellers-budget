import { CATEGORY_ICONS } from "@/lib/categories";

export function CategoryIcon({ icon, className = "" }: { icon: string; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center leading-none ${className}`}>
      {CATEGORY_ICONS[icon] ?? "💳"}
    </span>
  );
}
