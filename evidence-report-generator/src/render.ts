import type { ReportDocument, ReportSection } from "./types.js";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderMarkdownLite(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join("\n");
}

function renderSection(section: ReportSection): string {
  const screenshot = section.screenshotPath
    ? `<img class="evidence-screenshot" src="${escapeHtml(section.screenshotPath)}" alt="${escapeHtml(section.title)}" />`
    : "";
  return `
    <section class="evidence-section">
      <h2>${escapeHtml(section.title)}</h2>
      ${renderMarkdownLite(section.bodyMarkdown)}
      ${screenshot}
    </section>`;
}

const CANONICAL_CSS = `
:root { color-scheme: light dark; }
body { font-family: system-ui, sans-serif; max-width: 860px; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
header { border-bottom: 2px solid currentColor; margin-bottom: 1.5rem; padding-bottom: 1rem; }
header .meta { opacity: 0.7; font-size: 0.9rem; }
.evidence-summary { background: rgba(127,127,127,0.1); padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
.evidence-section { margin-bottom: 2.5rem; }
.evidence-section h2 { border-left: 4px solid currentColor; padding-left: 0.6rem; }
.evidence-screenshot { max-width: 100%; border: 1px solid rgba(127,127,127,0.3); border-radius: 4px; margin-top: 0.75rem; }
`;

/** Renders a report document into a single self-contained HTML string (inline CSS, no external assets required besides screenshots). */
export function renderReportHtml(doc: ReportDocument): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(doc.title)}</title>
  <style>${CANONICAL_CSS}</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(doc.title)}</h1>
    <div class="meta">By ${escapeHtml(doc.author)} — generated ${doc.generatedAt.toISOString()}</div>
  </header>
  <div class="evidence-summary">${renderMarkdownLite(doc.summary)}</div>
  ${doc.sections.map(renderSection).join("\n")}
</body>
</html>`;
}
