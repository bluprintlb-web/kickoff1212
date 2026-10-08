import Link from "next/link";
import { CampaignMotifs } from "@/components/campaign-motifs";
import { Logo } from "@/components/logo";
import { TRIM_MOTIF_SLOTS } from "@/lib/campaign-visuals";
import { getActiveCampaign } from "@/lib/football-events";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { PRODUCT_CATEGORIES } from "@/lib/product-category";

export async function SiteFooter() {
  const locale = await getLocale();
  const dict = dictionaries[locale];
  // Same active campaign as SiteHeader's trim strip — bookends every
  // storefront page with the theme instead of only showing up at the top.
  const campaign = getActiveCampaign();

  return (
    <footer className="border-t-2 border-accent bg-surface-brand text-surface-brand-foreground">
      {campaign && (
        <div
          className="relative h-1.5 overflow-hidden"
          style={{ background: campaign.gradient }}
        >
          <CampaignMotifs
            campaign={campaign}
            slots={TRIM_MOTIF_SLOTS}
            iconClassName="size-2 text-white/60"
          />
        </div>
      )}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <Logo size="lg" />
          <p className="max-w-xs text-sm text-surface-brand-foreground/60">
            {dict.footer.tagline}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            {dict.footer.shop}
          </p>
          <nav className="flex flex-col gap-2">
            {PRODUCT_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="hover-underline w-fit text-sm text-surface-brand-foreground/60 transition-colors hover:text-accent"
              >
                {dict.categories[category]}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            {dict.footer.store}
          </p>
          <div className="flex flex-col gap-2 text-sm text-surface-brand-foreground/60">
            <p>{dict.footer.basedInLebanon}</p>
            <p>{dict.footer.onlineInStore}</p>
            <p>{dict.footer.payment}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs tracking-wide text-surface-brand-foreground/50 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Kick Off. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
