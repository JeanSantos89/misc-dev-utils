#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { renderReportHtml } from "./render.js";
import type { ReportDocument } from "./types.js";

function printHelp(): void {
  console.log(`evidence-report --input <doc.json> --output <report.html>

The input JSON must match the ReportDocument shape (see src/types.ts):
  { "title", "author", "generatedAt", "summary", "sections": [{ "title", "bodyMarkdown", "screenshotPath"? }] }`);
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      input: { type: "string" },
      output: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help || !values.input || !values.output) {
    printHelp();
    process.exit(values.help ? 0 : 1);
  }

  const raw = JSON.parse(await readFile(values.input!, "utf-8"));
  const doc: ReportDocument = { ...raw, generatedAt: new Date(raw.generatedAt) };

  const html = renderReportHtml(doc);
  await writeFile(values.output!, html, "utf-8");
  console.log(`Report written to ${values.output}`);
}

main();
