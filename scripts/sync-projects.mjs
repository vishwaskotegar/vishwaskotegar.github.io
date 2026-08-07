// Pulls public repos for GITHUB_USER and writes data/projects.json.
// A repo is included only if it's "live" (has its Website field set on
// GitHub) or has been explicitly tagged with the "portfolio" topic.
// Run manually with `node scripts/sync-projects.mjs`, or via the
// scheduled GitHub Action in .github/workflows/sync-projects.yml.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const GITHUB_USER = process.env.GITHUB_PORTFOLIO_USER || "vishwaskotegar";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const OUT_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "projects.json"
);

async function fetchRepos() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-sync-script",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const repos = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}&sort=updated`,
      { headers }
    );
    if (!res.ok) {
      throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
    }
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }

  return repos;
}

function toProject(repo) {
  const topics = repo.topics || [];
  const tags = topics.filter((t) => t !== "portfolio");
  if (repo.language && !tags.includes(repo.language)) tags.unshift(repo.language);

  return {
    name: repo.name,
    description: repo.description || "",
    url: repo.html_url,
    homepage: repo.homepage || null,
    live: Boolean(repo.homepage),
    tags,
    updatedAt: repo.pushed_at,
  };
}

async function main() {
  const repos = await fetchRepos();

  const projects = repos
    .filter((r) => !r.fork && !r.archived)
    .filter((r) => Boolean(r.homepage) || (r.topics || []).includes("portfolio"))
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .map(toProject);

  const payload = {
    generatedAt: new Date().toISOString(),
    projects,
  };

  await writeFile(OUT_PATH, JSON.stringify(payload, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${projects.length} project(s) to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
