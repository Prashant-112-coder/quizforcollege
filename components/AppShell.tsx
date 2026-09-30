"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3, BookOpen, BrainCircuit, FilePlus2, History, Home,
  LayoutDashboard, Menu, Settings, Bookmark, UserRound, X, Sparkles
} from "lucide-react";

const links=[
  {href:"/dashboard",label:"Dashboard",icon:LayoutDashboard},
  {href:"/subjects",label:"Subjects",icon:BookOpen},
  {href:"/quizzes",label:"Quizzes",icon:Sparkles},
  {href:"/generate",label:"Generate Quiz",icon:FilePlus2},
  {href:"/practice",label:"Practice",icon:BrainCircuit},
  {href:"/saved",label:"Saved",icon:Bookmark},
  {href:"/history",label:"History",icon:History},
  {href:"/analytics",label:"Analytics",icon:BarChart3},
  {href:"/profile",label:"Profile",icon:UserRound},
  {href:"/settings",label:"Settings",icon:Settings},
];

export default function AppShell({children}:{children:ReactNode}){
 const pathname=usePathname(); const[open,setOpen]=useState(false); const[guest,setGuest]=useState(true);
 useEffect(()=>{
   document.cookie="quizforge_guest=1; path=/; max-age=2592000; samesite=lax";
   setGuest(true);
 },[]);
 const active=(href:string)=>pathname===href||pathname.startsWith(href+"/");
 const close=()=>setOpen(false);
 return <div className="app-shell">
  {open&&<button className="mobile-overlay" aria-label="Close navigation" onClick={close}/>}
  <aside className={open?"sidebar mobile-open":"sidebar"}>
   <Link href="/dashboard" className="brand" onClick={close}><span className="brand-mark"><Sparkles size={17}/></span><span>QuizForge</span></Link>
   <nav className="side-nav" aria-label="Main navigation">
    <div className="nav-label">LEARNING</div>
    {links.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={close} className={active(href)?"nav-link active":"nav-link"}><Icon size={17}/><span>{label}</span></Link>)}
   </nav>
   <div className="sidebar-bottom">
    <div className="ai-card"><Sparkles size={17}/><div><b>Guest mode</b><span>Practice progress is kept on this browser.</span></div></div>
    <Link className="home-link" href="/" onClick={close}><Home size={16}/> Home</Link>
   </div>
  </aside>
  <div className="main-frame">
   <header className="top-nav">
    <button className="icon-button menu-button" onClick={()=>setOpen(v=>!v)} aria-label={open?"Close navigation":"Open navigation"}>{open?<X size={18}/>:<Menu size={18}/>}</button>
    <div className="crumb">{pathname==="/dashboard"?"Dashboard":pathname.split("/")[1]?.replaceAll("-"," ")||"QuizForge"}</div>
    <div className="top-actions"><span className="status-dot"/> Guest mode <Link href="/profile" className="user-chip"><span className="avatar">G</span><span className="user-chip-name">Guest</span></Link></div>
   </header>
   <main>{children}</main>
  </div>
 </div>;
}
