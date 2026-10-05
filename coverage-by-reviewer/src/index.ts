#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";

interface FileReviewStats {
  path: string;
  authors: Set<string>;
}

/**
 * A line-coverage number says nothing about whether a second pair of eyes
 * ever looked at the code. This walks git log per file and reports any
 * path whose only committer, across all history, is a single person —
 * a proxy for "nobody but the original author has ever reviewed this".
 */
function collectAuthorsPerFile(pathPrefix: string): FileReviewStats[] {
  const log = execFileSync(
    "git",
    ["log", "--name-only", "--pretty=format:__COMMIT__%an", "--", pathPrefix],
    { encoding: "utf-8", maxBuffer: 1024 * 1024 * 64 }
  );

  const statsByPath = new Map<string, FileReviewStats>();
  let currentAuthor = "";

  for (const line of log.split("\n")) {
    if (line.startsWith("__COMMIT__")) {
      currentAuthor = line.replace("__COMMIT__", "").trim();
      continue;
    }
    if (!line.trim()) continue;
    const entry = statsByPath.get(line) ?? { path: line, authors: new Set() };
    entry.authors.add(currentAuthor);
    statsByPath.set(line, entry);
  }

  return [...statsByPath.values()];
}

function main(): void {
  const { positionals } = parseArgs({ allowPositionals: true });
  const pathPrefix = positionals[0] ?? ".";

  const stats = collectAuthorsPerFile(pathPrefix);
  const singleAuthorFiles = stats.filter((s) => s.authors.size === 1);

  console.log(`Files analyzed: ${stats.length}`);
  console.log(`Files touched by a single author only: ${singleAuthorFiles.length}\n`);

  for (const file of singleAuthorFiles) {
    console.log(`${file.path}  (only: ${[...file.authors][0]})`);
  }
}

main();
