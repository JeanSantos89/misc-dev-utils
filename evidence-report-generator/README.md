# evidence-report-generator

Turns a structured JSON document into a single self-contained HTML report
with a consistent visual style — no external stylesheet, no build step for
the viewer, just one file you can open or email.

## Why

Ad-hoc evidence reports (QA runs, incident write-ups, audit findings) tend
to drift in formatting every time someone writes one from scratch. This
tool fixes the shape once (title, author, summary, N sections, optional
screenshot per section) and the visual style once (canonical CSS baked
in), so every report looks the same regardless of who generates it.

Pair with [html-to-pdf-headless](../html-to-pdf-headless) to get a PDF out
of the generated HTML when a final, frozen version is needed.

## Usage

```bash
npm install && npm run build
node dist/index.js --input example/doc.json --output report.html
```

## Status

Reimplementation of an internal report-generation pattern (self-contained
HTML, canonical CSS, PDF only for the final version). Written from
scratch, no original templates, data, or branding included.
