import Link from "next/link";
import { ArrowRight, BarChart3, Brain, FileText, Sparkles } from "lucide-react";

const features = [
  { title: "Any study material", description: "PDFs, DOCX, PPTX, TXT and more.", icon: FileText },
  { title: "AI MCQs", description: "Questions grounded in your source material.", icon: Brain },
  { title: "Explanations", description: "Review why each answer is correct.", icon: Sparkles },
  { title: "Analytics", description: "Find weak topics and practice them again.", icon: BarChart3 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e8126,_transparent_45%),linear-gradient(180deg,#09090b,#111827)] text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          QuizForge <span className="text-indigo-400">AI</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/practice" className="rounded-xl px-4 py-2 text-sm text-zinc-300 hover:bg-white/5">Practice</Link>
          <Link href="/generate" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">Generate quiz</Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-sm text-indigo-200">
            <Sparkles className="h-4 w-4" /> AI-powered exam preparation
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Turn your study material into an <span className="text-indigo-400">interactive quiz.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Upload notes, PDFs and presentations, or enter a topic directly. Generate exam-ready MCQs, explanations and personalized practice.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/generate" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 font-medium hover:bg-indigo-400">
              Upload & generate <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/practice" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium hover:bg-white/10">
              Practice without a file
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Preview quiz</p>
                <h2 className="mt-1 text-lg font-semibold">Java Exception Handling</h2>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">10 questions</span>
            </div>
            <div className="mt-5 h-2 rounded-full bg-white/10"><div className="h-2 w-[70%] rounded-full bg-indigo-400" /></div>
            <p className="mt-5 text-base font-medium">Which keyword is used to explicitly throw an exception?</p>
            <div className="mt-4 space-y-2">
              {["throws", "throw", "catch", "finally"].map((option, i) => (
                <div key={option} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-300">
                  <span className="mr-2 text-zinc-500">{String.fromCharCode(65 + i)}.</span>{option}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ title, description, icon: Icon }) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <Icon className="h-5 w-5 text-indigo-300" />
            <h3 className="mt-4 font-medium">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
