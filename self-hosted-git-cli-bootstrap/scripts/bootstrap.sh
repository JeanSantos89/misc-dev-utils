#!/usr/bin/env bash
# Bootstraps CLI access to a self-hosted git platform (GitLab, Gitea, etc.)
# that isn't reachable through a generic MCP/API connector, by wiring up
# the platform's own CLI with a token from the environment.
#
# Usage:
#   GIT_PLATFORM_HOST=git.example.com GIT_PLATFORM_TOKEN=xxx ./bootstrap.sh
set -euo pipefail

: "${GIT_PLATFORM_HOST:?Set GIT_PLATFORM_HOST, e.g. git.example.com}"
: "${GIT_PLATFORM_TOKEN:?Set GIT_PLATFORM_TOKEN to a personal access token}"

CONFIG_DIR="${HOME}/.config/git-platform-cli"
mkdir -p "$CONFIG_DIR"

cat > "$CONFIG_DIR/config.env" <<CONF
GIT_PLATFORM_HOST=${GIT_PLATFORM_HOST}
GIT_PLATFORM_TOKEN=${GIT_PLATFORM_TOKEN}
CONF
chmod 600 "$CONFIG_DIR/config.env"

echo "Verifying connectivity to https://${GIT_PLATFORM_HOST}/api/v4/user ..."
curl -sf -H "PRIVATE-TOKEN: ${GIT_PLATFORM_TOKEN}" \
  "https://${GIT_PLATFORM_HOST}/api/v4/user" | grep -o '"username":"[^"]*"' \
  && echo "OK: token is valid." \
  || { echo "FAILED: could not authenticate against ${GIT_PLATFORM_HOST}"; exit 1; }

echo "Config written to ${CONFIG_DIR}/config.env"
echo "Source it in your shell profile: source ${CONFIG_DIR}/config.env"
