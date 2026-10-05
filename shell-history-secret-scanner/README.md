# shell-history-secret-scanner

Scans a shell history file for commands that look like they embedded a
secret inline — an API key, a bearer token, a `user:password@` URL — the
pattern that leaves credentials sitting in plaintext on disk indefinitely.

## Why

Terminal tools that persist command history (some productivity/voice
tools do this by design, so do plain `.bash_history`/`.zsh_history`)
rarely encrypt it. A command typed once with a token inline stays
recoverable on disk long after the token itself is rotated or revoked —
most people don't think of shell history as a place secrets leak from.

## Usage

```bash
python -m src.cli ~/.bash_history
```

This is a **shape** heuristic, not a live-credential validator: it flags
patterns that look like secrets, not confirmed working ones. Expect some
false positives; the goal is to build the habit of using `$ENV_VAR`
references instead of pasting secrets inline.

## Status

Generalization of a real finding (a terminal productivity tool stored
command history, including inline secrets, unencrypted on disk).
Reimplemented from scratch as a standalone scanner, no original tool name
or captured history included.
