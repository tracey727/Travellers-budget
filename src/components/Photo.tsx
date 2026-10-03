"use client";

import { useState } from "react";
import { PHOTO_LIBRARY, photoUrl, type PhotoKey } from "@/lib/photos";

/**
 * Real photography with a designed fallback. If the Unsplash asset ever
 * fails to load, the mood gradient beneath it simply stays visible instead
 * of a browser's broken-image icon — the layout never looks unfinished.
 */
export function Photo({
  photoKey,
  width = 1200,
  className = "",
  priority = false,
}: {
  photoKey: PhotoKey;
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const meta = PHOTO_LIBRARY[photoKey];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient} ${className}`}>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element -- served from an unoptimized external CDN, sized via the `width` param
        <img
          src={photoUrl(photoKey, width)}
          alt={meta.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </div>
  );
}

export function photoAlt(key: PhotoKey): string {
  return PHOTO_LIBRARY[key].alt;
}
