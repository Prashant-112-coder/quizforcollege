"use client";

import {useEffect,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowLeft,CheckCircle2,Clock3,Loader2} from "lucide-react";
import AppShell from "@/components/AppShell";

type Q={question:string;options:string[];answer:number;explanation:string;source?:string};

export default function QuizPage(){
 const router=useRouter();const[d,setD]=useState<any>();const[s,setS]=useState<number[]>([]);const[t,setT]=useState(0);const[startedAt,setStartedAt]=useState("");const[saving,setSaving]=useState(false);const[error,setError]=useState("");
 useEffect(()=>{const x=sessionStorage.getItem("quizforge:lastQuiz");if(x){const q=JSON.parse(x);setD(q);setS(Array(q.questions.length).fill(-1));setStartedAt(new Date().toISOString())}const i=setInterval(()=>setT(v=>v+1),1000);return()=>clearInterval(i)},[]);
 if(!d)return <AppShell><div className="page"><div className="card empty"><h2>No quiz loaded</h2><p>Create a quiz first to begin.</p><Link className="button" href="/generate">Create a quiz</Link></div></div></AppShell>;
 const qs:Q[]=d.questions||[];const score=qs.reduce((n,q,i)=>n+(s[i]===q.answer?1:0),0);
 async function submit(){
  if(saving)return;setSaving(true);setError("");
  const settings=d.quizSettings||{subject:"General",difficulty:"mixed",mode:"exam"};
  const isGuest=document.cookie.split("; ").some(x=>x==="quizforge_guest=1");
  if(isGuest){
    const attempt={id:"guest",quiz:{title:d.title||"Quiz",subject:settings.subject||"General",difficulty:settings.difficulty||"mixed",question_count:qs.length},
      score,percentage:Math.round(score/qs.length*10000)/100,
      correct_answers:score,wrong_answers:s.filter((x,i)=>x>=0&&x!==qs[i].answer).length,
      unanswered:s.filter(x=>x<0).length,time_taken_seconds:t,
      answers:qs.map((q,i)=>({selected_answer:s[i],is_correct:s[i]===q.answer,questions:{question:q.question,options:q.options,correct_answer:q.answer,explanation:q.explanation}}))
    };
    sessionStorage.setItem("quizforge:guestAttempt",JSON.stringify(attempt));
    router.replace("/result?id=guest");return;
  }
  try{
  const res=await fetch("/api/attempts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
   title:d.title||"Quiz",subject:settings.subject||"General",difficulty:settings.difficulty||"mixed",mode:settings.mode||"exam",
   source_filename:settings.source_filename||null,questions:qs,answers:s,started_at:startedAt,time_taken_seconds:t
  })});
  const data=await res.json();
  if(!res.ok){setError(data.error||"Could not save your attempt.");setSaving(false);return}
  sessionStorage.setItem("quizforge:lastAttempt",JSON.stringify(data));router.replace("/result?id="+data.attemptId);router.refresh();
  }catch{setError("Could not save your attempt. Please try again.");setSaving(false)}
 }
 return <AppShell><div className="page quiz-shell"><div className="quiz-top"><div><Link href="/dashboard" className="text-link"><ArrowLeft size={15}/> Exit quiz</Link><h1>{d.title}</h1><p className="quiz-subtitle">{d.quizSettings?.subject||"General"} · {d.quizSettings?.difficulty||"mixed"}</p></div><div className="timer"><Clock3 size={15}/> {Math.floor(t/60)}:{String(t%60).padStart(2,"0")}</div></div>
 {error&&<div className="error">{error}</div>}
 {qs.map((q,i)=><section className="card question" key={i}><div className="q-meta">QUESTION {i+1} / {qs.length}</div><h2>{q.question}</h2><div className="options">{q.options.map((o,j)=><button key={j} onClick={()=>setS(a=>a.map((v,k)=>k===i?j:v))} className={s[i]===j?"selected":""}>{String.fromCharCode(65+j)}. {o}</button>)}</div></section>)}
 <div className="sticky-actions"><button className="button" disabled={saving} onClick={submit}>{saving?<><Loader2 size={16} className="spin"/>Saving result…</>:<><CheckCircle2 size={16}/>Submit Quiz</>}</button></div>
 </div></AppShell>;
}
