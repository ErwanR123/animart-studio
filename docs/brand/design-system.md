# Museum Companion — Design System

## Intent
Modern cultural exploration companion: contemporary mobile product design + editorial art book + explorer notebook + subtle Italian influence + hand-drawn illustration.

### Hierarchy
1. Artwork / museum / cultural content
2. Primary information
3. User exploration/progression
4. UI controls
5. Mascot/decorative illustration

The mascot must never compete with an artwork.

## Colors
| Token | Value | Use |
|---|---|---|
| paper | `#F7F1E5` | app background |
| surface | `#FFFDF8` | cards/sheets |
| ink | `#20251F` | primary text/dark UI |
| terracotta | `#B74432` | primary CTA/active state |
| olive | `#58684A` | historical/secondary/correct |
| ochre | `#D79B43` | rewards/discoveries |
| mutedInk | `#726C62` | secondary text |
| border | `#DDD3C2` | warm borders |
| softSurface | `#EFE7D9` | secondary surfaces |
| disabled | `#B8B0A3` | disabled state |

## Typography
- Display/editorial: **EB Garamond** — large titles, artwork/museum names, chapters.
- Interface: **Hanken Grotesk** — navigation, controls, metadata, forms.
- Handwritten accent: optional and sparse; only Guide annotations/notebook details. Never for critical UI.

## Layout
Mobile-first. 8px base rhythm. Suggested spacing: 4, 8, 12, 16, 24, 32, 48, 64. Mobile horizontal padding 16–20px. Avoid unnecessary card nesting.

## Radius
Small 8px; cards 12–16px; large cards 18–20px; pills fully rounded; primary CTA 14–18px.

## Elevation
Prefer warm 1px borders and spacing over strong shadows. Shadows must be subtle.

## Imagery
Preserve artwork aspect ratio. Avoid aggressive filters and unnecessary overlays. Museum photography may receive a restrained overlay for text readability.

## Illustration language
2D, editorial, ink/gouache/watercolor influence, imperfect contours, line variation, limited palette, subtle texture. Avoid cinematic 3D polish, perfect symmetry and excessive gradients.

## Paper texture
Nearly invisible in normal UI; more visible in Notebook/reward surfaces. Never make the whole app look like an old treasure map.

## Primary navigation
Accueil — Explorer — Visite — Carnet — Profil. Mini-games are contextual, not a sixth tab.

## Core React components
Navigation: `BottomNavigation`, `TopBar`, `BackButton`, `SearchBar`, `FilterChip`, `SegmentedTabs`.

Culture: `ArtworkCard`, `ArtworkHero`, `MuseumCard`, `MuseumHero`, `ArtistCard`, `HistoricalPeriodCard`, `CollectionCard`, `DiscoveryCard`.

Exploration: `ChapterCard`, `HistoricalTimeline`, `TimelineEvent`, `DiscoveryProgress`, `ExplorerMap`, `ExplorerNote`, `DiscoveryStamp`.

Guide: `Mascot`, `MascotMessage`, `GuideAnnotation`, `GuideTip`.

Visit: `VisitPlayer`, `AudioPlayer`, `VisitProgress`, `NextArtworkCard`, `MuseumMap`.

Games: `GameCard`, `GameProgress`, `GameLives`, `GameQuestion`, `GameFeedback`, `GameReward`.

Feedback: `DiscoveryModal`, `RewardModal`, `Badge`, `Toast`.

## Card philosophy
Use cards for actual objects (artwork, museum, collection, challenge, chapter), not as generic wrappers around every paragraph.

## Buttons
Primary: terracotta background/light text, generally one dominant CTA per section. Secondary: transparent/surface + ink border. Tertiary: text/icon only.

## Icons
Simple line icons; slightly organic geometry is fine. No emoji or glossy/cartoon icon packs.

## Motion
Normal UI: 150–350ms. Major discovery moments: up to ~700ms. Motion reinforces discovery; no decorative continuous motion.

## Mascot rule
Every appearance needs a purpose: explain, celebrate, observe, hint, introduce or support an empty state. Never place him randomly beside every heading.

## Mini-game language
Paper cards, artwork fragments, timelines, pins, connecting lines, torn pieces and stamps. Never switch to arcade colors/game chrome.

## Notebook language
Sketches, stamps, handwritten annotations, historical maps, connecting lines, pinned art and collage are allowed. Think beautiful contemporary travel journal, not pirate scrapbook.

## Hard constraints
Do not introduce without approval: glassmorphism, neon, large gradients, purple AI aesthetic, generic 3D characters, excessive shadows, random brand colors, alternate mascot styles, inconsistent illustration styles.

## Quality test
- Could this be a generic startup screen? Add identity.
- Could this be a children's museum game? Remove playful decoration.
- Is the Guide more visible than the artwork? Reduce him.
- Does it look excessively historical? Modernize it.
- Does it communicate culture, exploration and discovery? Good.
