#!/usr/bin/env node
import { parseArgs } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

interface Options {
  input: string;
  output: string;
  format: string;
  landscape: boolean;
  marginMm: number;
}

function printHelp(): void {
  console.log(`html2pdf --input <file.html> --output <file.pdf> [options]

Options:
  --format <A4|Letter>   Page format (default: A4)
  --landscape            Render in landscape orientation
  --margin-mm <n>        Margin in millimeters on every side (default: 10)
  -h, --help             Show this help`);
}

async function renderPdf(options: Options): Promise<void> {
  const html = await readFile(options.input, "utf-8");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load via file:// so relative assets (css, images) next to the HTML resolve correctly.
  await page.goto(pathToFileURL(options.input).toString(), { waitUntil: "networkidle" });
  await page.setContent(html, { waitUntil: "networkidle" });

  const margin = `${options.marginMm}mm`;
  const pdfBuffer = await page.pdf({
    format: options.format as "A4" | "Letter",
    landscape: options.landscape,
    printBackground: true,
    margin: { top: margin, bottom: margin, left: margin, right: margin },
  });

  await browser.close();
  await writeFile(options.output, pdfBuffer);
}

function main(): void {
  const { values } = parseArgs({
    options: {
      input: { type: "string" },
      output: { type: "string" },
      format: { type: "string", default: "A4" },
      landscape: { type: "boolean", default: false },
      "margin-mm": { type: "string", default: "10" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help || !values.input || !values.output) {
    printHelp();
    process.exit(values.help ? 0 : 1);
  }

  renderPdf({
    input: values.input!,
    output: values.output!,
    format: values.format!,
    landscape: Boolean(values.landscape),
    marginMm: Number(values["margin-mm"]),
  })
    .then(() => console.log(`PDF written to ${values.output}`))
    .catch((err) => {
      console.error("Failed to render PDF:", err);
      process.exit(1);
    });
}

main();
