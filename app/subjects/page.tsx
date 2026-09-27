"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {ArrowRight,BookOpen,Loader2} from "lucide-react";
import AppShell from "@/components/AppShell";

export default function SubjectsPage(){
 const[items,setItems]=useState<any[]>([]);const[loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/dashboard").then(r=>r.json()).then(x=>setItems(x.subjects||[])).finally(()=>setLoading(false))},[]);
 return <AppShell><div className="page workspace"><div className="page-header"><div><div className="eyebrow">LEARNING</div><h1>Subjects.</h1><p>Explore focused quiz practice across your college curriculum.</p></div></div>{loading?<div className="card loading-card"><Loader2 className="spin"/>Loading subjects…</div>:<div className="subject-grid">{items.map(x=><Link href={"/subjects/"+x.id} className="card subject-card" key={x.id}><span className="action-icon purple"><BookOpen/></span><div><h3>{x.name}</h3><p>{x.average?x.average+"% recent average":"No attempts yet"}</p></div><ArrowRight/></Link>)}</div>}</div></AppShell>;
}
