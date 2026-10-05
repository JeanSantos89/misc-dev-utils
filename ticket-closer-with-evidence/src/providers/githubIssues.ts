import type { TicketProvider } from "../provider.js";

interface GitHubIssuesConfig {
  owner: string;
  repo: string;
  token: string;
}

/** Example adapter: GitHub Issues implementing the generic TicketProvider contract. */
export class GitHubIssuesProvider implements TicketProvider {
  constructor(private readonly config: GitHubIssuesConfig) {}

  async postComment(ticketId: string, body: string): Promise<void> {
    await this.request(`/issues/${ticketId}/comments`, { method: "POST", body: JSON.stringify({ body }) });
  }

  async transition(ticketId: string, toStatus: string): Promise<void> {
    const state = toStatus.toLowerCase() === "closed" ? "closed" : "open";
    await this.request(`/issues/${ticketId}`, { method: "PATCH", body: JSON.stringify({ state }) });
  }

  private async request(path: string, init: RequestInit): Promise<void> {
    const response = await fetch(`https://api.github.com/repos/${this.config.owner}/${this.config.repo}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}: ${await response.text()}`);
    }
  }
}
