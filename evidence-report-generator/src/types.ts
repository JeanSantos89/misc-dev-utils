export interface ReportSection {
  title: string;
  /** Markdown-lite: paragraphs separated by blank lines, no nested lists. */
  bodyMarkdown: string;
  screenshotPath?: string;
}

export interface ReportDocument {
  title: string;
  author: string;
  generatedAt: Date;
  summary: string;
  sections: ReportSection[];
}
