#!/usr/bin/env bash
# Re-clones the reference repos studied in bible/references.md into refs/ (git-ignored, shallow, big media skipped).
# Usage (from the repo root): bash scripts/refs.sh
set -euo pipefail
mkdir -p refs && cd refs
for r in JohnHeibel/ClaudeAnimationBase JohnHeibel/PDoomVideo buildwithhanif/claude-animation-skill \
         yihui-dev/awesome-opus5-5-videos WinterArc21/Battle-of-Austerlitz-Film; do
  n=${r#*/}; [ -d "$n" ] || git clone -q --depth 1 --filter=blob:limit=2m "https://github.com/$r.git" "$n"
done
[ -d awesome-ai-motion ] || git clone -q --depth 1 --filter=blob:limit=300k https://github.com/guanmo-ai/awesome-ai-motion.git
ls
