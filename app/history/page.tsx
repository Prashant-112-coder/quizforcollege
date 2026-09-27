"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, History as HistoryIcon, Loader2 } from "lucide-react";
import AppShell from "@/components/AppShell";

export default function History(){
 const [items,setItems]=useState<any[]>([]);const[loading,setLoading]=useState(true);const[query,setQuery]=useState("");const[subject,setSubject]=useState("all");
 useEffect(()=>{fetch("/api/attempts").then(r=>r.json()).then(x=>setItems(x.attempts||[])).finally(()=>setLoading(false))},[]);
 const subjects=useMemo(()=>[...new Set(items.map(x=>x.quizzes?.subject).filter(Boolean))],[items]);
 const filtered=items.filter(x=>{
   const q=query.trim().toLowerCase();const title=(x.quizzes?.title||"").toLowerCase();
   return (!q||title.includes(q))&&(subject==="all"||x.quizzes?.subject===subject);
 });
 return <AppShell><div className="workspace page"><div className="page-header"><div><div className="eyebrow">ACTIVITY</div><h1>Quiz history.</h1><p>Every completed attempt is tied to your account.</p></div></div>
 <div className="history-tools card"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search quizzes…"/><select value={subject} onChange={e=>setSubject(e.target.value)}><option value="all">All subjects</option>{subjects.map(s=><option key={String(s)}>{String(s)}</option>)}</select></div>
 <div className="card history-card">{loading?<div className="loading-card"><Loader2 className="spin"/>Loading history…</div>:filtered.length?filtered.map((a,i)=><div className="history-row" key={a.id}><div className="history-main"><span className="history-index">{i+1}</span><div><b>{a.quizzes?.title||"Quiz"}</b><span>{a.quizzes?.subject||"General"} · {new Date(a.created_at).toLocaleString()}</span></div></div><div className="history-score"><strong>{a.percentage}%</strong><span>{a.score}/{a.quizzes?.question_count||0} · {Math.round((a.time_taken_seconds||0)/60)}m</span></div><Link className="icon-button" href={"/result?id="+a.id} title="View result"><ArrowUpRight size={16}/></Link></div>):<div className="empty"><div className="empty-icon"><HistoryIcon/></div><h2>Your history is empty</h2><p>Complete a quiz and your results will stay with your account.</p><Link href="/generate" className="button">Create a quiz</Link></div>}</div></div></AppShell>;
}
