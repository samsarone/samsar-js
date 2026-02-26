#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Load env vars from .env when present (used for NPM_TOKEN).
if [[ -f ".env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env"
  set +a
fi

BUMP_LEVEL="${1:-none}"
case "$BUMP_LEVEL" in
  none|patch|minor|major) ;;
  *)
    echo "Usage: $0 [none|patch|minor|major]" >&2
    exit 1
    ;;
esac

if [[ "$BUMP_LEVEL" != "none" ]]; then
  npm version "$BUMP_LEVEL" --no-git-tag-version
fi

PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
TOKEN="${NPM_TOKEN:-${NODE_AUTH_TOKEN:-}}"
if [[ -z "${TOKEN}" ]]; then
  echo "NPM_TOKEN (or NODE_AUTH_TOKEN) is required in env/.env" >&2
  exit 1
fi

REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org/}"

npm ci
npm run build

if npm view "${PACKAGE_NAME}@${PACKAGE_VERSION}" version --registry="${REGISTRY}" >/dev/null 2>&1; then
  echo "${PACKAGE_NAME}@${PACKAGE_VERSION} is already published on ${REGISTRY}" >&2
  exit 1
fi

TMP_NPMRC="$(mktemp)"
cleanup() {
  rm -f "$TMP_NPMRC"
}
trap cleanup EXIT

printf "//registry.npmjs.org/:_authToken=%s\nregistry=%s\nalways-auth=true\n" "$TOKEN" "$REGISTRY" > "$TMP_NPMRC"

NPM_CONFIG_USERCONFIG="$TMP_NPMRC" npm whoami --registry="${REGISTRY}" >/dev/null
if [[ -n "${NPM_OTP:-}" ]]; then
  NPM_CONFIG_USERCONFIG="$TMP_NPMRC" npm publish --access public --registry="${REGISTRY}" --otp "${NPM_OTP}"
else
  NPM_CONFIG_USERCONFIG="$TMP_NPMRC" npm publish --access public --registry="${REGISTRY}"
fi

echo "Published ${PACKAGE_NAME}@${PACKAGE_VERSION} to ${REGISTRY}"
