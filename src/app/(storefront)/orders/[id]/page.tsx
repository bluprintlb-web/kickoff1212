import { CheckCircle2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductImage } from "@/components/product-image";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { formatLBP } from "@/lib/currency";
import { verifySession } from "@/lib/dal";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { productName } from "@/lib/i18n/product-name";
import type { ProductCategoryValue } from "@/lib/product-category";
import { trpcCaller } from "@/trpc/server";

const STATUS_TONE: Record<string, string> = {
  PENDING: "border-transparent bg-amber-500/15 text-amber-600",
  PAID: "border-transparent bg-brand/10 text-brand",
  SHIPPED: "border-transparent bg-brand/10 text-brand",
  DELIVERED: "border-transparent bg-brand/10 text-brand",
  CANCELLED: "border-transparent bg-destructive/10 text-destructive",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifySession();
  const { id } = await params;
  const [trpc, locale] = await Promise.all([trpcCaller(), getLocale()]);
  const order = await trpc.order.byId({ id });
  const dict = dictionaries[locale].orderConfirmation;
  const checkoutDict = dictionaries[locale].checkout;
  const total = Number(order.total);
  const paymentMethodLabel: Record<string, string> = {
    WHISH: checkoutDict.whish,
    CARD: checkoutDict.card,
    CASH: checkoutDict.cashOnDelivery,
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <CheckCircle2 className="size-6" />
        </div>
        <h1 className="font-display text-3xl tracking-wide">{dict.title}</h1>
        <p className="text-sm text-muted-foreground">
          {dict.order} #{order.id}
        </p>
      </div>

      <Card className="gap-0 divide-y py-0">
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-sm text-muted-foreground">{dict.status}</span>
          <Badge className={STATUS_TONE[order.status] ?? ""}>{order.status}</Badge>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-sm text-muted-foreground">
            {dict.paymentMethod}
          </span>
          <span className="font-medium">
            {order.paymentMethod
              ? (paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod)
              : "—"}
          </span>
        </div>

        <div className="flex flex-col divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <ProductImage
                  src={item.variant?.product.images[0]}
                  alt=""
                  icon={
                    item.variant
                      ? CATEGORY_ICONS[item.variant.product.category as ProductCategoryValue]
                      : Package
                  }
                  className="size-12 shrink-0 border"
                  iconClassName="size-5"
                  sizes="48px"
                />
                <span className="truncate text-sm">
                  {item.variant ? (
                    <>
                      {productName(item.variant.product, locale)}
                      {item.variant.size ? ` (${item.variant.size})` : ""}
                    </>
                  ) : (
                    dict.itemUnavailable
                  )}{" "}
                  × {item.quantity}
                </span>
              </div>
              <span className="shrink-0 text-sm font-medium">
                ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold">{dict.total}</span>
          <div className="text-end">
            <p className="text-lg font-semibold text-brand">
              ${total.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">{formatLBP(total)}</p>
          </div>
        </div>
      </Card>

      {order.status === "PENDING" && (
        <p className="text-center text-sm text-muted-foreground">
          {order.paymentMethod === "CASH" ? dict.cashPendingNotice : dict.pendingNotice}
        </p>
      )}
    </div>
  );
}
