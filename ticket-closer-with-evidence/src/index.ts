#!/usr/bin/env node
import { parseArgs } from "node:util";
import { closeTicket } from "./provider.js";
import { GitHubIssuesProvider } from "./providers/githubIssues.js";

function printHelp(): void {
  console.log(`ticket-close --owner <org> --repo <repo> --token <token> --issue <number> \
  --description <text> [--commit <url> ...] [--pr <url> ...] [--evidence-url <url>] [--transition-to <state>]`);
}

function collectMulti(values: Record<string, unknown>, key: string): string[] {
  const v = values[key];
  if (!v) return [];
  return Array.isArray(v) ? (v as string[]) : [v as string];
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      owner: { type: "string" },
      repo: { type: "string" },
      token: { type: "string" },
      issue: { type: "string" },
      description: { type: "string" },
      commit: { type: "string", multiple: true },
      pr: { type: "string", multiple: true },
      "evidence-url": { type: "string" },
      "transition-to": { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help || !values.owner || !values.repo || !values.token || !values.issue || !values.description) {
    printHelp();
    process.exit(values.help ? 0 : 1);
  }

  const provider = new GitHubIssuesProvider({ owner: values.owner!, repo: values.repo!, token: values.token! });

  await closeTicket(provider, {
    ticketId: values.issue!,
    description: values.description!,
    commitUrls: collectMulti(values, "commit"),
    prUrls: collectMulti(values, "pr"),
    evidenceUrl: values["evidence-url"],
    transitionTo: values["transition-to"],
  });

  console.log(`Issue #${values.issue} closed with evidence comment.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
