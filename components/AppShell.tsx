"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3, BookOpen, BrainCircuit, FilePlus2, History, Home,
  LayoutDashboard, Menu, Settings, Bookmark, UserRound, X, LogOut, Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
 const pathname=usePathname();const router=useRouter();const[open,setOpen]=useState(false);const[user,setUser]=useState<any>(null);const[profile,setProfile]=useState<any>(null);const[guest,setGuest]=useState(false);
 useEffect(()=>{
   const supabase=createClient();
   supabase.auth.getUser().then(({data})=>setUser(data.user));
   setGuest(document.cookie.split("; ").some(x=>x==="quizforge_guest=1"));
   fetch("/api/profile").then(r=>r.ok?r.json():null).then(x=>{if(x){setProfile(x.profile||null);document.documentElement.dataset.theme=x.profile?.theme||"system";}}).catch(()=>{});
 },[]);
 const active=(href:string)=>pathname===href||pathname.startsWith(href+"/");
 async function logout(){
   if(guest){await fetch("/api/auth/guest",{method:"DELETE"});}
   else await createClient().auth.signOut({scope:"local"});
   router.replace("/"); router.refresh();
 }
 const close=()=>setOpen(false);
 const name=guest?"Guest":profile?.full_name||user?.email?.split("@")[0]||"Student";
 return <div className="app-shell">
  {open&&<button className="mobile-overlay" aria-label="Close navigation" onClick={close}/>}
  <aside className={open?"sidebar mobile-open":"sidebar"}>
   <Link href="/dashboard" className="brand" onClick={close}><span className="brand-mark"><Sparkles size={17}/></span><span>QuizForge</span></Link>
   <nav className="side-nav" aria-label="Main navigation">
    <div className="nav-label">LEARNING</div>
    {links.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={close} className={active(href)?"nav-link active":"nav-link"}><Icon size={17}/><span>{label}</span></Link>)}
   </nav>
   <div className="sidebar-bottom">
    {guest&&<div className="ai-card"><Sparkles size={17}/><div><b>Guest mode</b><span>Progress is kept on this browser.</span></div></div>}
    {!guest&&<div className="ai-card"><Sparkles size={17}/><div><b>AI Study Coach</b><span>Turn your material into focused practice.</span></div></div>}
    <Link className="home-link" href="/" onClick={close}><Home size={16}/> Home</Link>
   </div>
  </aside>
  <div className="main-frame">
   <header className="top-nav">
    <button className="icon-button menu-button" onClick={()=>setOpen(v=>!v)} aria-label={open?"Close navigation":"Open navigation"}>{open?<X size={18}/>:<Menu size={18}/>}</button>
    <div className="crumb">{pathname==="/dashboard"?"Dashboard":pathname.split("/")[1]?.replaceAll("-"," ")||"QuizForge"}</div>
    <div className="top-actions">
      <span className="status-dot"/> {guest?"Guest mode":"AI ready"}
      <Link href="/profile" className="user-chip"><span className="avatar">{name.slice(0,1).toUpperCase()}</span><span className="user-chip-name">{name}</span></Link>
      <button className="icon-button top-logout" onClick={logout} aria-label={guest?"Exit guest mode":"Log out"} title={guest?"Exit guest mode":"Log out"}><LogOut size={15}/></button>
    </div>
   </header>
   <main>{children}</main>
  </div>
 </div>;
}
