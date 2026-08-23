// Homepage-only placeholder photography (hero, "Fan Favorites" demo cards,
// story section) — hotlinked from Unsplash. Stands in for real product
// photography until Cloudinary is wired up (see CONTEXT_HANDOFF.md); every
// URL below was verified to resolve before use, not guessed blind.
function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80`;
}

export const HERO_IMAGE = unsplash("1518091043644-c1d4457512c6"); // World Cup trophy + ball on grass
export const STORY_IMAGE = unsplash("1577223625816-7546f13df25d"); // stadium tunnel, desaturated via CSS

export const FAN_FAVORITE_IMAGES = {
  milanoRossoneri: unsplash("1517747614396-d21a78b850e8"),
  azzurriAway: unsplash("1631729371254-42c2892f0e6e"),
  azzurriThird: unsplash("1579952363873-27f3bade9f55"),
  albicelesteLegend: unsplash("1552667466-07770ae110d0"),
  selecaoAway: unsplash("1522778119026-d647f0596c20"),
  threeLions: unsplash("1584735175315-9d5df23860e6"),
} as const;
