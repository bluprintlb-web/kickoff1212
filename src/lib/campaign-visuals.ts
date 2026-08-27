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
// campaign has one — La Liga, UEFA Champions League, and the 2026 FIFA
// World Cup emblem, all sourced from Wikimedia Commons the same way (listed
// public-domain for copyright there, but each mark is still a real
// trademark of its federation; see CampaignIcon's usage sites, and the
// 2026-08-26 decision note in CONTEXT_HANDOFF.md). Christmas has no
// corresponding entry — it's a holiday, not a brand with a mark to source.
// Motif particles (CAMPAIGN_MOTIF_ICON below) intentionally keep the plain
// lucide icon instead — a real crest repeated as tiny bouncing decoration
// would look cheap and multiplies the trademark-use surface for no real
// benefit.
export const CAMPAIGN_LOGO: Partial<
  Record<CampaignId, { src: string; alt: string; monochrome?: boolean }>
> = {
  "la-liga": { src: "/brand/laliga-logo.svg", alt: "La Liga" },
  "champions-league": {
    src: "/brand/champions-league-logo.svg",
    alt: "UEFA Champions League",
    // The Commons-sourced starball mark is a single flat dark-navy fill —
    // CampaignIcon/CampaignMotifs render it white via a CSS filter so it
    // reads against the campaign's own navy gradient instead of blending
    // into it. La Liga/World Cup are already multicolor, so they don't
    // need this.
    monochrome: true,
  },
  "world-cup": { src: "/brand/world-cup-logo.svg", alt: "FIFA World Cup 2026" },
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
