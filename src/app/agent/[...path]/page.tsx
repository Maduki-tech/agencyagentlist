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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 space-y-4">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to overview
        </Link>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {agent.emoji}
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {agent.name}
            </h1>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: agent.divisionColor }}
            >
              {agent.divisionLabel}
            </span>
          </div>

          {agent.description ? (
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              {agent.description}
            </p>
          ) : null}

          {agent.vibe ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">{agent.vibe}</p>
          ) : null}

          <Link
            href={getGitHubBlobUrl(agent.path)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-sm font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Open source file on GitHub
          </Link>
        </div>
      </div>

      <MarkdownView content={agent.content} />
    </main>
  );
}
