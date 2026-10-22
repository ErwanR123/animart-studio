# Museum Companion — Design Handoff

This folder is the source of truth for the product UX and visual direction. Copy the `design/` directory into the application repository.

## For Claude / Codex
Read the documents in this order before making broad UI changes:

1. `00_PRODUCT_VISION.md`
2. `01_DESIGN_DIRECTION.md`
3. `02_DESIGN_SYSTEM.md`
4. `07_MASCOT.md`
5. `03_NAVIGATION.md`
6. `05_EXPLORER_NOTEBOOK.md`
7. `06_MINIGAMES.md`
8. `04_SCREENS.md`
9. `08_ANIMATIONS.md`

`references/` contains visual direction boards, not production-ready UI assets. Do not crop elements from these boards for the final app.

`assets/` contains the intended production asset structure. It is intentionally scaffolded now; reusable transparent mascot poses, textures, stamps and illustrations should be exported into these folders as they are approved.

## Implementation principle
Do not rewrite working business logic just to match these documents. First inspect the existing repository, map current screens/components to this specification, extract reusable design primitives, then migrate progressively. If a product decision is missing, flag it instead of silently inventing a new convention.
