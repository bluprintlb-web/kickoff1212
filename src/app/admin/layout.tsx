import { ArrowLeft, PackagePlus, ScanBarcode } from "lucide-react";
import Link from "next/link";
import { PushNotificationsButton } from "@/components/admin/push-notifications-button";
import { AdminTopNav } from "@/components/admin/top-nav";
import { Logo } from "@/components/logo";
import { PwaRegister } from "@/components/pwa-register";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/dal";

// Same "outline on a black bar" treatment as the storefront header's
// language/theme toggles (see site-header.tsx) — the plain `outline`
// variant assumes a light `bg-background`, which reads wrong against the
// fixed-black `bg-surface-brand` bar below.
const HEADER_OUTLINE_CLASS =
  "border-white/15 bg-white/5 text-surface-brand-foreground hover:bg-white/10 hover:text-surface-brand-foreground";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    // Admin is permanently dark (forces the .dark class regardless of the
    // storefront's light/dark toggle) — it reads the same shared tokens as
    // the storefront's dark mode (see globals.css) rather than a separate
    // palette, so no per-component changes are needed here. The header bar
    // itself uses --surface-brand (fixed black in both modes), the same
    // token the storefront header/footer/hero use, so the "Kick Off" brand
    // band looks identical across the whole site.
    <div className="dark flex min-h-full flex-1 flex-col bg-background text-foreground">
      <header className="border-b border-black/10 bg-surface-brand text-surface-brand-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Logo />
            <p className="hidden text-xs text-surface-brand-foreground/60 sm:block">
              Admin · Inventory · Sales · Stock
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <PushNotificationsButton className={HEADER_OUTLINE_CLASS} />
            <PwaRegister className={HEADER_OUTLINE_CLASS} />
            <Link href="/admin/products/new">
              <Button
                type="button"
                variant="accent"
                size="sm"
                title="Scan to add product"
              >
                <PackagePlus className="size-4" />
                <span className="hidden sm:inline">Scan to add</span>
              </Button>
            </Link>
            <Link href="/admin/pos">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={HEADER_OUTLINE_CLASS}
                title="Scan to sell (POS)"
              >
                <ScanBarcode className="size-4" />
                <span className="hidden sm:inline">Scan to sell</span>
              </Button>
            </Link>
            <Link
              href="/"
              title="Back to store"
              className="flex size-8 items-center justify-center rounded-lg text-surface-brand-foreground/60 transition-colors hover:bg-white/10 hover:text-surface-brand-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10 bg-[color-mix(in_oklch,var(--surface-brand),black_15%)]">
          <div className="mx-auto w-full max-w-7xl overflow-x-auto px-4 sm:px-6">
            <AdminTopNav />
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
