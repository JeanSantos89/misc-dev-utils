# ticket-closer-with-evidence

Closes an issue with one comment bundling its description, commit/PR
links and an evidence file link — plus an optional status transition —
behind a provider interface so it isn't locked to one tracker's API.

## Why

Closing out finished work by hand (write the comment, find every commit
link, attach the evidence doc, remember to move the status) is exactly
the kind of multi-step chore that drifts in format every time a different
person does it. A single comment with a fixed shape, generated the same
way every time, removes that drift — and a provider interface means the
same logic works whether the tracker is Jira, Linear, or GitHub Issues.

## Usage

```bash
npm install && npm run build
node dist/index.js --owner my-org --repo my-repo --token $GITHUB_TOKEN --issue 42 \
  --description "Fixed the thing" --commit https://github.com/my-org/my-repo/commit/abc123 \
  --evidence-url https://example.com/evidence.pdf --transition-to closed
```

Only a `GitHubIssuesProvider` ships here as a working example; implement
`TicketProvider` for any other tracker.

## Status

Generalization of a real closing convention (one comment: description +
commit/PR links, evidence attached, status moved). Reimplemented from
scratch against the public GitHub Issues API, no original tracker,
project key, or ticket data included.
