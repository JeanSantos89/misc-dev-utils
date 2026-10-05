# misc-dev-utils

A grab-bag of small, standalone dev-workflow tools — each one a
generalization of a real pattern, reimplemented from scratch with no
original data, names, or branding.

| Tool | What it does |
|---|---|
| [evidence-report-generator](./evidence-report-generator) | Structured JSON → single self-contained HTML evidence report |
| [html-to-pdf-headless](./html-to-pdf-headless) | HTML → PDF via headless Chromium, no pandoc/LaTeX |
| [self-hosted-git-cli-bootstrap](./self-hosted-git-cli-bootstrap) | Bootstrap CLI + REST API v4 access to a self-hosted git platform |
| [ticket-closer-with-evidence](./ticket-closer-with-evidence) | Closes an issue with one comment: description + commit links + evidence |
| [coverage-by-reviewer](./coverage-by-reviewer) | Flags files only ever touched by their original author |
| [shell-history-secret-scanner](./shell-history-secret-scanner) | Scans shell history for commands that look like they embedded a secret |
| [desktop-file-organizer](./desktop-file-organizer) | Sorts loose files into subfolders by extension/keyword, with a reversible CSV log |

Each tool has its own README with the "why" and usage. See each folder's
`Status` section for what it's a generalization of.
