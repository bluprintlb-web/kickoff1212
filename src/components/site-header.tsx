import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { AccountMenu } from "@/components/account-menu";
import { CampaignMotifs } from "@/components/campaign-motifs";
import { CartMenu } from "@/components/cart-menu";
import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import { SocialLinks } from "@/components/social-icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { TRIM_MOTIF_SLOTS } from "@/lib/campaign-visuals";
import { getActiveCampaign } from "@/lib/football-events";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  PRODUCT_CATEGORIES,
  type ProductCategoryValue,
} from "@/lib/product-category";
import { trpcCaller } from "@/trpc/server";

type MenuNode = {
  href: string;
  label: string;
  children?: MenuNode[];
};

const dropdownRowClass =
  "hover-lift flex items-center justify-between gap-3 px-3 py-2 text-xs font-normal tracking-normal whitespace-nowrap uppercase hover:bg-accent/15 hover:text-accent-foreground";

function DropdownRow({ node }: { node: MenuNode }) {
  if (!node.children?.length) {
    return (
      <Link href={node.href} className={dropdownRowClass}>
        {node.label}
      </Link>
    );
  }

  return (
    <div className="group/item relative">
      <Link href={node.href} className={dropdownRowClass}>
        {node.label}
        <ChevronRight className="size-3 shrink-0 opacity-50 rtl:rotate-180" />
      </Link>
      <div className="hover-lift invisible absolute top-0 start-full z-30 w-44 scale-95 rounded-md border border-border bg-popover py-1 text-popover-foreground opacity-0 shadow-lg group-hover/item:visible group-hover/item:scale-100 group-hover/item:opacity-100">
        {node.children.map((child) => (
          <DropdownRow key={child.href} node={child} />
        ))}
      </div>
    </div>
  );
}

function CategoryDropdown({
  category,
  label,
  items,
}: {
  category: ProductCategoryValue;
  label: string;
  items: MenuNode[];
}) {
  return (
    <div className="group relative">
      <Link
        href={`/products?category=${category}`}
        className="hover-lift -mx-2.5 -my-1 rounded-full px-2.5 py-1 whitespace-nowrap hover:-translate-y-0.5 hover:bg-accent/15 hover:text-accent"
      >
        {label}
      </Link>
      <div className="hover-lift invisible absolute top-full start-0 z-20 w-48 origin-top -translate-y-1 scale-95 rounded-md border border-border bg-popover py-1 text-popover-foreground opacity-0 shadow-lg group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        {items.map((item) => (
          <DropdownRow key={item.href} node={item} />
        ))}
      </div>
    </div>
  );
}

export async function SiteHeader() {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const dict = dictionaries[locale];
  // Same active campaign the promo bar themes itself around (see
  // CampaignBanner) — the header picks up a thin themed trim strip below it
  // so the event reads sitewide, not just in that one strip.
  const campaign = getActiveCampaign();

  let cartCount = 0;
  if (session?.user) {
    // A session cookie can briefly outlive the account behind it (see
    // cart.ts's staleSessionOrRethrow) — the header renders on every
    // storefront page, so a stale-session error here shouldn't take the
    // whole page down over a cart badge count.
    const trpc = await trpcCaller();
    const cart = await trpc.cart.get().catch(() => null);
    cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  }

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-surface-brand text-surface-brand-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <AccountMenu
            locale={locale}
            isLoggedIn={!!session?.user}
            isAdmin={session?.user?.role === "ADMIN"}
          />
          <Link href="/" className="text-surface-brand-foreground">
            <Logo size="lg" />
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-base font-medium text-surface-brand-foreground/75 sm:gap-4">
          <Link
            href="/products"
            className="hidden hover-underline hover-lift hover:text-accent sm:inline"
          >
            {dict.nav.shop}
          </Link>
          <CartMenu
            initialCount={cartCount}
            locale={locale}
            isLoggedIn={!!session?.user}
          />
          <SocialLinks
            variant="circle"
            label={dict.footer.followUs}
            className="hidden text-surface-brand-foreground/75 sm:flex"
          />
          <LanguageToggle
            locale={locale}
            className="hidden border-white/15 bg-white/5 text-surface-brand-foreground sm:flex"
          />
          <ThemeToggle
            labels={dict.themeToggle}
            locale={locale}
            className="hidden border-white/15 bg-white/5 text-surface-brand-foreground sm:flex"
          />
          {!session?.user && (
            <>
              <Link href="/login" className="hidden sm:inline-block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-surface-brand-foreground/75 hover:bg-white/10 hover:text-surface-brand-foreground"
                >
                  {dict.nav.logIn}
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:inline-block">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white bg-white text-black hover:bg-white/90 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
                >
                  {dict.auth.signUp}
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="border-t border-white/10 bg-[color-mix(in_oklch,var(--surface-brand),black_15%)]">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 text-xs font-medium tracking-wide text-surface-brand-foreground/65 uppercase sm:flex-nowrap sm:gap-5">
          {PRODUCT_CATEGORIES.map((category) => {
            if (category === "JERSEY") {
              return (
                <CategoryDropdown
                  key={category}
                  category={category}
                  label={dict.categories[category]}
                  items={[
                    {
                      href: `/products?category=${category}&type=fan`,
                      label: dict.jerseyMenu.fan,
                    },
                    {
                      href: `/products?category=${category}&type=player`,
                      label: dict.jerseyMenu.player,
                    },
                  ]}
                />
              );
            }
            if (category === "TROPHY") {
              return (
                <CategoryDropdown
                  key={category}
                  category={category}
                  label={dict.categories[category]}
                  items={[
                    {
                      href: `/products?category=${category}&type=world-cup`,
                      label: dict.trophyMenu.worldCup,
                    },
                    {
                      href: `/products?category=${category}&type=champions-league`,
                      label: dict.trophyMenu.championsLeague,
                    },
                    {
                      href: `/products?category=${category}&type=small`,
                      label: dict.trophyMenu.small,
                    },
                  ]}
                />
              );
            }
            if (category === "GLOVES") {
              const boneChildren = (size: string) => [
                {
                  href: `/products?category=${category}&size=${size}&type=with-bones`,
                  label: dict.glovesMenu.withBones,
                },
                {
                  href: `/products?category=${category}&size=${size}&type=without-bones`,
                  label: dict.glovesMenu.withoutBones,
                },
              ];
              return (
                <CategoryDropdown
                  key={category}
                  category={category}
                  label={dict.categories[category]}
                  items={[
                    {
                      href: `/products?category=${category}&size=kids`,
                      label: dict.glovesMenu.kids,
                      children: boneChildren("kids"),
                    },
                    {
                      href: `/products?category=${category}&size=mens`,
                      label: dict.glovesMenu.mens,
                      children: boneChildren("mens"),
                    },
                  ]}
                />
              );
            }
            if (category === "BODYWEAR") {
              return (
                <CategoryDropdown
                  key={category}
                  category={category}
                  label={dict.categories[category]}
                  items={[
                    {
                      href: `/products?category=${category}&type=leggings`,
                      label: dict.bodywearMenu.leggings,
                    },
                    {
                      href: `/products?category=${category}&type=body`,
                      label: dict.bodywearMenu.body,
                    },
                  ]}
                />
              );
            }
            if (category === "SHIN_PADS") {
              return (
                <CategoryDropdown
                  key={category}
                  category={category}
                  label={dict.categories[category]}
                  items={[
                    {
                      href: `/products?category=${category}&type=big`,
                      label: dict.shinPadsMenu.big,
                    },
                    {
                      href: `/products?category=${category}&type=small`,
                      label: dict.shinPadsMenu.small,
                    },
                  ]}
                />
              );
            }
            if (category === "SOCKS") {
              const typeChildren = (length: string) => [
                {
                  href: `/products?category=${category}&length=${length}&type=grip`,
                  label: dict.socksMenu.grip,
                },
                {
                  href: `/products?category=${category}&length=${length}&type=normal`,
                  label: dict.socksMenu.normal,
                },
              ];
              return (
                <CategoryDropdown
                  key={category}
                  category={category}
                  label={dict.categories[category]}
                  items={[
                    {
                      href: `/products?category=${category}&length=tall`,
                      label: dict.socksMenu.tall,
                      children: typeChildren("tall"),
                    },
                    {
                      href: `/products?category=${category}&length=short`,
                      label: dict.socksMenu.short,
                      children: typeChildren("short"),
                    },
                  ]}
                />
              );
            }
            return (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="hover-lift -mx-2.5 -my-1 rounded-full px-2.5 py-1 whitespace-nowrap hover:-translate-y-0.5 hover:bg-accent/15 hover:text-accent"
              >
                {dict.categories[category]}
              </Link>
            );
          })}
        </nav>
      </div>
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
    </header>
  );
}
