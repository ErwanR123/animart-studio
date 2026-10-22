# Mascot (the Guide)

Transparent PNG cut-outs from the canonical sheet `visuel/perso.png` and the generated sheets in `visuel/sheets/`. Do not redraw; request new poses against `visuel/perso.png`.

- `base/` — `walking_large`, `turnaround_front_side_back` (front, side, side, back; reference only).
- `poses/` (M, full body) — celebrating, explaining, looking_at_artwork, peeking, placing_stamp, pointing_left, pointing_right, pointing_up, pointing_side_walking, reading_book, reading_map, searching_satchel, walking_humming.
- `expressions/` (S, head/bust) — encouraging, disappointed_kind, proud, focused (magnifier), very_happy, skeptical, plus `face_*` small heads from the canonical sheet (happy_eyes_closed, surprised, thinking, curious, content, pondering).
- `scenes/` (L, rare) — `scene_1..5` painted vignettes (opaque, rectangular), `scene_magnifier_bust`, `scene_sketching_seated` (character with scenery).

Resolution is ~250–540 px tall: fine up to ~220 CSS px at 2x. Re-export at higher resolution before using at L size.

Still missing vs `07_MASCOT.md`: neutral, happy, excited, curious, surprised, confused, celebrating (bust); a clean standing pose; pointing_up with both hands free; sitting (without scenery); sketching (without scenery).

## Alternate render (`poses_alt/`, `expressions_alt/`)
Cut out with a local segmentation model from `visuel/perso2.png` (glossier, more saturated render than the canonical sheet; keep only where the canonical set has no equivalent).
- `poses_alt/` — std_neutral_hands_on_straps (the standing neutral pose), alt_pointing_up_book, alt_reading_map, alt_magnifier_eye, alt_walking, alt_seated_reading_stool, alt_explaining_open_hand, alt_thinking_chin, alt_celebrating_fist, alt_sketching_seated (no scenery).
- `expressions_alt/` — alt_face_eyes_closed, surprised, laughing, thinking, neutral, wink, content. The thumb-up bust lost its thumb in the cut-out and was renamed `alt_face_wink`.
