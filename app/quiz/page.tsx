"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Q={question:string;options:string[];answer:number;explanation:string;source?:string};
export default function QuizPage(){
 const [data,setData]=useState<any>(null); const [selected,setSelected]=useState<number[]>([]); const [submitted,setSubmitted]=useState(false); const [time,setTime]=useState(0);
 useEffect(()=>{const raw=sessionStorage.getItem("quizforge:lastQuiz"); if(raw){const d=JSON.parse(raw);setData(d);setSelected(Array(d.questions.length).fill(-1));} const t=setInterval(()=>setTime(x=>x+1),1000); return()=>clearInterval(t)},[]);
 if(!data)return <main className="page"><div className="card"><h1>No quiz loaded</h1><Link href="/generate" className="button">Create a quiz</Link></div></main>;
 const qs:Q[]=data.questions||[]; const score=qs.reduce((n,q,i)=>n+(selected[i]===q.answer?1:0),0);
 return <main className="page"><div className="quiz-shell"><div className="topbar"><div><span className="eyebrow">QUIZFORGE AI</span><h1>{data.title}</h1></div><div className="timer">{Math.floor(time/60)}:{String(time%60).padStart(2,"0")}</div></div>
 {submitted&&<div className="result-banner"><strong>{score}/{qs.length}</strong><span> • {Math.round(score/Math.max(1,qs.length)*100)}% score</span></div>}
 <div className="quiz-list">{qs.map((q,i)=><section className="question card" key={i}><div className="q-meta">Question {i+1} of {qs.length}</div><h2>{q.question}</h2><div className="options">{q.options.map((o,j)=><button key={j} onClick={()=>!submitted&&setSelected(s=>s.map((v,k)=>k===i?j:v))} className={submitted?(j===q.answer?"correct":selected[i]===j?"wrong":""):(selected[i]===j?"selected":"")}>{String.fromCharCode(65+j)}. {o}</button>)}</div>{submitted&&<div className="explanation"><strong>Explanation</strong><p>{q.explanation}</p>{q.source&&<small>Source: {q.source}</small>}</div>}</section>)}</div>
 <div className="sticky-actions">{!submitted?<button className="button" onClick={()=>setSubmitted(true)}>Submit Quiz</button>:<Link href="/generate" className="button">Generate Another</Link>}</div></div></main>
}