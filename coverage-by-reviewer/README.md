# coverage-by-reviewer

Reports which files in a repository have only ever been touched by their
original author — a proxy for "nobody else has ever reviewed this code",
even if a pull request formally approved it.

## Why

Formal review approval doesn't guarantee a second person actually
understands a file. Looking at full git history per path — not just the
latest PR — surfaces the files that have quietly stayed a single person's
exclusive territory for years, which is exactly where knowledge silos and
unreviewed assumptions accumulate.

## Usage

```bash
npm install && npm run build
node dist/index.js src/
```

Run from inside the git repository you want to analyze.

## Status

Generalization of a real audit (measuring review coverage across a
multi-service codebase by commit history). Reimplemented from scratch as
a generic git-log analysis, no original repository names, field names, or
service list included.
