import Image from "next/image";
import { cn } from "@/lib/utils";

// The mark is the real KICKOFF.LB artwork (public/brand/kickoff-icon.png —
// the green Australia/pitch-lines icon, background keyed to transparent),
// not a code-drawn monogram — replaces the earlier "A" tile used during the
// Ayaz rename.
// public/brand/kickoff-icon.png is 512x512 — plenty of headroom above any
// of these display sizes, so next/image (which requests a rendition sized
// off the width/height props below) stays crisp even at 2x DPR.
const ICON_SIZE = { default: 36, lg: 60 } as const;

export function Logo({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "lg";
}) {
  return (
    <span
      className={cn(
        "hover-lift inline-flex items-center gap-2 hover:scale-105",
        className
      )}
    >
      <Image
        src="/brand/kickoff-icon.png"
        alt=""
        width={ICON_SIZE[size]}
        height={ICON_SIZE[size]}
        className={cn(
          "shrink-0 object-contain",
          size === "lg" ? "size-9 sm:size-15" : "size-9"
        )}
        priority
      />
      <span
        className={cn(
          "font-display tracking-wide",
          size === "lg" ? "text-2xl sm:text-4xl" : "text-xl"
        )}
      >
        KICK <span className="text-accent">OFF</span>
      </span>
    </span>
  );
}
