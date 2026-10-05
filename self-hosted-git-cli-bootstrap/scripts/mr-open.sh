#!/usr/bin/env bash
# Opens a merge request via the platform's REST API v4, for when the
# official CLI isn't installed yet or scripting the API is more
# convenient in a one-off automation step.
#
# Usage: ./mr-open.sh <project-id> <source-branch> <target-branch> <title>
set -euo pipefail
source "${HOME}/.config/git-platform-cli/config.env"

PROJECT_ID="$1"; SOURCE="$2"; TARGET="$3"; TITLE="$4"

curl -sf -X POST \
  -H "PRIVATE-TOKEN: ${GIT_PLATFORM_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"source_branch\":\"${SOURCE}\",\"target_branch\":\"${TARGET}\",\"title\":\"${TITLE}\"}" \
  "https://${GIT_PLATFORM_HOST}/api/v4/projects/${PROJECT_ID}/merge_requests"
