"use client";

import type { SortOption } from "@/lib/types";

type AgentFiltersProps = {
  query: string;
  division: string;
  sort: SortOption;
  divisions: Array<{ slug: string; label: string; color: string }>;
  resultCount: number;
  totalCount: number;
  onQueryChange: (value: string) => void;
  onDivisionChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
};

export function AgentFilters({
  query,
  division,
  sort,
  divisions,
  resultCount,
  totalCount,
  onQueryChange,
  onDivisionChange,
  onSortChange,
}: AgentFiltersProps) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4 shadow-[0_10px_35px_rgba(20,33,61,.04)] sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]">Browse the directory</p>
        <span className="rounded-full bg-[var(--mint)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">Live index</span>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Search agents</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, description, vibe..."
            className="w-full rounded-xl border border-[var(--line)] bg-[#fafaf7] px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-zinc-400 focus:border-[var(--coral)] focus:bg-white"
          />
        </label>

        <label className="sm:w-48">
          <span className="sr-only">Sort agents</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="w-full rounded-xl border border-[var(--line)] bg-[#fafaf7] px-3 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--coral)] focus:bg-white"
          >
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="type-asc">Type A–Z</option>
            <option value="type-desc">Type Z–A</option>
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onDivisionChange("all")}
          className={`rounded-full px-3 py-1.5 text-sm transition ${
            division === "all"
              ? "bg-[var(--ink)] text-white"
              : "bg-[#ebece6] text-[var(--ink)] hover:bg-[#dfe1d9]"
          }`}
        >
          All
        </button>
        {divisions.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => onDivisionChange(item.slug)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              division === item.slug
                ? "text-white"
                : "bg-[#ebece6] text-[var(--ink)] hover:bg-[#dfe1d9]"
            }`}
            style={
              division === item.slug
                ? { backgroundColor: item.color }
                : undefined
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs font-medium text-[var(--muted)]">
        Showing <span className="font-bold text-[var(--ink)]">{resultCount}</span> of {totalCount} agents
      </p>
    </div>
  );
}
