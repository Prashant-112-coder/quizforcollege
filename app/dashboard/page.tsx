"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, BrainCircuit, FileText, Flame, Loader2, Target, Trophy } from "lucide-react";
import AppShell from "@/components/AppShell";

function ago(value:string){
 const diff=Math.max(0,Date.now()-new Date(value).getTime());
 const minutes=Math.floor(diff/60000);if(minutes<1)return "Just now";if(minutes<60)return minutes+"m ago";
 const hours=Math.floor(minutes/60);if(hours<24)return hours+"h ago";
 const days=Math.floor(hours/24);return days+"d ago";
}

export default function Dashboard(){
 const [data,setData]=useState<any>(null);const[error,setError]=useState("");
 useEffect(()=>{fetch("/api/dashboard").then(r=>r.json()).then(x=>x.error?setError(x.error):setData(x)).catch(()=>setError("Unable to load your dashboard."))},[]);
 if(error)return <AppShell><div className="page"><div className="card empty"><h2>Dashboard unavailable</h2><p>{error}</p><Link href="/settings" className="button">Check settings</Link></div></div></AppShell>;
 if(!data)return <AppShell><div className="page"><div className="card loading-card"><Loader2 className="spin"/>Loading your learning workspace…</div></div></AppShell>;

 const p=data.profile;const s=data.stats;
 return <AppShell><div className="workspace page">
  <section className="welcome-panel"><div><div className="eyebrow">STUDENT DASHBOARD</div><h1>Good day, {p?.full_name?.split(" ")[0]||"Student"}.</h1><p>{p?.course||"Student"}{p?.semester?" · "+p.semester:""}{p?.college?" · "+p.college:""} </p><div className="hero-actions"><Link href="/generate" className="button">Create a quiz <ArrowRight size={16}/></Link><Link href="/practice" className="button ghost">Practice a topic</Link></div></div><div className="hero-orb"><BrainCircuit size={52}/><span>AI<br/>READY</span></div></section>

  <div className="stats-grid">
   <div className="stat-card"><span className="stat-icon"><Trophy size={18}/></span><div><b>{s.totalQuizzes}</b><span>Total quizzes</span></div></div>
   <div className="stat-card"><span className="stat-icon"><Target size={18}/></span><div><b>{s.averageScore}%</b><span>Average score</span></div></div>
   <div className="stat-card"><span className="stat-icon"><BarChart3 size={18}/></span><div><b>{s.bestScore}%</b><span>Highest score</span></div></div>
   <div className="stat-card"><span className="stat-icon"><Flame size={18}/></span><div><b>{s.currentStreak}</b><span>Day streak</span></div></div>
  </div>

  <div className="section-heading"><div><h2>Recent quizzes</h2><p>Your latest saved attempts.</p></div><Link href="/history" className="text-link">View history <ArrowRight size={15}/></Link></div>
  <div className="card table-card">{data.recentAttempts.length?data.recentAttempts.slice(0,5).map((a:any)=><div className="history-row" key={a.id}><div className="history-main"><span className="history-index">{a.quizzes?.title?.slice(0,1)||"Q"}</span><div><b>{a.quizzes?.title||"Quiz"}</b><span>{a.quizzes?.subject||"General"} · {ago(a.created_at)}</span></div></div><div className="history-score"><strong>{a.percentage}%</strong><span>{a.score}/{a.quizzes?.question_count||0}</span></div><Link href={"/result?id="+a.id} className="text-link">View result</Link></div>):<div className="empty small-empty"><div className="empty-icon"><Trophy/></div><h3>No quizzes attempted yet</h3><p>Take your first quiz to start building your progress history.</p><Link href="/generate" className="button">Create your first quiz</Link></div>}</div>

  <div className="dashboard-two">
   <section><div className="section-heading"><div><h2>Continue learning</h2><p>Quizzes you have not completed yet.</p></div></div><div className="card compact-list">{data.continueLearning.length?data.continueLearning.map((q:any)=><div className="compact-row" key={q.id}><span className="action-icon blue"><FileText size={17}/></span><div><b>{q.title}</b><span>{q.subject} · {q.question_count} questions</span></div><Link href="/quizzes" className="text-link">Continue <ArrowRight size={14}/></Link></div>):<div className="empty small-empty"><p>Generate another quiz to keep your learning queue active.</p><Link href="/generate" className="button ghost">Generate</Link></div>}</div></section>
   <section><div className="section-heading"><div><h2>Recommended practice</h2><p>Simple rules based on your recent scores.</p></div></div><div className="card compact-list">{data.recommendations.length?data.recommendations.map((x:any)=><div className="compact-row" key={x.subject}><span className="action-icon purple"><Target size={17}/></span><div><b>{x.title}</b><span>{x.reason}</span></div><Link href={"/practice?topic="+encodeURIComponent(x.subject)} className="text-link">Practice <ArrowRight size={14}/></Link></div>):<div className="empty small-empty"><p>Your recommendations will appear as your quiz history grows.</p></div>}</div></section>
  </div>

  <div className="section-heading"><div><h2>Subjects</h2><p>Your subject-level practice areas.</p></div><Link href="/subjects" className="text-link">All subjects <ArrowRight size={15}/></Link></div>
  <div className="subject-grid">{data.subjects.slice(0,8).map((x:any)=><Link href={"/subjects/"+x.id} className="card subject-card" key={x.id}><span className="action-icon purple"><FileText size={17}/></span><div><h3>{x.name}</h3><p>{x.average?x.average+"% recent average":"No attempts yet"}</p></div><ArrowRight size={16}/></Link>)}</div>
 </div></AppShell>;
}
