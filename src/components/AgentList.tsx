import Link from "next/link";

import { agentPathToHref } from "@/lib/agents";
import type { AgentSummary } from "@/lib/types";

type AgentListProps = {
  agents: AgentSummary[];
};

export function AgentList({ agents }: AgentListProps) {
  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-700">
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          No agents match your search
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Try another keyword or clear the type filter.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
      {agents.map((agent) => (
        <li key={agent.path}>
          <Link
            href={agentPathToHref(agent.path)}
            className="flex items-start gap-4 px-4 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/60 sm:px-5"
          >
            <span className="text-2xl leading-none" aria-hidden>
              {agent.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {agent.name}
                </h2>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: agent.divisionColor }}
                >
                  {agent.divisionLabel}
                </span>
              </div>
              {agent.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {agent.description}
                </p>
              ) : null}
              {agent.vibe ? (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                  {agent.vibe}
                </p>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
