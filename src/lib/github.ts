const REPO_OWNER = "msitarzewski";
const REPO_NAME = "agency-agents";
const BRANCH = "main";
const REVALIDATE_SECONDS = 3600;

const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`;
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status} for ${url}`);
  }

  return response.json() as Promise<T>;
}

async function rawFetch(path: string): Promise<string> {
  const response = await fetch(`${RAW_BASE}/${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Raw fetch error ${response.status} for ${path}`);
  }

  return response.text();
}

type GitTreeItem = {
  path: string;
  type: "blob" | "tree";
};

type GitTreeResponse = {
  tree: GitTreeItem[];
};

export async function fetchDivisionsJson(): Promise<string> {
  return rawFetch("divisions.json");
}

export async function fetchAgentPaths(divisionSlugs: string[]): Promise<string[]> {
  const data = await githubFetch<GitTreeResponse>(
    `${API_BASE}/git/trees/${BRANCH}?recursive=1`,
  );

  const divisionSet = new Set(divisionSlugs);

  return data.tree
    .filter((item) => {
      if (item.type !== "blob" || !item.path.endsWith(".md")) {
        return false;
      }

      const [division] = item.path.split("/");
      return divisionSet.has(division);
    })
    .map((item) => item.path)
    .sort((a, b) => a.localeCompare(b));
}

export async function fetchAgentMarkdown(path: string): Promise<string> {
  return rawFetch(path);
}

export function getGitHubBlobUrl(path: string): string {
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${path}`;
}

export function getUpstreamRepoUrl(): string {
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
}
