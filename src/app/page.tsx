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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-7 sm:px-8 sm:py-10">
      <header className="mb-10">
        <nav className="mb-16 flex items-center justify-between border-b border-[var(--line)] pb-5">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight text-[var(--ink)]">
            <span className="grid size-8 place-items-center rounded-lg bg-[var(--ink)] text-base text-white">✦</span>
            agency<span className="font-normal text-[var(--coral)]">/</span>agents
          </Link>
          <div className="flex items-center gap-4">
            <Link href={getUpstreamRepoUrl()} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)] transition hover:text-[var(--coral)]">
              GitHub ↗
            </Link>
            <Link
              href="https://github.com/Maduki-tech/agencyagentlist"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3.5 py-1.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--coral)] hover:text-[var(--coral)]"
            >
              <span aria-hidden="true" className="leading-none">★</span>
              Star
            </Link>
          </div>
        </nav>
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[var(--coral)]">The specialist directory</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-0.055em] text-[var(--ink)] sm:text-7xl">
              Find the right<br /><span className="text-[var(--coral)]">mind</span> for the job.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)]">
              A living collection of specialist AI agents from Agency. Explore their unique skills, working styles, and operating manuals.
            </p>
          </div>
          <div className="hidden text-right md:block">
            <p className="font-mono text-5xl font-medium tracking-[-0.06em] text-[var(--ink)]">{agents.length}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">agents indexed</p>
          </div>
        </div>
      </header>

      <AgentOverview agents={agents} divisions={divisionOptions} />
    </main>
  );
}
