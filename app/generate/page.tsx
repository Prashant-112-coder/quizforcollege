"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, UploadCloud } from "lucide-react";

export default function GeneratePage() {
  const [fileName, setFileName] = useState("");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="mt-10">
          <p className="text-sm font-medium text-indigo-300">Document → Quiz</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Generate from study material</h1>
          <p className="mt-3 text-zinc-400">Upload a document and configure the question set.</p>
        </div>

        <label className="mt-10 block cursor-pointer rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center hover:bg-white/[0.05]">
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
          <UploadCloud className="mx-auto h-10 w-10 text-indigo-300" />
          <p className="mt-4 text-lg font-medium">Drop your file here or browse</p>
          <p className="mt-2 text-sm text-zinc-500">PDF, DOC, DOCX, PPT, PPTX, TXT, MD</p>
          {fileName && <div className="mx-auto mt-5 flex max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-left"><FileText className="h-5 w-5 text-indigo-300" /><span className="truncate text-sm">{fileName}</span></div>}
        </label>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <label className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><span className="text-sm text-zinc-400">Questions</span><select className="mt-2 w-full rounded-xl bg-zinc-900 p-3"><option>10</option><option>20</option><option>30</option><option>50</option></select></label>
          <label className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><span className="text-sm text-zinc-400">Difficulty</span><select className="mt-2 w-full rounded-xl bg-zinc-900 p-3"><option>Mixed</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
          <label className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><span className="text-sm text-zinc-400">Mode</span><select className="mt-2 w-full rounded-xl bg-zinc-900 p-3"><option>Exam</option><option>Study</option></select></label>
        </div>

        <button className="mt-6 w-full rounded-2xl bg-indigo-500 px-5 py-4 font-semibold hover:bg-indigo-400">Generate quiz</button>
      </div>
    </main>
  );
}
