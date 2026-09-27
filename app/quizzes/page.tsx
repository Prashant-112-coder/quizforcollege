"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {ArrowUpRight,Loader2,Sparkles} from "lucide-react";
import AppShell from "@/components/AppShell";

export default function QuizzesPage(){
 const[items,setItems]=useState<any[]>([]);const[loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/dashboard").then(r=>r.json()).then(x=>setItems(x.recentAttempts||[])).finally(()=>setLoading(false))},[]);
 return <AppShell><div className="page workspace"><div className="page-header"><div><div className="eyebrow">QUIZ LIBRARY</div><h1>Your quizzes.</h1><p>Generated and attempted quizzes connected to your account.</p></div><Link href="/generate" className="button"><Sparkles size={16}/>Generate quiz</Link></div>{loading?<div className="card loading-card"><Loader2 className="spin"/>Loading quizzes…</div>:<div className="card table-card">{items.length?items.map((a:any)=><div className="history-row" key={a.id}><div className="history-main"><span className="history-index">Q</span><div><b>{a.quizzes?.title||"Quiz"}</b><span>{a.quizzes?.subject||"General"} · {a.quizzes?.difficulty||"mixed"}</span></div></div><div className="history-score"><strong>{a.percentage}%</strong><span>{a.quizzes?.question_count||0} questions</span></div><Link className="icon-button" href={"/result?id="+a.id} title="View result"><ArrowUpRight size={16}/></Link></div>):<div className="empty"><h2>No quizzes yet</h2><p>Generate a quiz to start building your library.</p><Link href="/generate" className="button">Create first quiz</Link></div>}</div>}</div></AppShell>;
}
