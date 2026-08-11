import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownViewProps = {
  content: string;
};

export function MarkdownView({ content }: MarkdownViewProps) {
  return (
    <article className="prose prose-zinc max-w-none rounded-3xl border border-[var(--line)] bg-white/75 p-6 shadow-[0_12px_40px_rgba(20,33,61,.04)] prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[var(--coral)] prose-blockquote:border-[var(--coral)] prose-pre:bg-[#14213d] prose-pre:text-zinc-100 sm:p-10">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
