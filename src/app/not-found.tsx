import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center px-5 py-16 sm:px-8">
      <span className="mb-5 text-5xl">🧭</span>
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--ink)]">
        Agent not found
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        That markdown file does not exist in the upstream repository.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#26385f]"
      >
        Back to overview
      </Link>
    </main>
  );
}
