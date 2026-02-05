"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

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
  const codeColor = language === "bash" ? "text-[#0f766e]" : "text-[#1a1a1a]";
  return (
    <div className="rounded-lg border border-[#e5e5e5] overflow-hidden my-4 bg-[#f9f9f9]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f5] border-b border-[#e5e5e5]">
        <span className="text-xs font-mono text-[#737373]">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`text-sm font-mono whitespace-pre ${codeColor}`}>{code}</code>
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

const navItems = [
  { id: "overview", label: "Overview" },
  { id: "quick-start", label: "Quick start" },
  {
    label: "API",
    children: [
      { id: "url-format", label: "URL Format" },
      { id: "get", label: "GET" },
      { id: "post", label: "POST" },
      { id: "put", label: "PUT" },
      { id: "delete", label: "DELETE" },
    ],
  },
];

const sectionIds = navItems.flatMap((item) =>
  item.children ? item.children.map((child) => child.id) : item.id ? [item.id] : []
);

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sectionIds.map((id) => ({
        id,
        element: document.getElementById(id),
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
              {navItems.map((item) => {
                const hasChildren = !!item.children?.length;
                const isActive = item.id ? activeSection === item.id : false;
                const isParentActive = hasChildren ? item.children?.some((child) => child.id === activeSection) : false;

                return (
                  <div key={item.label} className="mb-2">
                    {item.id ? (
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleNavClick(e, item.id)}
                        className={`text-[15px] py-1 transition-colors flex items-center gap-2 ${
                          isActive
                            ? "text-[#1a1a1a] font-medium"
                            : "text-[#737373] hover:text-[#1a1a1a]"
                        }`}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <div
                        className={`text-xs uppercase tracking-wider font-semibold py-1 ${
                          isParentActive ? "text-[#1a1a1a]" : "text-[#737373]"
                        }`}
                      >
                        {item.label}
                      </div>
                    )}
                    {hasChildren ? (
                      <div className="ml-3 border-l border-[#e5e5e5] pl-3 flex flex-col gap-0.5">
                        {item.children?.map((child) => (
                          <a
                            key={child.id}
                            href={`#${child.id}`}
                            onClick={(e) => handleNavClick(e, child.id)}
                            className={`text-[14px] py-1 transition-colors ${
                              activeSection === child.id
                                ? "text-[#1a1a1a] font-medium"
                                : "text-[#737373] hover:text-[#1a1a1a]"
                            }`}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0 py-12 max-w-[680px]">
            <section id="overview" className="mb-12">
              <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-2">Overview</h1>
              <p className="text-lg text-[#737373] mb-10">Vibe Coding guide for non-technical users</p>

              <p className="text-[#404040] leading-[1.7] mb-5">
                This guide is written for non-technical roles. You do not need to build a backend or understand databases. If you can use
                Google Sheets, you can use it as your database and ship a working system fast.
              </p>

              <p className="text-[#404040] leading-[1.7] mb-5">
                <strong className="text-[#1a1a1a] font-semibold">GSheet-CRUD</strong> turns Google Sheets into a full REST API. You only need
                to describe your business needs and the AI can assemble the UI and features.
              </p>

            </section>

            <SectionHeading id="quick-start">Quick start</SectionHeading>

            <div className="space-y-6">
              <div className="p-4 bg-white border border-[#e5e5e5] rounded-lg">
                <p className="text-[15px] font-semibold text-[#1a1a1a] mb-2">1. Create a new Sheet and grant access</p>
                <p className="text-[#404040] mb-3">
                  Create a Google Sheet and add the email below as an <strong className="text-[#1a1a1a] font-semibold">Editor</strong>.
                  This is a fixed company DevOps account and should not be replaced.
                  <strong className="text-[#1a1a1a] font-semibold">Sharing with this email does not pose a data leakage risk.</strong>
                </p>
                <CodeBlock code="google-sheet-db@mythic-groove-485702-k4.iam.gserviceaccount.com" language="email" />
                <p className="text-sm text-[#737373] mt-3">
                  If you only need a <strong className="text-[#1a1a1a] font-semibold">temporary</strong> sheet, you can use:
                  <a
                    href="https://docs.google.com/spreadsheets/d/1mFZCZ7UUoaOKYpCwhMCgzkkUuz83VyvsgqW3kbJ2xMI/edit?gid=0#gid=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563eb] hover:underline ml-2"
                  >
                    Sample Sheet
                  </a>
                </p>
              </div>

              <div className="p-4 bg-white border border-[#e5e5e5] rounded-lg">
                <p className="text-[15px] font-semibold text-[#1a1a1a] mb-2">2. Create a new project on your computer</p>
                <p className="text-[#404040] mb-3">
                  Example project name:{" "}
                  <code className="bg-[#f0f0f0] px-1.5 py-0.5 rounded text-[#1a1a1a] font-mono text-[13px]">manage_demo</code>
                </p>
                <CodeBlock
                  code={`mkdir manage_demo
cd manage_demo`}
                />
              </div>

              <div className="p-4 bg-white border border-[#e5e5e5] rounded-lg">
                <p className="text-[15px] font-semibold text-[#1a1a1a] mb-2">3. Install the GSheet-CRUD Skill</p>
                <p className="text-[#404040] mb-3">Copy and run:</p>
                <CodeBlock code="npx skills add git@gitlab.iglooinsure.com:axinan/fe/platform/gsheet-crud.git" />
              </div>

              <div className="p-4 bg-white border border-[#e5e5e5] rounded-lg">
                <p className="text-[15px] font-semibold text-[#1a1a1a] mb-2">4. Use this prompt to generate the app</p>
                <CodeBlock
                  code={`According to the requirements in SKILL.md, use\nhttps://docs.google.com/spreadsheets/d/1mFZCZ7UUoaOKYpCwhMCgzkkUuz83VyvsgqW3kbJ2xMI/edit?gid=0#gid=0\nas the database to build a simple student management system.\n\nUse Vite + React + Tailwind CSS + shadcn.`}
                  language="text"
                />
              </div>

              <div className="p-4 bg-white border border-[#e5e5e5] rounded-lg">
                <p className="text-[15px] font-semibold text-[#1a1a1a] mb-2">5. Wait for the page to generate</p>
                <p className="text-[#404040]">When generation completes, preview the page directly.</p>
              </div>
            </div>

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
