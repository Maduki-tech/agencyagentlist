export type DivisionMeta = {
  label: string;
  icon: string;
  color: string;
};

export type DivisionsConfig = {
  divisions: Record<string, DivisionMeta>;
};

export type AgentSummary = {
  path: string;
  slug: string;
  name: string;
  description: string;
  emoji: string;
  vibe: string;
  division: string;
  divisionLabel: string;
  divisionColor: string;
};

export type AgentDetail = AgentSummary & {
  content: string;
};

export type SortOption = "name-asc" | "name-desc" | "type-asc" | "type-desc";
