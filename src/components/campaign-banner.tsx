import { CampaignMotifs } from "@/components/campaign-motifs";
import { getActiveCampaign } from "@/lib/football-events";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";
import {
  BANNER_MOTIF_SLOTS,
  CAMPAIGN_COPY_KEY,
  CAMPAIGN_ICON,
} from "@/lib/campaign-visuals";

// Whenever a known football event/holiday is active (see
// src/lib/football-events.ts), the storefront's top strip themes itself
// instead of showing the plain promo tagline — same slot, so it never adds
// extra vertical clutter above the header. This is one of several themed
// surfaces when a campaign is active (see also SiteHeader/SiteFooter's trim
// and the homepage hero) — not the only one.
export function CampaignBanner({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  const campaign = getActiveCampaign();

  if (!campaign) {
    return (
      <div className="bg-secondary px-4 py-2 text-center text-xs font-medium tracking-wide text-secondary-foreground">
        {dict.promoBar}
      </div>
    );
  }

  const Icon = CAMPAIGN_ICON[campaign.id];
  const copy = dict.campaigns[CAMPAIGN_COPY_KEY[campaign.id]];

  return (
    <div
      className="relative overflow-hidden px-4 py-2 text-center text-xs font-semibold tracking-wide text-white"
      style={{ background: campaign.gradient }}
    >
      <CampaignMotifs campaign={campaign} slots={BANNER_MOTIF_SLOTS} />
      <span className="relative inline-flex items-center gap-1.5">
        <Icon className="size-3.5 shrink-0" />
        {copy}
      </span>
    </div>
  );
}
