"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ROTATE_INTERVAL_MS = 4000;

// Homepage "Shop by category" tile art. Cycles through a handful of real
// product photos from that category (fading in a new one every few
// seconds) when any exist — falls back to the plain icon-on-gradient tile
// (same treatment as ProductImage's placeholder) for a category with no
// real photos uploaded yet. Takes the fallback as an already-rendered
// element (not a component reference) since a Server Component can't pass
// a lucide icon component across the server/client boundary directly.
export function CategoryTileImage({
  images,
  fallback,
  className,
}: {
  images: string[];
  fallback: ReactNode;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent/20 via-accent/5 to-brand/10",
        className
      )}
    >
      {images.length > 0 ? (
        <Image
          key={images[index]}
          src={images[index]}
          alt=""
          fill
          sizes="(min-width: 640px) 25vw, 50vw"
          className="animate-in fade-in object-cover duration-700"
        />
      ) : (
        fallback
      )}
    </div>
  );
}
