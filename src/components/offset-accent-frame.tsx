const GAP_CLASSES = {
  "4": "-end-4 -bottom-4",
  "5": "-end-5 -bottom-5",
} as const;

// Decorative border offset behind a hero/product image — shared so the
// homepage hero and product detail page stay in sync instead of hand-copying
// the same markup with a different gap.
export function OffsetAccentFrame({ gap = "4" }: { gap?: keyof typeof GAP_CLASSES }) {
  return (
    <div
      aria-hidden
      className={`absolute hidden h-full w-full border-2 border-accent sm:block ${GAP_CLASSES[gap]}`}
    />
  );
}
