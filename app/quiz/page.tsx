"use client";
import {useEffect,useState} from "react"; import Link from "next/link";
type Q={question:string;options:string[];answer:number;explanation:string;source?:string};
export default function QuizPage(){const[d,setD]=useState<any>();const[s,setS]=useState<number[]>([]);const[done,setDone]=useState(false);const[t,setT]=useState(0);
useEffect(()=>{const x=sessionStorage.getItem("quizforge:lastQuiz");if(x){const q=JSON.parse(x);setD(q);setS(Array(q.questions.length).fill(-1))}const i=setInterval(()=>setT(v=>v+1),1000);return()=>clearInterval(i)},[]);
if(!d)return <main className="page"><div className="card"><h1>No quiz loaded</h1><Link className="button" href="/generate">Create a quiz</Link></div></main>;
const qs:Q[]=d.questions||[];const score=qs.reduce((n,q,i)=>n+(s[i]===q.answer?1:0),0);
return <main className="page"><div className="quiz-shell"><div className="topbar"><div><span className="eyebrow">QUIZFORGE AI</span><h1>{d.title}</h1></div><div className="timer">{Math.floor(t/60)}:{String(t%60).padStart(2,"0")}</div></div>
{done&&<div className="result-banner"><b>{score}/{qs.length}</b> · {Math.round(score/Math.max(1,qs.length)*100)}%</div>}
{qs.map((q,i)=><section className="card question" key={i}><div className="q-meta">QUESTION {i+1} / {qs.length}</div><h2>{q.question}</h2><div className="options">{q.options.map((o,j)=><button disabled={done} key={j} onClick={()=>setS(a=>a.map((v,k)=>k===i?j:v))} className={done?(j===q.answer?"correct":s[i]===j?"wrong":""):(s[i]===j?"selected":"")}>{String.fromCharCode(65+j)}. {o}</button>)}</div>{done&&<div className="explanation"><b>Explanation</b><p>{q.explanation}</p>{q.source&&<small>Source: {q.source}</small>}</div>}</section>)}
<div className="sticky-actions">{!done?<button className="button" onClick={()=>setDone(true)}>Submit Quiz</button>:<Link className="button" href="/generate">Generate Another</Link>}</div></div></main>}