export interface ClosureInput {
  ticketId: string;
  description: string;
  commitUrls: string[];
  prUrls: string[];
  evidenceUrl?: string;
  transitionTo?: string;
}

/**
 * Any issue tracker (Jira, GitHub Issues, Linear...) can implement this
 * instead of the CLI hardcoding one vendor's API. One comment, one
 * transition call — the shape every tracker-closing automation ends up
 * needing regardless of vendor.
 */
export interface TicketProvider {
  postComment(ticketId: string, body: string): Promise<void>;
  transition(ticketId: string, toStatus: string): Promise<void>;
}

export function buildClosureComment(input: ClosureInput): string {
  const lines = [input.description, ""];
  if (input.commitUrls.length > 0) {
    lines.push("Commits:", ...input.commitUrls.map((u) => `- ${u}`), "");
  }
  if (input.prUrls.length > 0) {
    lines.push("Pull requests:", ...input.prUrls.map((u) => `- ${u}`), "");
  }
  if (input.evidenceUrl) {
    lines.push(`Evidence: ${input.evidenceUrl}`);
  }
  return lines.join("\n").trim();
}

export async function closeTicket(provider: TicketProvider, input: ClosureInput): Promise<void> {
  await provider.postComment(input.ticketId, buildClosureComment(input));
  if (input.transitionTo) {
    await provider.transition(input.ticketId, input.transitionTo);
  }
}
