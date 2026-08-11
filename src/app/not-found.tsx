import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Agent not found
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        That markdown file does not exist in the upstream repository.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        Back to overview
      </Link>
    </main>
  );
}
