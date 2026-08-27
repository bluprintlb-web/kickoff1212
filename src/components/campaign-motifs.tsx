import Image from "next/image";
import {
  CAMPAIGN_LOGO,
  CAMPAIGN_MOTIF_ICON,
  MOTIF_ANIMATION,
  type MotifSlot,
} from "@/lib/campaign-visuals";
import type { Campaign } from "@/lib/football-events";
import { cn } from "@/lib/utils";

// Floating decorative motifs for an active campaign (snow falling for
// Christmas, stars twinkling for Champions League, the real crest drifting
// for La Liga, etc.) — reused across every themed surface (banner,
// header/footer trim, hero) so the same event reads consistently sitewide
// instead of being confined to one strip. Uses the campaign's real logo
// (CAMPAIGN_LOGO) when one exists, same as CampaignIcon's badge treatment —
// per the user's explicit call, the real crest belongs here too, not just
// the one-off banner/hero badge.
export function CampaignMotifs({
  campaign,
  slots,
  iconClassName,
  className,
}: {
  campaign: Campaign;
  slots: MotifSlot[];
  iconClassName?: string;
  className?: string;
}) {
  const logo = CAMPAIGN_LOGO[campaign.id];
  const MotifIcon = CAMPAIGN_MOTIF_ICON[campaign.id];

  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {slots.map((slot, i) => {
        const style = {
          left: slot.left,
          top: slot.top ?? "50%",
          animation: `${MOTIF_ANIMATION[campaign.motif]} ${slot.duration} ease-in-out ${slot.delay} infinite`,
        };
        return logo ? (
          <Image
            key={i}
            src={logo.src}
            alt=""
            width={64}
            height={64}
            className={cn(
              "absolute size-4 object-contain opacity-80",
              logo.monochrome && "brightness-0 invert",
              iconClassName
            )}
            style={style}
          />
        ) : (
          <MotifIcon
            key={i}
            className={cn("absolute size-4 text-white/70", iconClassName)}
            style={style}
          />
        );
      })}
    </span>
  );
}
