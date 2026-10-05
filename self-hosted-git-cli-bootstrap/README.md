# self-hosted-git-cli-bootstrap

A small bootstrap script for getting CLI + REST API v4 access to a
self-hosted git platform (GitLab, Gitea, etc.) working in a fresh shell
or CI runner, when there's no first-party connector reaching it.

## Why

Some internal git platforms sit outside any assistant's or tool's
first-party integrations (no MCP server, 404 on generic probes). The
practical fallback is the platform's own CLI plus its REST API, both of
which just need a host and a token — wiring that up by hand every time is
what this scripts away.

## Usage

```bash
GIT_PLATFORM_HOST=git.example.com GIT_PLATFORM_TOKEN=glpat-xxxx ./scripts/bootstrap.sh
./scripts/mr-open.sh 42 feature/my-branch main "My change"
```

## Status

Generalization of a real setup (CLI + API v4 access to a self-hosted
GitLab instance unreachable via MCP). Reimplemented from scratch as a
platform-agnostic script, no original host, token, or project id
included.
