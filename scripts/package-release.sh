#!/usr/bin/env sh

set -eu

APP_HOME="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
RELEASE_DIR="$APP_HOME/release/dg-admin-web"

cd "$APP_HOME"

if [ "${SKIP_BUILD:-false}" != "true" ]; then
  npm run build
fi

rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"
cp -R "$APP_HOME/dist" "$RELEASE_DIR/dist"
mkdir -p "$RELEASE_DIR/config" "$RELEASE_DIR/nginx/linux" "$RELEASE_DIR/nginx/windows"
cp "$APP_HOME/deploy/config/config.js.template" "$RELEASE_DIR/config/config.js"
cp "$APP_HOME/deploy/nginx/linux/eam.conf" "$RELEASE_DIR/nginx/linux/eam.conf"
cp "$APP_HOME/deploy/nginx/windows/eam.conf" "$RELEASE_DIR/nginx/windows/eam.conf"

echo "前端发布包已生成：$RELEASE_DIR"
