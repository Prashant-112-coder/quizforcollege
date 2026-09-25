"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BrainCircuit, FileUp, LayoutDashboard, History, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

const items=[
  {href:"/dashboard",label:"Overview",icon:LayoutDashboard},
  {href:"/generate",label:"Generate Quiz",icon:FileUp},
  {href:"/practice",label:"Practice",icon:BrainCircuit},
  {href:"/history",label:"History",icon:History},
];

export default function AppShell({children}:{children:React.ReactNode}){
 const pathname=usePathname(); const [open,setOpen]=useState(false);
 return <div className="app-shell">
   <aside className={open?"sidebar mobile-open":"sidebar"}>
    <div className="brand"><span className="brand-mark"><Sparkles size={17}/></span><span>QuizForge</span></div>
    <nav className="side-nav" aria-label="Main navigation">
      <div className="nav-label">LEARN</div>
      {items.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setOpen(false)} className={pathname===href?"nav-link active":"nav-link"}><Icon size={18}/><span>{label}</span></Link>)}
    </nav>
    <div className="sidebar-bottom">
      <div className="ai-card"><Sparkles size={17}/><div><b>AI Study Coach</b><span>Turn your material into practice.</span></div></div>
      <Link className="home-link" href="/"><BookOpen size={17}/> Home</Link>
    </div>
   </aside>
   {open&&<button className="mobile-overlay" aria-label="Close menu" onClick={()=>setOpen(false)}/>}
   <div className="main-frame">
    <header className="top-nav"><button className="icon-button menu-button" onClick={()=>setOpen(true)} aria-label="Open navigation"><Menu size={21}/></button><div className="crumb">Student workspace</div><div className="top-actions"><span className="status-dot"/>AI ready</div></header>
    <main>{children}</main>
   </div>
 </div>
}
