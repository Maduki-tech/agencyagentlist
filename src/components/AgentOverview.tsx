"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { AgentFilters } from "@/components/AgentFilters";
import { AgentList } from "@/components/AgentList";
import { filterAgents, sortAgents } from "@/lib/agents";
import type { AgentSummary, SortOption } from "@/lib/types";

type AgentOverviewProps = {
  agents: AgentSummary[];
  divisions: Array<{ slug: string; label: string; color: string }>;
};

export function AgentOverview({ agents, divisions }: AgentOverviewProps) {
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState("all");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const deferredQuery = useDeferredValue(query);

  const filteredAgents = useMemo(() => {
    const filtered = filterAgents(agents, deferredQuery, division);
    return sortAgents(filtered, sort);
  }, [agents, deferredQuery, division, sort]);

  return (
    <div className="space-y-6">
      <AgentFilters
        query={query}
        division={division}
        sort={sort}
        divisions={divisions}
        resultCount={filteredAgents.length}
        totalCount={agents.length}
        onQueryChange={setQuery}
        onDivisionChange={setDivision}
        onSortChange={setSort}
      />
      <AgentList agents={filteredAgents} />
    </div>
  );
}
