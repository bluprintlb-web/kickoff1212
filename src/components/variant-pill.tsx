import { cn } from "@/lib/utils";

export function variantLabel(
  variant: { size: string | null; color: string | null },
  fallback: string
): string {
  return [variant.size, variant.color].filter(Boolean).join(" / ") || fallback;
}

// Shared by AddToCart (storefront) and PosManualAddDialog (admin POS) — same
// out-of-stock-but-visible treatment in both places.
export function VariantPill({
  label,
  outOfStock,
  selected = false,
  size = "default",
  onClick,
}: {
  label: string;
  outOfStock: boolean;
  selected?: boolean;
  size?: "default" | "sm";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={onClick}
      className={cn(
        "hover-lift rounded-full border font-medium",
        size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
        outOfStock
          ? "cursor-not-allowed border-border text-muted-foreground/40 line-through"
          : selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-foreground hover:scale-105 hover:border-primary/50"
      )}
    >
      {label}
    </button>
  );
}
