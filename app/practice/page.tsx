"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";

export default function PracticePage() {
  const [topic, setTopic] = useState("");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="mt-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-300"><Brain className="h-7 w-7" /></div>
          <h1 className="mt-5 text-4xl font-semibold">Practice without a file</h1>
          <p className="mt-3 text-zinc-400">Enter any topic and generate an AI practice quiz dynamically.</p>
        </div>
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <label className="text-sm font-medium text-zinc-300">Topic</label>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. DBMS normalization" className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 outline-none focus:border-indigo-400" />
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <select className="rounded-xl bg-zinc-900 p-3"><option>10 questions</option><option>20 questions</option><option>30 questions</option></select>
            <select className="rounded-xl bg-zinc-900 p-3"><option>Mixed</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
            <select className="rounded-xl bg-zinc-900 p-3"><option>University exam</option><option>Placement</option><option>Interview</option><option>GATE</option></select>
          </div>
          <button disabled={!topic.trim()} className="mt-5 w-full rounded-2xl bg-indigo-500 px-5 py-4 font-semibold disabled:cursor-not-allowed disabled:opacity-40 hover:bg-indigo-400">Generate practice quiz</button>
        </div>
      </div>
    </main>
  );
}
