#!/usr/bin/env bash
set -euo pipefail

if [ -z "${APPIUM_APK_PATH:-}" ]; then
  APPIUM_APK_PATH="$(find appium-artifacts -name '*.apk' -print -quit)"
  export APPIUM_APK_PATH
fi

if [ -z "$APPIUM_APK_PATH" ]; then
  echo "No APK found for Appium smoke test." >&2
  exit 1
fi

npx appium --base-path /wd/hub --log appium.log &
APPIUM_PID=$!

cleanup() {
  if kill -0 "$APPIUM_PID" >/dev/null 2>&1; then
    kill "$APPIUM_PID"
    wait "$APPIUM_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

for _ in $(seq 1 30); do
  if curl --silent --fail http://127.0.0.1:4723/wd/hub/status >/dev/null; then
    npm run test:appium
    exit 0
  fi
  sleep 2
done

echo "Appium server did not become ready within 60 seconds." >&2
exit 1
