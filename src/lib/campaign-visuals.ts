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

// Real competition crest, used in place of CAMPAIGN_ICON wherever a
// campaign has one (currently only La Liga — the file is public-domain per
// Wikimedia Commons, but the crest itself is still a La Liga trademark; see
// CampaignIcon's usage sites). Motif particles (CAMPAIGN_MOTIF_ICON below)
// intentionally keep the plain lucide icon instead — a real crest repeated
// as tiny bouncing decoration would look cheap and multiplies the
// trademark-use surface for no real benefit.
export const CAMPAIGN_LOGO: Partial<Record<CampaignId, { src: string; alt: string }>> = {
  "la-liga": { src: "/brand/laliga-logo.svg", alt: "La Liga" },
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

// Kept to the section's own top/bottom padding strips (outside the
// headline/body text and the product photo, both of which sit in the
// vertical middle of the hero) — now that these render as the real La Liga
// crest at a much bigger size (see CampaignMotifs), the old spread-across-
// the-whole-hero positions visibly overlapped the headline and body copy.
export const HERO_MOTIF_SLOTS: MotifSlot[] = [
  { left: "6%", top: "6%", delay: "0s", duration: "4.2s" },
  { left: "24%", top: "94%", delay: "1.3s", duration: "3.6s" },
  { left: "42%", top: "5%", delay: "0.6s", duration: "3.9s" },
  { left: "58%", top: "95%", delay: "2s", duration: "4.6s" },
  { left: "12%", top: "95%", delay: "0.9s", duration: "3.4s" },
  { left: "74%", top: "6%", delay: "1.7s", duration: "4.1s" },
  { left: "90%", top: "93%", delay: "0.3s", duration: "3.8s" },
  { left: "96%", top: "7%", delay: "1.1s", duration: "4.4s" },
];
