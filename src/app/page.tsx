import Link from "next/link";

import { AgentOverview } from "@/components/AgentOverview";
import { getAgentIndex } from "@/lib/agents";
import { getUpstreamRepoUrl } from "@/lib/github";

export const revalidate = 3600;

export default async function HomePage() {
  const { agents, divisions } = await getAgentIndex();

  const divisionOptions = Object.entries(divisions.divisions)
    .map(([slug, meta]) => ({
      slug,
      label: meta.label,
      color: meta.color,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Agency Agents
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              Agent Lookup
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Browse every agent from the upstream repository. Search, filter by
              division, and open the full markdown for any specialist.
            </p>
          </div>
          <Link
            href={getUpstreamRepoUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            View on GitHub
          </Link>
        </div>
      </header>

      <AgentOverview agents={agents} divisions={divisionOptions} />
    </main>
  );
}
