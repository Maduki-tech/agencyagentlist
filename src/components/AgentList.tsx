import Link from "next/link";

import { agentPathToHref } from "@/lib/agents";
import type { AgentSummary } from "@/lib/types";

type AgentListProps = {
  agents: AgentSummary[];
};

export function AgentList({ agents }: AgentListProps) {
  if (agents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-[var(--ink)]">
          No agents match your search
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Try another keyword or clear the type filter.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <li key={agent.path}>
          <Link
            href={agentPathToHref(agent.path)}
            className="agent-card group flex h-full min-h-48 flex-col rounded-2xl border border-[var(--line)] bg-white/75 p-5"
          >
            <div className="mb-6 flex items-start justify-between gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-[#f1eee7] text-2xl leading-none" aria-hidden>{agent.emoji}</span>
              <span className="text-xl text-[#b8b9b2] transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--coral)]" aria-hidden>↗</span>
            </div>
            <div className="mt-auto">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)]">{agent.name}</h2>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white" style={{ backgroundColor: agent.divisionColor }}>{agent.divisionLabel}</span>
              </div>
              {agent.description ? <p className="line-clamp-2 text-sm leading-5 text-[var(--muted)]">{agent.description}</p> : null}
              {agent.vibe ? <p className="mt-3 line-clamp-1 text-xs italic text-[#969990]">“{agent.vibe}”</p> : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
