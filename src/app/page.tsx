"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

const BASE_URL = "https://gsheet-sql.dev.iglooinsure.com/api";
const EXAMPLE_DOC_ID = "1fQqyNzfEC33vwGrfNLd_WTQjA39B1J_9kmEPFLfCUNc";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 text-xs text-[#737373] hover:text-[#1a1a1a] hover:bg-[#f0f0f0] rounded transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  return (
    <div className="rounded-lg border border-[#e5e5e5] overflow-hidden my-4 bg-[#f9f9f9]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f5] border-b border-[#e5e5e5]">
        <span className="text-xs font-mono text-[#737373]">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-[#1a1a1a] whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function SectionHeading({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="flex items-center gap-4 text-[17px] font-semibold text-[#1a1a1a] mt-14 mb-4 scroll-mt-8">
      <span>{children}</span>
      <span className="flex-1 h-px bg-[#e5e5e5]" />
    </h2>
  );
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "quick-start", label: "Quick start" },
  { id: "ai-skills", label: "AI Skills", icon: true },
  { id: "url-format", label: "URL Format" },
  { id: "get", label: "GET" },
  { id: "post", label: "POST" },
  { id: "put", label: "PUT" },
  { id: "delete", label: "DELETE" },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) => ({
        id: s.id,
        element: document.getElementById(s.id),
      }));

      const scrollPosition = window.scrollY + 100;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 32;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <div className="flex gap-16">
          <aside className="hidden lg:block w-44 shrink-0">
            <div className="sticky top-12 pt-12 h-fit">
              <div className="mb-8">
                <img src="/logo.svg" alt="Igloo" className="h-8 mb-2" />
                <div className="text-sm font-mono text-[#737373]">GSheet-CRUD</div>
              </div>

              <nav className="flex flex-col gap-0.5">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => handleNavClick(e, s.id)}
                  className={`text-[15px] py-1 transition-colors flex items-center gap-2 ${
                    activeSection === s.id
                      ? "text-[#1a1a1a] font-medium"
                      : "text-[#737373] hover:text-[#1a1a1a]"
                  }`}
                >
                  {s.label}
                  {s.icon && (
                    <Sparkles className="w-3.5 h-3.5 text-[#4E4EEB]" />
                  )}
                </a>
              ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0 py-12 max-w-[680px]">
            <section id="overview" className="mb-12">
              <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-2">Overview</h1>
              <p className="text-lg text-[#737373] mb-10">Turn Google Sheets into a REST API</p>

              <p className="text-[#404040] leading-[1.7] mb-5">
                <strong className="text-[#1a1a1a] font-semibold">GSheet-CRUD</strong> (gsheet + crud) is a lightweight service that transforms your Google Sheets into a full-featured REST API. Create, read, update, and delete data using standard HTTP methods.
              </p>

              <p className="text-[#404040] leading-[1.7] mb-5">
                Built on{" "}
                <a href="https://github.com/joway/sheetsql" target="_blank" rel="noopener noreferrer" className="text-[#2563eb] hover:underline">
                  sheetsql
                </a>
                , it provides a simple way to use Google Sheets as a database for prototypes, internal tools, or small applications. No backend required.
              </p>

              <p className="text-[#404040] leading-[1.7]">
                The key insight: Google Sheets is already a database that everyone knows how to use. GSheet-CRUD just adds an API layer on top.
              </p>
            </section>

            <SectionHeading id="quick-start">Quick start</SectionHeading>

            <ol className="list-decimal list-inside space-y-2 text-[#404040] mb-6 marker:text-[#737373]">
              <li><strong className="text-[#1a1a1a] font-semibold">Share</strong> your Google Sheet with the service account as Editor</li>
              <li><strong className="text-[#1a1a1a] font-semibold">Format</strong> your data — first row = column names, data starts from row 2</li>
              <li><strong className="text-[#1a1a1a] font-semibold">Call</strong> the API using your document ID from the sheet URL</li>
            </ol>

            <p className="text-sm text-[#737373] mb-2">Service account email:</p>
            <CodeBlock code="google-sheet-db@mythic-groove-485702-k4.iam.gserviceaccount.com" language="email" />

            <div className="my-6 p-4 bg-white border border-[#e5e5e5] rounded-lg">
              <p className="text-sm text-[#737373] mb-3">Your sheet should be structured like this:</p>
              <div className="border border-[#e5e5e5] rounded overflow-hidden text-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f5f5f5]">
                      <th className="px-4 py-2.5 text-left font-semibold text-[#1a1a1a] border-r border-[#e5e5e5]">name</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-[#1a1a1a] border-r border-[#e5e5e5]">age</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-[#1a1a1a]">email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#e5e5e5]">
                      <td className="px-4 py-2.5 border-r border-[#e5e5e5] text-[#404040]">John</td>
                      <td className="px-4 py-2.5 border-r border-[#e5e5e5] text-[#404040]">25</td>
                      <td className="px-4 py-2.5 text-[#404040]">john@example.com</td>
                    </tr>
                    <tr className="border-t border-[#e5e5e5]">
                      <td className="px-4 py-2.5 border-r border-[#e5e5e5] text-[#404040]">Jane</td>
                      <td className="px-4 py-2.5 border-r border-[#e5e5e5] text-[#404040]">30</td>
                      <td className="px-4 py-2.5 text-[#404040]">jane@example.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <SectionHeading id="ai-skills">AI Skills</SectionHeading>

            <p className="text-[#404040] mb-4">
              Install the GSheet-CRUD skill to your AI coding assistant for complete API documentation and examples.
            </p>

            <CodeBlock code="npx skills add git@gitlab.iglooinsure.com:axinan/fe/platform/gsheet-crud.git" />

            <p className="text-sm text-[#737373]">
              Works with Cursor, Claude Code, Windsurf, and other AI-powered IDEs.
            </p>

            <SectionHeading id="url-format">URL Format</SectionHeading>

            <CodeBlock code={`${BASE_URL}/{doc_id}/{sheet_name}`} language="url" />

            <ul className="space-y-2 text-sm text-[#404040]">
              <li>
                <code className="bg-[#f0f0f0] px-1.5 py-0.5 rounded text-[#1a1a1a] font-mono text-[13px]">doc_id</code>
                <span className="text-[#737373]"> — Google Sheets document ID (from URL: docs.google.com/spreadsheets/d/<strong className="text-[#404040]">{"{doc_id}"}</strong>/edit)</span>
              </li>
              <li>
                <code className="bg-[#f0f0f0] px-1.5 py-0.5 rounded text-[#1a1a1a] font-mono text-[13px]">sheet_name</code>
                <span className="text-[#737373]"> — Sheet name (optional, defaults to Sheet1)</span>
              </li>
            </ul>

            <SectionHeading id="get">GET — Query Data</SectionHeading>

            <p className="text-[#404040] mb-2">Get all data from a sheet:</p>
            <CodeBlock code={`curl '${BASE_URL}/${EXAMPLE_DOC_ID}'`} />

            <p className="text-[#404040] mb-2 mt-6">Filter with query parameters:</p>
            <CodeBlock code={`curl '${BASE_URL}/${EXAMPLE_DOC_ID}?name=John&age=25'`} />

            <p className="text-sm text-[#737373] mt-4 mb-2">Response:</p>
            <CodeBlock
              code={`{
  "data": [
    {"name": "John", "age": 25, "email": "john@example.com"}
  ]
}`}
              language="json"
            />

            <SectionHeading id="post">POST — Insert Data</SectionHeading>

            <p className="text-[#404040] mb-2">Insert a single record:</p>
            <CodeBlock
              code={`curl '${BASE_URL}/${EXAMPLE_DOC_ID}' \\
  -H 'Content-Type: application/json' \\
  -d '{"name": "Mike", "age": 28, "email": "mike@example.com"}'`}
            />

            <p className="text-[#404040] mb-2 mt-6">Insert multiple records:</p>
            <CodeBlock
              code={`curl '${BASE_URL}/${EXAMPLE_DOC_ID}' \\
  -H 'Content-Type: application/json' \\
  -d '[
    {"name": "Mike", "age": 28},
    {"name": "Sarah", "age": 35}
  ]'`}
            />

            <SectionHeading id="put">PUT — Update Data</SectionHeading>

            <p className="text-[#404040] mb-2">Use query parameters to match records, update with request body:</p>
            <CodeBlock
              code={`curl -X PUT '${BASE_URL}/${EXAMPLE_DOC_ID}?name=John' \\
  -H 'Content-Type: application/json' \\
  -d '{"age": 26, "email": "new@example.com"}'`}
            />

            <p className="text-sm text-[#2563eb] mt-4">
              <strong>Note:</strong> All records matching the query will be updated.
            </p>

            <SectionHeading id="delete">DELETE — Delete Data</SectionHeading>

            <p className="text-[#404040] mb-2">Delete by query parameters:</p>
            <CodeBlock code={`curl -X DELETE '${BASE_URL}/${EXAMPLE_DOC_ID}?name=John'`} />

            <p className="text-[#404040] mb-2 mt-6">Or specify criteria in the request body:</p>
            <CodeBlock
              code={`curl -X DELETE '${BASE_URL}/${EXAMPLE_DOC_ID}' \\
  -H 'Content-Type: application/json' \\
  -d '{"name": "John", "age": 25}'`}
            />

            <p className="text-sm text-[#dc2626] mt-4">
              <strong>Warning:</strong> All matching records will be deleted. Use with caution.
            </p>

            <footer className="mt-16 pt-6 border-t border-[#e5e5e5] text-sm text-[#737373]">
              <p>
                Built with{" "}
                <a href="https://github.com/joway/sheetsql" target="_blank" rel="noopener noreferrer" className="text-[#404040] hover:text-[#1a1a1a] underline">
                  sheetsql
                </a>
                {" "}& Next.js
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
