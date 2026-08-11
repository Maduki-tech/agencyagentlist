import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownView } from "@/components/MarkdownView";
import { getAgentDetail } from "@/lib/agents";
import { getGitHubBlobUrl } from "@/lib/github";

export const revalidate = 3600;

type AgentPageProps = {
  params: Promise<{ path: string[] }>;
};

export default async function AgentPage({ params }: AgentPageProps) {
  const { path } = await params;
  const agentPath = path.join("/");
  const agent = await getAgentDetail(agentPath);

  if (!agent) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-7 sm:px-8 sm:py-10">
      <div className="mb-10 space-y-8">
        <nav className="flex items-center justify-between border-b border-[var(--line)] pb-5">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight text-[var(--ink)]"><span className="grid size-8 place-items-center rounded-lg bg-[var(--ink)] text-base text-white">✦</span>agency<span className="font-normal text-[var(--coral)]">/</span>agents</Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--coral)]">← All agents</Link>
        </nav>

        <div className="space-y-4 rounded-3xl border border-[var(--line)] bg-white/70 p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#f1eee7] text-3xl" aria-hidden>{agent.emoji}</span>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
              {agent.name}
            </h1>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: agent.divisionColor }}
            >
              {agent.divisionLabel}
            </span>
          </div>

          {agent.description ? (
            <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
              {agent.description}
            </p>
          ) : null}

          {agent.vibe ? (
            <p className="text-sm italic text-[#969990]">“{agent.vibe}”</p>
          ) : null}

          <Link
            href={getGitHubBlobUrl(agent.path)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-sm font-semibold text-[var(--coral)] underline decoration-[#f1b6a5] underline-offset-4 transition hover:text-[var(--ink)]"
          >
            Open source file on GitHub
          </Link>
        </div>
      </div>

      <MarkdownView content={agent.content} />
    </main>
  );
}
