import Image from "next/image";
import type { CampaignId } from "@/lib/football-events";
import { CAMPAIGN_ICON, CAMPAIGN_LOGO } from "@/lib/campaign-visuals";
import { cn } from "@/lib/utils";

// Renders a campaign's real crest (CAMPAIGN_LOGO) when one exists, falling
// back to the plain lucide glyph (CAMPAIGN_ICON) otherwise — one call site
// so campaign-banner.tsx and the homepage hero badge don't each need their
// own image-vs-icon branching.
export function CampaignIcon({
  campaignId,
  className,
}: {
  campaignId: CampaignId;
  className?: string;
}) {
  const logo = CAMPAIGN_LOGO[campaignId];
  if (logo) {
    return (
      <Image
        src={logo.src}
        alt={logo.alt}
        width={32}
        height={32}
        aria-hidden
        className={cn("object-contain", logo.monochrome && "brightness-0 invert", className)}
      />
    );
  }

  const Icon = CAMPAIGN_ICON[campaignId];
  return <Icon aria-hidden className={className} />;
}
