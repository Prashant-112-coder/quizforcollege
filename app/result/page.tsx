"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import AppShell from "@/components/AppShell";

function ResultView(){
 const search=useSearchParams();const[id]=useState(search.get("id")||"");const[data,setData]=useState<any>(null);const[error,setError]=useState("");
 useEffect(()=>{
  if(!id)return;
  if(id==="guest"){
    const saved=sessionStorage.getItem("quizforge:guestAttempt");
    if(saved){setData(JSON.parse(saved));return}
    setError("Guest result is no longer available in this browser.");return;
  }
  fetch("/api/attempts/"+id).then(r=>r.json()).then(x=>x.error?setError(x.error):setData(x.attempt)).catch(()=>setError("Unable to load this result."))
},[id]);
 if(error)return <AppShell><div className="page"><div className="card empty"><h2>Result unavailable</h2><p>{error}</p><Link href="/dashboard" className="button">Back to dashboard</Link></div></div></AppShell>;
 if(!data)return <AppShell><div className="page"><div className="card loading-card"><Loader2 className="spin"/>Loading result…</div></div></AppShell>;
 const quiz=data.quizzes;const percentage=Number(data.percentage||0);
 return <AppShell><div className="page workspace"><Link href="/history" className="text-link"><ArrowLeft size={15}/> Quiz history</Link><section className="result-hero card"><div><div className="eyebrow">QUIZ COMPLETED</div><h1>{quiz?.title||"Quiz result"}</h1><p>{quiz?.subject||"General"} · {quiz?.difficulty||"mixed"}</p></div><div className="result-score"><strong>{data.score}/{quiz?.question_count||0}</strong><span>{percentage}%</span></div></section>
 <div className="stats-grid result-stats"><div className="stat-card"><b>{data.correct_answers}</b><span>Correct</span></div><div className="stat-card"><b>{data.wrong_answers}</b><span>Incorrect</span></div><div className="stat-card"><b>{data.unanswered}</b><span>Unanswered</span></div><div className="stat-card"><b><Clock3 size={15}/> {Math.floor((data.time_taken_seconds||0)/60)}:{String((data.time_taken_seconds||0)%60).padStart(2,"0")}</b><span>Time taken</span></div></div>
 <div className="section-heading"><div><h2>Answer review</h2><p>See your response and the correct answer for every question.</p></div></div>
 <div className="result-questions">{(data.answers||[]).map((a:any,i:number)=>{const q=a.questions;const selected=typeof a.selected_answer==="number"?q?.options?.[a.selected_answer]:"Not answered";const correct=q?.options?.[q.correct_answer];return <section className="card result-question" key={a.id}><div className="q-meta">QUESTION {i+1}</div><h3>{q?.question}</h3><p className={a.is_correct?"review-correct":"review-wrong"}>{a.is_correct?<CheckCircle2 size={15}/>:<XCircle size={15}/>} Your answer: {selected}</p><p><b>Correct answer:</b> {correct}</p><div className="explanation"><b>Explanation</b><p>{q?.explanation}</p></div></section>})}</div>
 <div className="sticky-actions"><Link className="button" href="/generate">Try another quiz</Link><Link className="button ghost" href="/dashboard">Back to dashboard</Link></div>
 </div></AppShell>;
}
export default function ResultPage(){return <Suspense fallback={<main className="auth-page"><div className="auth-card">Loading…</div></main>}><ResultView/></Suspense>}
