import { describe, expect, it } from "vitest";

import {
  agentPathToHref,
  buildSummary,
  filterAgents,
  mapConcurrent,
  parseFrontmatterFallback,
  parseFrontmatterLine,
  slugFromPath,
  sortAgents,
  titleFromSlug,
} from "@/lib/agents";
import type { AgentSummary, DivisionsConfig } from "@/lib/types";

const DIVISIONS: DivisionsConfig = {
  divisions: {
    productivity: { label: "Productivity", icon: "⚡", color: "#123456" },
    writing: { label: "Writing", icon: "✍️", color: "#abcdef" },
  },
};

function makeAgent(overrides: Partial<AgentSummary> = {}): AgentSummary {
  return {
    path: "productivity/notes.md",
    slug: "notes",
    name: "Notes Agent",
    description: "Organizes your notes",
    emoji: "📝",
    vibe: "focused",
    division: "productivity",
    divisionLabel: "Productivity",
    divisionColor: "#123456",
    ...overrides,
  };
}

describe("slugFromPath", () => {
  it("extracts the filename without extension", () => {
    expect(slugFromPath("productivity/notes.md")).toBe("notes");
  });

  it("handles deeply nested paths", () => {
    expect(slugFromPath("writing/general/blog/draft.md")).toBe("draft");
  });

  it("returns the whole path when there is no filename", () => {
    expect(slugFromPath("noext")).toBe("noext");
  });
});

describe("titleFromSlug", () => {
  it("title-cases a single-word slug", () => {
    expect(titleFromSlug("cook")).toBe("Cook");
  });

  it("drops the division prefix and title-cases the rest", () => {
    expect(titleFromSlug("productivity-focus-vision")).toBe("Focus Vision");
  });

  it("handles an empty slug", () => {
    expect(titleFromSlug("")).toBe("");
  });
});

describe("filterAgents", () => {
  const agents = [
    makeAgent({ path: "productivity/notes.md", name: "Notes", description: "Organize ideas", division: "productivity" }),
    makeAgent({ path: "writing/blog.md", name: "Blogger", description: "Write posts", vibe: "creative", division: "writing", divisionLabel: "Writing", divisionColor: "#abcdef" }),
    makeAgent({ path: "writing/editor.md", name: "Editor", description: "Polish prose", division: "writing", divisionLabel: "Writing", divisionColor: "#abcdef" }),
  ];

  it("returns everything when no query or division is given", () => {
    expect(filterAgents(agents, "", "all")).toHaveLength(3);
  });

  it("filters by division", () => {
    const result = filterAgents(agents, "", "writing");
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.division === "writing")).toBe(true);
  });

  it("filters by a matching name", () => {
    expect(filterAgents(agents, "blog", "all").map((a) => a.name)).toEqual(["Blogger"]);
  });

  it("matches against description", () => {
    expect(filterAgents(agents, "polish", "all").map((a) => a.name)).toEqual(["Editor"]);
  });

  it("matches against vibe", () => {
    expect(filterAgents(agents, "creative", "all").map((a) => a.name)).toEqual(["Blogger"]);
  });

  it("is case-insensitive", () => {
    expect(filterAgents(agents, "NOTES", "all").map((a) => a.name)).toEqual(["Notes"]);
  });

  it("trims surrounding whitespace from the query", () => {
    expect(filterAgents(agents, "  notes  ", "all")).toHaveLength(1);
  });

  it("combines division and query filters", () => {
    expect(filterAgents(agents, "editor", "writing").map((a) => a.name)).toEqual(["Editor"]);
    expect(filterAgents(agents, "notes", "writing")).toHaveLength(0);
  });
});

describe("sortAgents", () => {
  const agents = [
    makeAgent({ name: "Charlie", divisionLabel: "Writing" }),
    makeAgent({ name: "Alpha", divisionLabel: "Productivity" }),
    makeAgent({ name: "Bravo", divisionLabel: "Writing" }),
  ];

  it("sorts ascending by name", () => {
    expect(sortAgents(agents, "name-asc").map((a) => a.name)).toEqual(["Alpha", "Bravo", "Charlie"]);
  });

  it("sorts descending by name", () => {
    expect(sortAgents(agents, "name-desc").map((a) => a.name)).toEqual(["Charlie", "Bravo", "Alpha"]);
  });

  it("sorts by division then name ascending", () => {
    const sorted = sortAgents(agents, "type-asc").map((a) => [a.divisionLabel, a.name]);
    expect(sorted).toEqual([
      ["Productivity", "Alpha"],
      ["Writing", "Bravo"],
      ["Writing", "Charlie"],
    ]);
  });

  it("sorts by division then name descending", () => {
    const sorted = sortAgents(agents, "type-desc").map((a) => [a.divisionLabel, a.name]);
    // divisions sort desc; name tie-break stays ascending within a division
    expect(sorted).toEqual([
      ["Writing", "Bravo"],
      ["Writing", "Charlie"],
      ["Productivity", "Alpha"],
    ]);
  });

  it("does not mutate the input array", () => {
    const original = [...agents];
    sortAgents(agents, "name-asc");
    expect(agents.map((a) => a.name)).toEqual(original.map((a) => a.name));
  });
});

describe("parseFrontmatterLine", () => {
  it("parses a simple key-value line", () => {
    expect(parseFrontmatterLine("name: value")).toEqual(["name", "value"]);
  });

  it("trims whitespace around key and value", () => {
    expect(parseFrontmatterLine("  name   :   value  ")).toEqual(["name", "value"]);
  });

  it("strips matching double quotes", () => {
    expect(parseFrontmatterLine('name: "quoted value"')).toEqual(["name", "quoted value"]);
  });

  it("strips matching single quotes", () => {
    expect(parseFrontmatterLine("name: 'single'")).toEqual(["name", "single"]);
  });

  it("returns null for a line without a colon", () => {
    expect(parseFrontmatterLine("no colon here")).toBeNull();
  });
});

describe("parseFrontmatterFallback", () => {
  it("parses fields and separates body content", () => {
    const { data, content } = parseFrontmatterFallback(
      "---\nname: Test\nvibe: \"calm\"\n---\nHello body",
    );
    expect(data).toEqual({ name: "Test", vibe: "calm" });
    expect(content).toBe("Hello body");
  });

  it("returns the raw text as content when there is no frontmatter", () => {
    const { data, content } = parseFrontmatterFallback("just content");
    expect(data).toEqual({});
    expect(content).toBe("just content");
  });
});

describe("buildSummary", () => {
  it("uses metadata when present", () => {
    const summary = buildSummary(
      "productivity/notes.md",
      "---\nname: My Agent\nemoji: 🦄\ndescription: Does things\nvibe: quirky\n---\nbody",
      DIVISIONS,
    );
    expect(summary).toMatchObject({
      path: "productivity/notes.md",
      slug: "notes",
      name: "My Agent",
      emoji: "🦄",
      description: "Does things",
      vibe: "quirky",
      division: "productivity",
      divisionLabel: "Productivity",
      divisionColor: "#123456",
    });
  });

  it("falls back to a title-derived name and defaults", () => {
    const summary = buildSummary("writing/scribe.md", "---\n---\nbody", DIVISIONS);
    expect(summary.name).toBe("Scribe");
    expect(summary.emoji).toBe("🤖");
    expect(summary.description).toBe("");
    expect(summary.vibe).toBe("");
  });

  it("labels unknown divisions with the raw slug and a default color", () => {
    const summary = buildSummary("mystery/thing.md", "---\n---\n", DIVISIONS);
    expect(summary.divisionLabel).toBe("mystery");
    expect(summary.divisionColor).toBe("#6B7280");
  });
});

describe("agentPathToHref", () => {
  it("prefixes the path with /agent/", () => {
    expect(agentPathToHref("productivity/notes.md")).toBe("/agent/productivity/notes.md");
  });
});

describe("mapConcurrent", () => {
  it("runs every item and preserves order", async () => {
    const calls: number[] = [];
    const results = await mapConcurrent([1, 2, 3, 4], 2, async (n) => {
      calls.push(n);
      return n * 2;
    });
    expect(results).toEqual([2, 4, 6, 8]);
    expect(calls.sort()).toEqual([1, 2, 3, 4]);
  });

  it("handles an empty input without concurrency work", async () => {
    const results = await mapConcurrent<string, string>([], 5, async (s) => s);
    expect(results).toEqual([]);
  });
});
