import { Shield, Snowflake, Sparkle, Star, Trophy } from "lucide-react";
import type { Campaign, CampaignId } from "@/lib/football-events";

// Shared icon/copy/animation lookups for every place campaign theming shows
// up (banner, header trim, hero, footer trim) — kept in one place so all of
// them stay in sync with src/lib/football-events.ts's CampaignId union.

export const CAMPAIGN_ICON: Record<CampaignId, typeof Trophy> = {
  christmas: Snowflake,
  "world-cup": Trophy,
  "champions-league": Star,
  "la-liga": Shield,
};

export const CAMPAIGN_MOTIF_ICON: Record<CampaignId, typeof Trophy> = {
  christmas: Snowflake,
  "world-cup": Sparkle,
  "champions-league": Star,
  "la-liga": Shield,
};

export const CAMPAIGN_COPY_KEY: Record<
  CampaignId,
  "christmas" | "worldCup" | "championsLeague" | "laLiga"
> = {
  christmas: "christmas",
  "world-cup": "worldCup",
  "champions-league": "championsLeague",
  "la-liga": "laLiga",
};

export const MOTIF_ANIMATION: Record<Campaign["motif"], string> = {
  fall: "kickoff-motif-fall",
  twinkle: "kickoff-motif-twinkle",
  bounce: "kickoff-motif-bounce",
};

export type MotifSlot = {
  left: string;
  top?: string;
  delay: string;
  duration: string;
};

// Fixed spread, each on its own delay/duration so they don't move in
// lockstep. Three densities for three different surfaces: a thin bar (the
// promo banner or a header/footer trim strip) only needs a few, low-key
// dots; the hero has real vertical room to actually feel themed.
export const BANNER_MOTIF_SLOTS: MotifSlot[] = [
  { left: "8%", delay: "0s", duration: "3.2s" },
  { left: "24%", delay: "0.6s", duration: "2.6s" },
  { left: "62%", delay: "1.1s", duration: "3.6s" },
  { left: "78%", delay: "0.3s", duration: "2.9s" },
  { left: "92%", delay: "1.6s", duration: "3.1s" },
];

export const TRIM_MOTIF_SLOTS: MotifSlot[] = [
  { left: "15%", delay: "0.2s", duration: "3.4s" },
  { left: "50%", delay: "1.2s", duration: "2.8s" },
  { left: "85%", delay: "0.7s", duration: "3.1s" },
];

export const HERO_MOTIF_SLOTS: MotifSlot[] = [
  { left: "6%", top: "20%", delay: "0s", duration: "4.2s" },
  { left: "16%", top: "70%", delay: "1.3s", duration: "3.6s" },
  { left: "30%", top: "38%", delay: "0.6s", duration: "3.9s" },
  { left: "48%", top: "80%", delay: "2s", duration: "4.6s" },
  { left: "62%", top: "22%", delay: "0.9s", duration: "3.4s" },
  { left: "74%", top: "60%", delay: "1.7s", duration: "4.1s" },
  { left: "88%", top: "35%", delay: "0.3s", duration: "3.8s" },
  { left: "94%", top: "75%", delay: "1.1s", duration: "4.4s" },
];
