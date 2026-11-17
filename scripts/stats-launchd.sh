#!/bin/bash
# Installs (or reinstalls) the hourly stats snapshot on this Mac: a launchd agent running scripts/stats-snapshot.mjs
# every hour while the Mac is awake (a missed hour is caught up by the next run). Log: ~/Library/Logs/animart-stats.log
#   bash scripts/stats-launchd.sh            # install / update
#   bash scripts/stats-launchd.sh remove     # uninstall
set -euo pipefail
LABEL=com.animart.stats-snapshot
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
STUDIO="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$(source ~/.nvm/nvm.sh >/dev/null && nvm which 22)"

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
if [ "${1:-}" = remove ]; then rm -f "$PLIST"; echo "removed"; exit 0; fi

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key><array>
    <string>$NODE</string><string>--env-file=$STUDIO/.env</string><string>$STUDIO/scripts/stats-snapshot.mjs</string>
  </array>
  <key>WorkingDirectory</key><string>$STUDIO</string>
  <key>StartInterval</key><integer>3600</integer>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>$HOME/Library/Logs/animart-stats.log</string>
  <key>StandardErrorPath</key><string>$HOME/Library/Logs/animart-stats.log</string>
</dict></plist>
EOF
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "installed: every hour → ~/Library/Logs/animart-stats.log"
