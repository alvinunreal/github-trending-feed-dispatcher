const WORKFLOW_DISPATCH_URL =
  "https://api.github.com/repos/alvinunreal/github-trending-api-managed/actions/workflows/run.yml/dispatches";

export default {
  async scheduled(_controller, env) {
    if (typeof env.GITHUB_TOKEN !== "string" || env.GITHUB_TOKEN.length === 0) {
      throw new Error("GITHUB_TOKEN secret is required");
    }

    const response = await fetch(WORKFLOW_DISPATCH_URL, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "github-trending-feed-dispatcher",
      },
      body: JSON.stringify({ ref: "main" }),
    });

    if (response.status !== 204) {
      const body = await response.text();
      throw new Error(
        `GitHub workflow dispatch failed with HTTP ${response.status}: ${body}`,
      );
    }
  },
};
