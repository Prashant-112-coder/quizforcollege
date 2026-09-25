"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, BrainCircuit, FileText, Flame, Target, Trophy } from "lucide-react";
import AppShell from "@/components/AppShell";
type Attempt={score:number;total:number;title:string;date:string};
export default function Dashboard(){
 const [attempts,setAttempts]=useState<Attempt[]>([]);
 useEffect(()=>{try{setAttempts(JSON.parse(localStorage.getItem("quizforge:attempts")||"[]"))}catch{}},[]);
 const total=attempts.length, avg=total?Math.round(attempts.reduce((a,x)=>a+(x.score/x.total)*100,0)/total):0;
 const best=attempts.length?Math.max(...attempts.map(x=>Math.round(x.score/x.total*100))):0;
 return <AppShell><div className="workspace page">
   <section className="welcome-panel"><div><div className="eyebrow">STUDENT DASHBOARD</div><h1>Learn smarter. Practice with purpose.</h1><p>Your study workspace for generating quizzes, practicing concepts and tracking your progress.</p><div className="hero-actions"><Link href="/generate" className="button">Create a quiz <ArrowUpRight size={17}/></Link><Link href="/practice" className="button ghost">Practice a topic</Link></div></div><div className="hero-orb"><BrainCircuit size={58}/><span>AI<br/>READY</span></div></section>
   <div className="stats-grid"><div className="stat-card"><span className="stat-icon"><Trophy size={18}/></span><div><b>{total}</b><span>Quizzes completed</span></div></div><div className="stat-card"><span className="stat-icon"><Target size={18}/></span><div><b>{total?avg+"%":"—"}</b><span>Average score</span></div></div><div className="stat-card"><span className="stat-icon"><Flame size={18}/></span><div><b>{best?best+"%":"—"}</b><span>Best score</span></div></div><div className="stat-card"><span className="stat-icon"><FileText size={18}/></span><div><b>6</b><span>Supported formats</span></div></div></div>
   <div className="section-heading"><div><h2>Start learning</h2><p>Choose the way you want to study today.</p></div></div>
   <div className="action-grid"><Link href="/generate" className="action-card"><span className="action-icon purple"><FileText/></span><div><h3>Generate from notes</h3><p>Upload PDF, PPTX, DOCX or notes and get grounded MCQs.</p></div><ArrowUpRight/></Link><Link href="/practice" className="action-card"><span className="action-icon blue"><BrainCircuit/></span><div><h3>Practice a topic</h3><p>Enter any subject and create an instant practice set.</p></div><ArrowUpRight/></Link></div>
   <div className="section-heading"><div><h2>Recent activity</h2><p>Your latest quiz attempts on this device.</p></div><Link href="/history" className="text-link">View all <ArrowUpRight size={15}/></Link></div>
   <div className="card table-card">{attempts.length===0?<div className="empty small-empty"><div className="empty-icon"><Trophy/></div><h3>No attempts yet</h3><p>Take your first quiz and your scores will appear here.</p><Link href="/generate" className="button">Start your first quiz</Link></div>:attempts.slice(0,5).map((a,i)=><div className="activity-row" key={i}><div><b>{a.title}</b><span>{new Date(a.date).toLocaleDateString()}</span></div><strong>{a.score}/{a.total}</strong><span className={a.score/a.total>=.7?"score-good":"score-neutral"}>{Math.round(a.score/a.total*100)}%</span></div>)}</div>
 </div></AppShell>
}