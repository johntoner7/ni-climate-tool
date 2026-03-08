import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "Methodology — NI Climate Tool",
};

export default async function MethodologyPage() {
  const filePath = path.join(process.cwd(), "content", "methodology.md");
  const content = await readFile(filePath, "utf-8");

  return (
    <div className="max-w-2xl lg:max-w-4xl mx-auto px-8 py-14">
      <Link
        href="/"
        className="text-sm text-gray-400 hover:text-gray-600 mb-10 inline-block"
      >
        ← Back
      </Link>
      <div className="prose-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-semibold text-gray-800 mb-6 mt-8 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold text-gray-700 mb-3 mt-8">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-6 uppercase tracking-wide">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="text-sm text-gray-600 leading-relaxed mb-4 list-disc pl-5 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="text-sm text-gray-600 leading-relaxed mb-4 list-decimal pl-5 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => <li>{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-700">{children}</strong>
            ),
            hr: () => <hr className="border-gray-100 my-8" />,
            table: ({ children }) => (
              <div className="overflow-x-auto mb-6">
                <table className="text-sm text-gray-600 w-full border-collapse">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b border-gray-200">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="text-left font-semibold text-gray-700 py-2 pr-6">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="py-2 pr-6 border-b border-gray-50">{children}</td>
            ),
            code: ({ children }) => (
              <code className="text-xs bg-gray-50 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                {children}
              </code>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
