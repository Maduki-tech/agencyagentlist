import matter from "gray-matter";

import {
  fetchAgentMarkdown,
  fetchAgentPaths,
  fetchDivisionsJson,
} from "@/lib/github";
import type {
  AgentDetail,
  AgentSummary,
  DivisionsConfig,
  SortOption,
} from "@/lib/types";

export function slugFromPath(path: string): string {
  const filename = path.split("/").pop() ?? path;
  return filename.replace(/\.md$/, "");
}

export function titleFromSlug(slug: string): string {
  return slug
    .replace(/^[a-z]+-/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function mapConcurrent<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]);
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker(),
  );

  await Promise.all(workers);
  return results;
}

function parseDivisions(raw: string): DivisionsConfig {
  return JSON.parse(raw) as DivisionsConfig;
}

export function parseFrontmatterLine(line: string): [string, string] | null {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) {
    return null;
  }

  const key = line.slice(0, colonIndex).trim();
  let value = line.slice(colonIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

export function parseFrontmatterFallback(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const parsed = parseFrontmatterLine(line);
    if (parsed) {
      const [key, value] = parsed;
      data[key] = value;
    }
  }

  return { data, content: match[2] };
}

function parseAgentMarkdown(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  try {
    const parsed = matter(raw);
    const data: Record<string, string> = {};

    for (const [key, value] of Object.entries(parsed.data)) {
      if (typeof value === "string") {
        data[key] = value;
      }
    }

    return { data, content: parsed.content };
  } catch {
    return parseFrontmatterFallback(raw);
  }
}

export function buildSummary(
  path: string,
  raw: string,
  divisions: DivisionsConfig,
): AgentSummary {
  const { data } = parseAgentMarkdown(raw);
  const division = path.split("/")[0] ?? "unknown";
  const divisionMeta = divisions.divisions[division];
  const slug = slugFromPath(path);

  return {
    path,
    slug,
    name: typeof data.name === "string" ? data.name : titleFromSlug(slug),
    description:
      typeof data.description === "string" ? data.description : "",
    emoji: typeof data.emoji === "string" ? data.emoji : "🤖",
    vibe: typeof data.vibe === "string" ? data.vibe : "",
    division,
    divisionLabel: divisionMeta?.label ?? division,
    divisionColor: divisionMeta?.color ?? "#6B7280",
  };
}

export async function getAgentIndex(): Promise<{
  agents: AgentSummary[];
  divisions: DivisionsConfig;
}> {
  const divisionsRaw = await fetchDivisionsJson();
  const divisions = parseDivisions(divisionsRaw);
  const divisionSlugs = Object.keys(divisions.divisions);
  const paths = await fetchAgentPaths(divisionSlugs);

  const agents = await mapConcurrent(paths, 10, async (path) => {
    const raw = await fetchAgentMarkdown(path);
    return buildSummary(path, raw, divisions);
  });

  return { agents, divisions };
}

export async function getAgentDetail(path: string): Promise<AgentDetail | null> {
  const divisionsRaw = await fetchDivisionsJson();
  const divisions = parseDivisions(divisionsRaw);

  try {
    const raw = await fetchAgentMarkdown(path);
    const { content } = parseAgentMarkdown(raw);
    const summary = buildSummary(path, raw, divisions);

    return {
      ...summary,
      content,
    };
  } catch {
    return null;
  }
}

export function filterAgents(
  agents: AgentSummary[],
  query: string,
  division: string,
): AgentSummary[] {
  const normalizedQuery = query.trim().toLowerCase();

  return agents.filter((agent) => {
    if (division !== "all" && agent.division !== division) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      agent.name,
      agent.description,
      agent.vibe,
      agent.path,
      agent.divisionLabel,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function sortAgents(
  agents: AgentSummary[],
  sort: SortOption,
): AgentSummary[] {
  const sorted = [...agents];

  sorted.sort((a, b) => {
    if (sort === "name-asc") {
      return a.name.localeCompare(b.name);
    }

    if (sort === "name-desc") {
      return b.name.localeCompare(a.name);
    }

    if (sort === "type-asc") {
      const byDivision = a.divisionLabel.localeCompare(b.divisionLabel);
      return byDivision !== 0 ? byDivision : a.name.localeCompare(b.name);
    }

    const byDivision = b.divisionLabel.localeCompare(a.divisionLabel);
    return byDivision !== 0 ? byDivision : a.name.localeCompare(b.name);
  });

  return sorted;
}

export function agentPathToHref(path: string): string {
  return `/agent/${path}`;
}
