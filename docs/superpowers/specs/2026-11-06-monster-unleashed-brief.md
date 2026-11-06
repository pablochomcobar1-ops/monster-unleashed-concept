# Monster Unleashed (concept site): Brief

**Status:** Locked (Stage 1 + Stage 2), 2026-11-06
**Owner:** Pablo Chomcobar

## What it is
An unofficial portfolio concept redesign of the Monster Energy website. It is not affiliated with Monster Energy.
- Footer (verbatim): `Concept by Pablo Chomcobar. Not affiliated with Monster Energy.` linking to the owner's portfolio.
- Main goal: show the product. There is no selling, no checkout, no accounts and no forms that submit data.
- Audience: energy-drink and caffeine users who chase adrenaline.
- Repo: `monster-unleashed-concept`. Live: `monster-unleashed-concept.vercel.app`

## Pages and URLs
| URL | Page | Content |
|---|---|---|
| `/` | Home | 3D can hero, 5-flavour scroll story, worlds teaser, "Pick your beast" picker |
| `/about` | About | Brand attitude story plus the concept disclaimer |
| `/ingredients` | Ingredients | Energy-blend explainer, stat strip per flavour, responsible-use note |
| `/used-by` | Used By | 6 worlds with anchors: `#motocross #skate #bmx #surf #esports #music` |
| `/404` | Not found | "You rode off the map" |

Nav: logo, the 4 links and a sound toggle. On mobile it becomes a full-screen menu.

## Products (5)
Original, Ultra White, Ultra Paradise, Mango Loco, Pipeline Punch.
Caffeine, sugar and kcal numbers come **only from the owner's photos of the India can labels**. Until then they are `null` and shown as "—".

## Content rules
- Voice: raw, short English with ALL-CAPS headlines. No medical claims. No "boosts energy" claims.
- In product copy, call it a "caffeinated beverage", not an "energy drink" (FSSAI India 2026 labelling rule).
- Ingredients page ends with a responsible-use note: not for under-18s or pregnant people; watch your daily caffeine.
- Used By shows sports worlds only: no real athlete names and no athlete photos.
- Closing action: the "Pick your beast" picker (3 questions → flavour), plus a secondary link to monsterenergy.com, marked as external.

## Assets (licensing)
- The owner photographs the 5 cans, both front and back labels.
- Stock photos and videos come only from Unsplash, Pexels or Pixabay, with the photographer credited in the footer.
- Sound effects come from Pixabay or Freesound, CC0 only.
- Fonts: Oswald and Inter (Google Fonts, OFL).
- Never use Google Images, Pinterest, Monster's own site or social posts, or wallpaper sites.

## Look (Stage 2): C layout × A colours
- Signature moment: a pinned 3D can scroll story. The can spins, the label swaps and the screen floods with each flavour's colour.
- Background: green fog, film grain, a flavour glow, and particles that speed up with scroll speed.
- Hero: giant outlined "UNLEASH" in green behind the can.
- Sound: off by default, with a toggle. Can-crack on the hero can click, whooshes between flavours, a low rumble ambience.

## Design tokens
Tailwind v4 `@theme inline`:
- Colours: background `#050605`, background-secondary `#0C110A`, background-tertiary `#1C2418`; foreground `#F2F5EE`, foreground-secondary `#C9D1C2`, foreground-subtle `#8A9483`; brand `#A6FF00`, brand-accent `#D4FF7A`; border `#3A4434` (decorative only), border-subtle `#1C2418`; focus-ring `#A6FF00`; error `#EF4444`.
- Flavour colours: original `#A6FF00`, ultra `#E8ECEF`, paradise `#2BD4A8`, mango `#FF8A1F`, pipeline `#FF4F8B`.
- Text sizes: hero01 `clamp(4.5rem,14vw,16rem)`, hero02 `clamp(3rem,7vw,6rem)`, heading01 `3rem`, heading02 `2.25rem`, heading03 `1.5rem`, body01 `1.125rem`, body02 `1rem`, caption01 `0.8125rem`, caption02 `0.75rem`.
- Other: spacing-section `clamp(72px,10vw,140px)`, radius-pill `9999px`, shadow-glow `0 0 80px rgb(166 255 0 / 0.35)`, ease-out-expo `cubic-bezier(0.16,1,0.3,1)`.

## Out of scope
Paid OpenSEO steps, e-commerce, accounts, a database, an admin panel, and a CMS.
