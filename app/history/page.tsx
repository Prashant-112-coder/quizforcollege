"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, History as HistoryIcon, RotateCcw, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
type Attempt={score:number;total:number;title:string;date:string};
export default function History(){
 const [items,setItems]=useState<Attempt[]>([]);
 useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem("quizforge:attempts")||"[]"))}catch{}},[]);
 function clear(){localStorage.removeItem("quizforge:attempts");setItems([])}
 return <AppShell><div className="workspace page"><div className="page-header"><div><div className="eyebrow">ACTIVITY</div><h1>Quiz history</h1><p>Review your recent practice and keep an eye on your progress.</p></div>{items.length>0&&<button className="button danger-button" onClick={clear}><Trash2 size={16}/> Clear history</button>}</div>
 <div className="card history-card">{items.length===0?<div className="empty"><div className="empty-icon"><HistoryIcon/></div><h2>Your history is empty</h2><p>Complete a quiz and your score will be saved locally on this device.</p><Link href="/generate" className="button">Create a quiz <ArrowUpRight size={16}/></Link></div>:items.map((a,i)=><div className="history-row" key={i}><div className="history-main"><span className="history-index">{items.length-i}</span><div><b>{a.title}</b><span>{new Date(a.date).toLocaleString()}</span></div></div><div className="history-score"><strong>{Math.round(a.score/a.total*100)}%</strong><span>{a.score}/{a.total} correct</span></div><Link className="icon-button" href="/generate" title="Generate another quiz"><RotateCcw size={17}/></Link></div>)}</div></div></AppShell>
}