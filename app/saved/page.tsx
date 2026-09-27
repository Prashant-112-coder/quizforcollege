"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {Bookmark,Loader2,Trash2} from "lucide-react";
import AppShell from "@/components/AppShell";

export default function SavedPage(){
 const[items,setItems]=useState<any[]>([]);const[loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/saved").then(r=>r.json()).then(x=>setItems(x.saved||[])).finally(()=>setLoading(false))},[]);
 async function remove(id:string){await fetch("/api/saved?quizId="+encodeURIComponent(id),{method:"DELETE"});setItems(v=>v.filter(x=>x.quiz_id!==id))}
 return <AppShell><div className="page workspace"><div className="page-header"><div><div className="eyebrow">LIBRARY</div><h1>Saved quizzes.</h1><p>Your bookmarked practice sets, stored with your account.</p></div></div>{loading?<div className="card loading-card"><Loader2 className="spin"/>Loading saved quizzes…</div>:items.length?<div className="saved-grid">{items.map(x=><div className="card saved-card" key={x.id}><Bookmark size={17}/><h3>{x.quizzes?.title||"Saved quiz"}</h3><p>{x.quizzes?.subject||"General"} · {x.quizzes?.question_count||0} questions</p><div><Link href="/quizzes" className="button ghost">Open quizzes</Link><button className="icon-button" onClick={()=>remove(x.quiz_id)} aria-label="Remove saved quiz"><Trash2 size={15}/></button></div></div>)}</div>:<div className="card empty"><Bookmark/><h2>No saved quizzes</h2><p>Save quizzes you want to revisit.</p><Link href="/quizzes" className="button">Browse quizzes</Link></div>}</div></AppShell>;
}
