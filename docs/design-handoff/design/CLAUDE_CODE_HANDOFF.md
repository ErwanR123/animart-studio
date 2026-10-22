# Claude / Codex handoff prompt

Use the `/design` directory as the canonical source of truth for the Museum Companion UX and visual direction. Read `../README.md` and all numbered design documents before proposing broad UI changes.

First inspect the existing repository and produce a short mapping of:
1. existing routes/screens → canonical screens in `04_SCREENS.md`;
2. existing reusable components → components required by `02_DESIGN_SYSTEM.md`;
3. existing product/business logic that should be preserved;
4. missing assets/product decisions;
5. a phased migration plan.

Do not rewrite working business logic solely for visual consistency. Do not invent new colors, illustration styles, navigation destinations or mascot variants. Treat `references/` as visual direction only, never as factual copy or production assets.

When implementing, establish shared design tokens and primitives first, then migrate screens flow by flow. Flag contradictions or missing decisions before creating a new convention.
