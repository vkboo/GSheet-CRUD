"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

const BASE_URL = "https://gsheet_sql.dev.iglooinsure.com/api";
const EXAMPLE_DOC_ID = "1fQqyNzfEC33vwGrfNLd_WTQjA39B1J_9kmEPFLfCUNc";

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors cursor-pointer"
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
      </div>
      <pre className="p-4 bg-code-bg overflow-x-auto">
        <code className="text-sm font-mono text-foreground whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-accent-blue/20 text-accent-blue border-accent-blue/30",
    POST: "bg-accent-green/20 text-accent-green border-accent-green/30",
    PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded border ${colors[method]}`}>
      {method}
    </span>
  );
}

const sections = [
  { id: "prerequisites", label: "Prerequisites", group: "Getting Started" },
  { id: "url-format", label: "URL Format", group: "Getting Started" },
  { id: "get", label: "GET - Query Data", group: "API Reference" },
  { id: "post", label: "POST - Insert Data", group: "API Reference" },
  { id: "put", label: "PUT - Update Data", group: "API Reference" },
  { id: "delete", label: "DELETE - Delete Data", group: "API Reference" },
  { id: "vercel", label: "Deploy to Vercel", group: "Deployment" },
  { id: "self-host", label: "Self-hosting", group: "Deployment" },
];

export default function DocsPage() {
  const groups = [...new Set(sections.map((s) => s.group))];
  const [activeSection, setActiveSection] = useState<string>("prerequisites");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) => ({
        id: s.id,
        element: document.getElementById(s.id),
      }));

      const scrollPosition = window.scrollY + 120;

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
      const top = element.offsetTop - 96;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-foreground hover:opacity-80 transition-opacity">
            <span className="text-2xl">⚡</span>
            <span>GSheet-CRUD</span>
          </Link>
          <div className="flex gap-8">
            <Link href="/docs" className="text-foreground text-sm font-medium">
              Docs
            </Link>
            <a
              href="https://github.com/joway/sheetsql"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside className="hidden lg:block w-64 shrink-0 fixed top-16 left-0 h-[calc(100vh-4rem)] border-r border-border overflow-y-auto bg-background">
          <div className="p-6">
            {groups.map((group) => (
              <div key={group} className="mb-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{group}</h4>
                <div className="flex flex-col gap-1">
                  {sections
                    .filter((s) => s.group === group)
                    .map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        onClick={(e) => handleNavClick(e, s.id)}
                        className={`text-sm py-1.5 px-2 rounded transition-all ${
                          activeSection === s.id
                            ? "text-accent-green bg-accent-green/10 font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        {s.label}
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 min-w-0 px-4 md:px-8 py-12 max-w-4xl lg:ml-64">
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-lg text-muted-foreground">Learn how to use GSheet-CRUD to turn your Google Sheets into a REST API.</p>
          </header>

          <section id="prerequisites" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">Prerequisites</h2>

            <div className="p-6 bg-card border border-border rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-3">1. Share Your Google Sheets</h3>
              <p className="text-muted-foreground mb-4">
                Add the following service account email as an <strong className="text-foreground">Editor</strong> to your Google Sheets.
                Without this permission, the API cannot read or write data.
              </p>
              <CodeBlock code="google-sheet-db@mythic-groove-485702-k4.iam.gserviceaccount.com" language="email" />
              <div className="flex flex-col gap-2 mt-4">
                {[
                  "Open your Google Sheets document",
                  'Click "Share" button in the top right',
                  "Paste the service account email",
                  'Set permission to "Editor"',
                  'Click "Done"',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="w-5 h-5 flex items-center justify-center bg-secondary text-foreground text-xs font-medium rounded-full">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-lg font-semibold mb-3">2. Prepare Your Data</h3>
              <p className="text-muted-foreground mb-4">Your sheet must follow this structure:</p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>First row contains column names (field names)</li>
                <li>Data starts from the second row</li>
              </ul>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-accent-blue/10">
                      <th className="px-4 py-3 text-left font-semibold text-accent-blue border-r border-border">name</th>
                      <th className="px-4 py-3 text-left font-semibold text-accent-blue border-r border-border">age</th>
                      <th className="px-4 py-3 text-left font-semibold text-accent-blue">email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-4 py-3 border-r border-border">John</td>
                      <td className="px-4 py-3 border-r border-border">25</td>
                      <td className="px-4 py-3">john@example.com</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-4 py-3 border-r border-border">Jane</td>
                      <td className="px-4 py-3 border-r border-border">30</td>
                      <td className="px-4 py-3">jane@example.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="url-format" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">URL Format</h2>
            <CodeBlock code={`${BASE_URL}/{doc_id}/{sheet_name}`} language="url" />
            <div className="space-y-3 mt-4">
              <div className="flex gap-4 text-sm">
                <code className="text-accent-green font-mono">doc_id</code>
                <span className="text-muted-foreground">
                  Google Sheets document ID (from URL: <code className="text-foreground">docs.google.com/spreadsheets/d/<strong>&#123;doc_id&#125;</strong>/edit</code>)
                </span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="text-accent-green font-mono">sheet_name</code>
                <span className="text-muted-foreground">
                  Sheet name (optional, defaults to <code className="text-foreground">Sheet1</code>)
                </span>
              </div>
            </div>
          </section>

          <section id="get" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MethodBadge method="GET" /> Query Data
            </h2>

            <h3 className="text-lg font-semibold mb-2">Get All Data</h3>
            <p className="text-muted-foreground mb-2">Retrieve all records from a sheet:</p>
            <CodeBlock code={`curl --location '${BASE_URL}/${EXAMPLE_DOC_ID}'`} />

            <h3 className="text-lg font-semibold mb-2 mt-8">Query with Conditions</h3>
            <p className="text-muted-foreground mb-2">Filter data using query parameters:</p>
            <CodeBlock code={`curl --location '${BASE_URL}/${EXAMPLE_DOC_ID}?name=John&age=25'`} />

            <div className="mt-8 p-4 bg-card border border-border rounded-lg">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Response Example</h4>
              <CodeBlock
                code={`{
  "data": [
    {"name": "John", "age": 25, "email": "john@example.com"}
  ]
}`}
                language="json"
              />
            </div>
          </section>

          <section id="post" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MethodBadge method="POST" /> Insert Data
            </h2>

            <h3 className="text-lg font-semibold mb-2">Insert Single Record</h3>
            <CodeBlock
              code={`curl --location '${BASE_URL}/${EXAMPLE_DOC_ID}' \\
--header 'Content-Type: application/json' \\
--data '{
  "name": "Mike",
  "age": 28,
  "email": "mike@example.com"
}'`}
            />

            <h3 className="text-lg font-semibold mb-2 mt-8">Insert Multiple Records</h3>
            <CodeBlock
              code={`curl --location '${BASE_URL}/${EXAMPLE_DOC_ID}' \\
--header 'Content-Type: application/json' \\
--data '[
  {"name": "Mike", "age": 28, "email": "mike@example.com"},
  {"name": "Sarah", "age": 35, "email": "sarah@example.com"}
]'`}
            />
          </section>

          <section id="put" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MethodBadge method="PUT" /> Update Data
            </h2>
            <p className="text-muted-foreground mb-4">Use query parameters to match records, then update with request body:</p>
            <CodeBlock
              code={`curl --location --request PUT '${BASE_URL}/${EXAMPLE_DOC_ID}?name=John' \\
--header 'Content-Type: application/json' \\
--data '{
  "age": 26,
  "email": "new_email@example.com"
}'`}
            />
            <div className="mt-4 p-4 bg-accent-blue/10 border border-accent-blue/30 rounded-lg">
              <p className="text-sm text-accent-blue">
                <strong>Note:</strong> All records matching the query parameters will be updated.
              </p>
            </div>
          </section>

          <section id="delete" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MethodBadge method="DELETE" /> Delete Data
            </h2>
            <p className="text-muted-foreground mb-4">Use query parameters to match and delete records:</p>
            <CodeBlock code={`curl --location --request DELETE '${BASE_URL}/${EXAMPLE_DOC_ID}?name=John'`} />

            <h3 className="text-lg font-semibold mb-2 mt-8">Delete with Request Body</h3>
            <p className="text-muted-foreground mb-4">You can also specify match criteria in the request body:</p>
            <CodeBlock
              code={`curl --location --request DELETE '${BASE_URL}/${EXAMPLE_DOC_ID}' \\
--header 'Content-Type: application/json' \\
--data '{"name": "lei", "age": 78}'`}
            />
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">
                <strong>Warning:</strong> All records matching the criteria will be deleted. Use with caution.
              </p>
            </div>
          </section>

          <section id="vercel" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">Deploy to Vercel</h2>
            <p className="text-muted-foreground mb-4">The easiest way to deploy GSheet-CRUD:</p>
            <div className="flex flex-col gap-3 mb-6">
              {["Push the project to GitHub", "Import the project in Vercel", "Add environment variable:"].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 flex items-center justify-center bg-accent-green text-black text-xs font-bold rounded-full">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
            <div className="p-4 bg-card border border-border rounded-lg mb-4">
              <div className="flex gap-4 text-sm mb-2">
                <span className="text-muted-foreground w-16">Name:</span>
                <code className="text-accent-green">GOOGLE_SERVICE_ACCOUNT_CREDENTIALS</code>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-muted-foreground w-16">Value:</span>
                <span className="text-foreground">
                  Contents of your <code className="text-accent-green">google-serviceaccount.json</code> file
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 flex items-center justify-center bg-accent-green text-black text-xs font-bold rounded-full">4</span>
              Click Deploy
            </div>
          </section>

          <section id="self-host" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">Self-hosting</h2>
            <h3 className="text-lg font-semibold mb-2">Build for Production</h3>
            <CodeBlock
              code={`npm run build
npm run start`}
            />
            <h3 className="text-lg font-semibold mb-2 mt-8">Environment Configuration</h3>
            <p className="text-muted-foreground mb-4">Choose one of these methods to configure credentials:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                Set <code className="text-accent-green">GOOGLE_SERVICE_ACCOUNT_CREDENTIALS</code> environment variable (value is the JSON content)
              </li>
              <li>
                Place <code className="text-accent-green">google-serviceaccount.json</code> file in the project root
              </li>
            </ul>
          </section>

          <footer className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              Built with{" "}
              <a href="https://github.com/joway/sheetsql" target="_blank" rel="noopener noreferrer" className="text-accent-green hover:opacity-80">
                sheetsql
              </a>{" "}
              & Next.js — MIT License
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
