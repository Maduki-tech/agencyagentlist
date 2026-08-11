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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Search agents</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, description, vibe..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
        </label>

        <label className="sm:w-48">
          <span className="sr-only">Sort agents</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="type-asc">Type A–Z</option>
            <option value="type-desc">Type Z–A</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onDivisionChange("all")}
          className={`rounded-full px-3 py-1.5 text-sm transition ${
            division === "all"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Showing {resultCount} of {totalCount} agents
      </p>
    </div>
  );
}
