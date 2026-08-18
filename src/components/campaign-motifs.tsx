import { CAMPAIGN_MOTIF_ICON, MOTIF_ANIMATION, type MotifSlot } from "@/lib/campaign-visuals";
import type { Campaign } from "@/lib/football-events";
import { cn } from "@/lib/utils";

// Floating decorative icons for an active campaign (snow falling for
// Christmas, stars twinkling for Champions League, etc.) — reused across
// every themed surface (banner, header/footer trim, hero) so the same
// event reads consistently sitewide instead of being confined to one strip.
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
  const MotifIcon = CAMPAIGN_MOTIF_ICON[campaign.id];

  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {slots.map((slot, i) => (
        <MotifIcon
          key={i}
          className={cn("absolute size-3 text-white/70", iconClassName)}
          style={{
            left: slot.left,
            top: slot.top ?? "50%",
            animation: `${MOTIF_ANIMATION[campaign.motif]} ${slot.duration} ease-in-out ${slot.delay} infinite`,
          }}
        />
      ))}
    </span>
  );
}
