# html-to-pdf-headless

Converts an HTML file to PDF by driving a headless Chromium instance
directly — no `pandoc`, no LaTeX, no native OS dependency beyond the
browser binary.

## Why

Most "HTML to PDF" CLI tools either shell out to `wkhtmltopdf` (unmaintained,
breaks on modern CSS) or require a full `pandoc` + LaTeX toolchain just to
flatten a styled HTML report. If you already have Playwright or Puppeteer
installed for testing, you already have a perfectly good PDF renderer sitting
unused.

## Usage

```bash
npm install
npx playwright install chromium
npm run build
node dist/index.js --input report.html --output report.pdf --format A4 --margin-mm 12
```

## Status

Reimplementation of a pattern used internally to generate self-contained
evidence reports without a heavy PDF toolchain. Written from scratch here,
no original code or data included.
