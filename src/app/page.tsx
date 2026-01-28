"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowRight, Database, RefreshCw, Zap, Search, Sparkles } from "lucide-react";

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
      className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md border border-border bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-foreground hover:opacity-80 transition-opacity">
            <span className="text-2xl">⚡</span>
            <span>GSheet-CRUD</span>
          </Link>
          <div className="flex gap-8">
            <Link href="/docs" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
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

      <main className="flex-1 pt-16">
        <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 md:px-8 py-16 gap-16 overflow-hidden">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.15)_0%,rgba(59,130,246,0.08)_40%,transparent_70%)] pointer-events-none animate-pulse" />
          
          <div className="relative text-center max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-card-bg border border-border rounded-full text-sm text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
              Built on sheetsql
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
              Google Sheets
              <br />
              <span className="bg-gradient-to-r from-accent-green via-accent-blue to-accent-purple bg-clip-text text-transparent">
                as RESTful API
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              Transform your Google Sheets into a full-featured REST API with complete CRUD operations.
              No backend required. Deploy to Vercel in one click.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg">
                <Link href="/docs" className="gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/vkboo/GSheet-CRUD" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>

          <div className="relative w-full max-w-xl bg-code-bg border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 shadow-2xl">
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">Terminal</span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed">
              <div className="mb-3">
                <span className="text-accent-green">$</span>
                <span className="text-accent-blue ml-2">curl</span>
                <span className="text-muted-foreground"> https://gsheet-sql.dev.iglooinsure.com/api/YOUR_DOC_ID</span>
              </div>
              <div className="text-foreground">
                <span className="text-muted-foreground">{"{"}</span>
                <br />
                <span className="text-accent-blue">&nbsp;&nbsp;&quot;data&quot;</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-muted-foreground"> [</span>
                <br />
                <span className="text-muted-foreground">&nbsp;&nbsp;&nbsp;&nbsp;{"{"}</span>
                <span className="text-accent-blue">&quot;name&quot;</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-accent-green"> &quot;John&quot;</span>
                <span className="text-muted-foreground">,</span>
                <span className="text-accent-blue"> &quot;age&quot;</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-accent-purple"> 25</span>
                <span className="text-muted-foreground">{"}"}</span>
                <br />
                <span className="text-muted-foreground">&nbsp;&nbsp;]</span>
                <br />
                <span className="text-muted-foreground">{"}"}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-8 py-24 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why GSheet-CRUD?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Database, title: "Google Sheets as Database", desc: "Use familiar spreadsheet interface. Edit data directly in Google Sheets while your API stays in sync." },
              { icon: RefreshCw, title: "Full CRUD Operations", desc: "Complete RESTful API with GET, POST, PUT, DELETE. Query, filter, insert, update and delete with ease." },
              { icon: Zap, title: "One-Click Deploy", desc: "Built with Next.js. Deploy to Vercel in seconds. No server configuration required." },
              { icon: Search, title: "Query Parameters", desc: "Filter data using URL query parameters. Find exactly what you need with simple queries." },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-card-bg border border-border rounded-xl transition-all duration-300 hover:border-accent-green hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)]"
              >
                <feature.icon className="w-8 h-8 text-accent-green mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-8 py-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Start</h2>
          <div className="flex flex-col gap-8 mb-12">
            {[
              {
                num: 1,
                title: "Share Your Sheet",
                desc: "Add this service account as Editor to your Google Sheets:",
                content: (
                  <div className="flex items-center justify-between gap-4 p-3 bg-code-bg border border-border rounded-lg font-mono text-sm overflow-x-auto">
                    <code className="text-accent-green break-all">google-sheet-db@mythic-groove-485702-k4.iam.gserviceaccount.com</code>
                    <CopyButton text="google-sheet-db@mythic-groove-485702-k4.iam.gserviceaccount.com" />
                  </div>
                ),
              },
              {
                num: 2,
                title: "Prepare Your Data",
                desc: "First row = column names (fields). Data starts from row 2.",
                content: (
                  <div className="bg-code-bg border border-border rounded-lg overflow-hidden text-sm">
                    <div className="grid grid-cols-3 border-b border-border">
                      <span className="px-4 py-2.5 border-r border-border bg-accent-blue/10 text-accent-blue font-semibold">name</span>
                      <span className="px-4 py-2.5 border-r border-border bg-accent-blue/10 text-accent-blue font-semibold">age</span>
                      <span className="px-4 py-2.5 bg-accent-blue/10 text-accent-blue font-semibold">email</span>
                    </div>
                    <div className="grid grid-cols-3 border-b border-border">
                      <span className="px-4 py-2.5 border-r border-border">John</span>
                      <span className="px-4 py-2.5 border-r border-border">25</span>
                      <span className="px-4 py-2.5">john@example.com</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="px-4 py-2.5 border-r border-border">Jane</span>
                      <span className="px-4 py-2.5 border-r border-border">30</span>
                      <span className="px-4 py-2.5">jane@example.com</span>
                    </div>
                  </div>
                ),
              },
              {
                num: 3,
                title: "Make API Calls",
                desc: "Use your document ID from the Google Sheets URL:",
                content: (
                  <div className="p-3 bg-code-bg border border-border rounded-lg font-mono text-sm">
                    <code className="text-accent-green">GET /api/&#123;doc_id&#125;/&#123;sheet_name&#125;</code>
                  </div>
                ),
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-6 p-6 bg-card-bg border border-border rounded-xl">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-accent-green to-accent-blue text-black font-bold text-lg rounded-full">
                  {step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.desc}</p>
                  {step.content}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/docs" className="gap-2">
                View Full Documentation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="px-4 md:px-8 py-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-purple/10 border border-accent-purple/30 rounded-full text-sm text-accent-purple mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered
            </div>
            <h2 className="text-3xl font-bold mb-4">AI Agent Skills</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Install the GSheet-CRUD skill to empower your AI coding assistant with complete API documentation and usage examples.
            </p>
          </div>

          <div className="p-8 bg-card-bg border border-border rounded-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-accent-purple to-accent-blue rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Install with Skills CLI</h3>
                <p className="text-sm text-muted-foreground">
                  Add the GSheet-CRUD skill to your AI agent with a single command. Works with Cursor, Windsurf, and other AI-powered IDEs.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 p-4 bg-code-bg border border-border rounded-xl font-mono text-sm overflow-x-auto">
              <code className="text-accent-green whitespace-nowrap">npx skills add git@gitlab.iglooinsure.com:axinan/fe/platform/gsheet-crud.git</code>
              <CopyButton text="npx skills add git@gitlab.iglooinsure.com:axinan/fe/platform/gsheet-crud.git" />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="w-4 h-4 text-accent-green" />
                <span>Full API documentation</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="w-4 h-4 text-accent-green" />
                <span>Code examples included</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="w-4 h-4 text-accent-green" />
                <span>JavaScript & Python</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            Built with{" "}
            <a href="https://github.com/joway/sheetsql" target="_blank" rel="noopener noreferrer" className="text-accent-green hover:opacity-80 transition-opacity">
              sheetsql
            </a>{" "}
            & Next.js
          </p>
          <p className="mt-2 text-xs opacity-60">MIT License</p>
        </div>
      </footer>
    </div>
  );
}
