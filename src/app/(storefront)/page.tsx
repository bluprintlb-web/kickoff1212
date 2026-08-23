import {
  Crown,
  Flag,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Shirt,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CampaignIcon } from "@/components/campaign-icon";
import { CampaignMotifs } from "@/components/campaign-motifs";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { CAMPAIGN_COPY_KEY, HERO_MOTIF_SLOTS } from "@/lib/campaign-visuals";
import { formatLBP } from "@/lib/currency";
import { getActiveCampaign } from "@/lib/football-events";
import {
  FAN_FAVORITE_IMAGES,
  HERO_IMAGE,
  STORY_IMAGE,
} from "@/lib/homepage-stock-images";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { trpcCaller } from "@/trpc/server";

// Homepage marketing tiles (not the real 7-category catalog — see
// CONTEXT_HANDOFF.md "Content scope" decision). "Boots" has no matching
// real category yet, so it links to the unfiltered catalog instead of a
// dead filter.
const ARCHIVE_CATEGORIES = [
  { key: "retroJerseys", icon: ShoppingBag, href: "/products?category=JERSEY" },
  { key: "trainingKits", icon: Shirt, href: "/products?category=JERSEY" },
  { key: "boots", icon: Flag, href: "/products" },
  { key: "accessories", icon: Crown, href: "/products?category=BALL" },
] as const;

const AUTHENTICITY_ITEMS = [
  { key: "crests", icon: Crown },
  { key: "fabric", icon: Leaf },
  { key: "fit", icon: ShieldCheck },
  { key: "restoration", icon: ShoppingBag },
] as const;

function FanFavoriteCard({
  name,
  badge,
  price,
  image,
}: {
  name: string;
  badge: string;
  price: number;
  image: string;
}) {
  return (
    <Link
      href="/products?category=JERSEY"
      className="hover-lift group block overflow-hidden rounded-xl border bg-card hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="hover-lift object-cover group-hover:scale-105"
        />
        <span className="font-display absolute start-3 top-3 rounded-md bg-accent px-2.5 py-1 text-sm text-accent-foreground uppercase shadow">
          {badge}
        </span>
        <span className="absolute end-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow">
          <ShoppingBag className="size-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <p className="leading-snug font-medium">{name}</p>
        <p className="text-lg font-semibold text-brand">${price}</p>
        <p className="text-xs text-muted-foreground">{formatLBP(price)}</p>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [trpc, locale] = await Promise.all([trpcCaller(), getLocale()]);
  const products = await trpc.product.list();
  const dict = dictionaries[locale];
  // Same active campaign as the promo bar/header/footer trim — the hero is
  // the one surface with enough room to actually feel themed, not just
  // trimmed, so it gets a gradient wash, motifs, and its own badge line.
  const campaign = getActiveCampaign();

  const favorites: {
    key: keyof typeof FAN_FAVORITE_IMAGES;
    price: number;
  }[] = [
    { key: "milanoRossoneri", price: 98 },
    { key: "azzurriAway", price: 94 },
    { key: "azzurriThird", price: 92 },
    { key: "albicelesteLegend", price: 120 },
    { key: "selecaoAway", price: 89 },
    { key: "threeLions", price: 95 },
  ];

  return (
    <div className="flex w-full flex-1 flex-col">
      <section className="relative overflow-hidden border-b bg-surface-brand text-surface-brand-foreground">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklch,var(--accent),transparent_80%),transparent_60%)]"
        />
        {campaign && (
          <div
            aria-hidden
            className="absolute inset-0 opacity-25"
            style={{ background: campaign.gradient }}
          />
        )}
        {campaign && <CampaignMotifs campaign={campaign} slots={HERO_MOTIF_SLOTS} iconClassName="size-10 text-white/50" />}
        <div className="animate-in fade-in slide-in-from-bottom-4 relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 duration-700 sm:py-20 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-5">
            {campaign && (
              <span
                className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase"
                style={{ background: campaign.gradient }}
              >
                <CampaignIcon campaignId={campaign.id} className="size-5 shrink-0" />
                {dict.campaigns[CAMPAIGN_COPY_KEY[campaign.id]]}
              </span>
            )}
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-accent uppercase">
              <Flag className="size-3.5 shrink-0" aria-hidden />
              {dict.hero.archiveBadge}
            </span>
            <h1 className="font-display text-7xl leading-[0.95] tracking-wide sm:text-8xl">
              {dict.hero.titleLine1}
              <br />
              <span className="text-accent">{dict.hero.titleHighlight}</span>
            </h1>
            <p className="max-w-xl text-lg text-surface-brand-foreground/70">
              {dict.hero.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/products">
                <Button variant="accent" size="lg" className="hover:scale-105">
                  {dict.hero.shopAll}
                </Button>
              </Link>
              <Link href="#story">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-surface-brand-foreground/25 bg-transparent text-surface-brand-foreground hover:scale-105 hover:bg-white/10 hover:text-surface-brand-foreground"
                >
                  {dict.hero.browseCategories}
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
            <span className="font-display absolute start-4 top-4 rounded-md bg-accent px-3 py-1 text-lg text-accent-foreground shadow">
              No. 10
            </span>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto flex w-full max-w-6xl scroll-mt-16 flex-col gap-5 px-4 py-16 sm:py-20">
        <div>
          <h2 className="font-display text-3xl tracking-wide">
            {dict.categoriesSection.heading}
          </h2>
          <p className="text-sm text-muted-foreground">
            {dict.categoriesSection.subheading}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ARCHIVE_CATEGORIES.map(({ key, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              className="group hover-lift flex flex-col items-center gap-3 rounded-xl border bg-gradient-to-br from-accent/10 to-brand/5 px-4 py-7 text-center hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/25"
            >
              <div className="hover-lift flex size-12 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground group-hover:scale-110 group-hover:rotate-6 group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="size-6" />
              </div>
              <span className="text-sm font-medium">
                {dict.categoriesSection[key]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-gradient-to-r from-accent/10 via-brand/5 to-accent/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:py-20">
          <div>
            <h2 className="font-display text-3xl tracking-wide">
              {dict.fanFavorites.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {favorites.map(({ key, price }) => (
              <FanFavoriteCard
                key={key}
                name={dict.fanFavorites.items[key].name}
                badge={dict.fanFavorites.items[key].badge}
                price={price}
                image={FAN_FAVORITE_IMAGES[key]}
              />
            ))}
          </div>
          <Link href="/products?category=JERSEY" className="mx-auto">
            <Button variant="outline" size="lg" className="hover:scale-105">
              {dict.fanFavorites.viewArchive}
            </Button>
          </Link>
        </div>
      </section>

      <section id="story" className="mx-auto flex w-full max-w-6xl scroll-mt-16 flex-col items-center gap-10 px-4 py-16 sm:py-20 lg:flex-row">
        <div className="relative aspect-[3/4] w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border">
          <Image
            src={STORY_IMAGE}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, 90vw"
            className="object-cover grayscale"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-3xl tracking-wide sm:text-4xl">
            {dict.story.heading}
          </h2>
          <p className="max-w-xl text-muted-foreground">{dict.story.body}</p>
          <div className="flex flex-wrap gap-8 pt-2">
            <div>
              <p className="text-3xl font-bold text-brand">1,200+</p>
              <p className="text-sm text-muted-foreground">{dict.story.statsArchived}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand">80+</p>
              <p className="text-sm text-muted-foreground">{dict.story.statsClubs}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand">12</p>
              <p className="text-sm text-muted-foreground">{dict.story.statsYears}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14">
          <h2 className="font-display text-center text-2xl tracking-wide">
            {dict.authenticity.heading}
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {AUTHENTICITY_ITEMS.map(({ key, icon: Icon }) => (
              <div key={key} className="flex flex-col items-center gap-2 text-center">
                <div className="hover-lift flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
                  <Icon className="size-6" />
                </div>
                <span className="text-sm font-medium">
                  {dict.authenticity[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex-1 bg-gradient-to-b from-brand/5 via-transparent to-transparent">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-16 sm:py-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {dict.latestProducts.heading}
            </h2>
            <p className="text-sm text-muted-foreground">
              {dict.latestProducts.subheading}
            </p>
          </div>
          {products.length === 0 ? (
            <p className="text-muted-foreground">{dict.latestProducts.empty}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
