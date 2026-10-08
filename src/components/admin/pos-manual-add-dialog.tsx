"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { variantLabel, VariantPill } from "@/components/variant-pill";
import type { Money } from "@/lib/pricing";
import { trpc } from "@/trpc/react";

export type PickableVariant = {
  id: string;
  stock: number;
  size: string | null;
  color: string | null;
  priceOverride: Money;
  product: { name: string; basePrice: Money; salePrice: Money };
};

// Barcode scanning is the fast path, but not every item has a barcode
// handy at the register — this is the fallback: search by name, then pick
// a variant, same out-of-stock-but-visible treatment as the storefront's
// AddToCart pills. Stays open after each add so a cashier can add several
// items in a row without reopening it.
export function PosManualAddDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (variant: PickableVariant) => void;
}) {
  const [search, setSearch] = useState("");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  // sellable, not the public list — archived products can still have stock
  // to sell off at POS, and the storefront's isActive filter would hide them.
  const { data: products } = trpc.product.sellable.useQuery(undefined, {
    enabled: open,
  });

  const matches = (products ?? []).filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  function pick(product: (typeof matches)[number], variant: (typeof matches)[number]["variants"][number]) {
    onAdd({
      id: variant.id,
      stock: variant.stock,
      size: variant.size,
      color: variant.color,
      priceOverride: variant.priceOverride,
      product: { name: product.name, basePrice: product.basePrice, salePrice: product.salePrice },
    });
    toast.success(`${product.name}${variant.size || variant.color ? ` (${variantLabel(variant, "")})` : ""} added`);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setSearch("");
          setExpandedProductId(null);
        }
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add item manually</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex max-h-[55vh] flex-col gap-1 overflow-y-auto">
          {matches.length === 0 && (
            <p className="px-1 py-6 text-center text-sm text-muted-foreground">
              No products match &quot;{search}&quot;.
            </p>
          )}
          {matches.map((product) => {
            const singleVariant =
              product.variants.length === 1 ? product.variants[0] : null;
            const expanded = expandedProductId === product.id;
            return (
              <div key={product.id} className="rounded-md border">
                <button
                  type="button"
                  disabled={singleVariant ? singleVariant.stock <= 0 : false}
                  onClick={() =>
                    singleVariant
                      ? pick(product, singleVariant)
                      : setExpandedProductId(expanded ? null : product.id)
                  }
                  className="flex w-full items-center justify-between px-3 py-2.5 text-start text-sm font-medium hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {product.name}
                  {singleVariant && (
                    <span className="text-xs font-normal text-muted-foreground">
                      Stock: {singleVariant.stock}
                    </span>
                  )}
                </button>
                {expanded && !singleVariant && (
                  <div className="flex flex-wrap gap-2 border-t px-3 py-2.5">
                    {product.variants.map((variant) => (
                      <VariantPill
                        key={variant.id}
                        label={`${variantLabel(variant, "Default")} (${variant.stock})`}
                        outOfStock={variant.stock === 0}
                        size="sm"
                        onClick={() => pick(product, variant)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
