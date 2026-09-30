"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ArrowRight, Loader2, Sparkles, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [guestLoading,setGuestLoading]=useState(false);
  const [error,setError]=useState("");

  async function submit(event:FormEvent){
    event.preventDefault(); setError("");
    if(!email.trim() || !password){setError("Enter your email and password.");return}
    setLoading(true);
    try {
      const res=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email.trim().toLowerCase(),password})});
      const result=await res.json().catch(()=>({}));
      if(!res.ok){setError(result.error||"Login failed.");return}
      router.replace(next); router.refresh();
    } catch {
      setError("Login service could not be reached. You can continue as a guest or try again.");
    } finally { setLoading(false); }
  }

  async function continueAsGuest(){
    setError("");setGuestLoading(true);
    try{
      const res=await fetch("/api/auth/guest",{method:"POST"});
      if(!res.ok)throw new Error();
      router.replace(next);router.refresh();
    }catch{
      setError("Guest mode could not be started. Please refresh and try again.");
    }finally{setGuestLoading(false)}
  }

  return <main className="auth-page"><section className="auth-card">
    <Link href="/" className="auth-brand"><span><Sparkles size={16}/></span>QuizForge</Link>
    <div className="auth-heading"><div className="eyebrow">STUDENT ACCOUNT</div><h1>Welcome back.</h1><p>Sign in to continue your quizzes and keep your progress synced.</p></div>
    <form className="auth-form" onSubmit={submit}>
      <label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@college.edu"/></label>
      <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></label>
      {error&&<div className="auth-error">{error}</div>}
      <button className="button auth-submit" disabled={loading||guestLoading}>{loading?<><Loader2 size={16} className="spin"/>Signing in…</>:<>Sign in <ArrowRight size={16}/></>}</button>
    </form>
    <div className="auth-divider"><span>or</span></div>
    <button type="button" className="button ghost auth-submit" onClick={continueAsGuest} disabled={loading||guestLoading}>
      {guestLoading?<><Loader2 size={16} className="spin"/>Opening guest mode…</>:<><UserRound size={16}/> Continue as Guest</>}
    </button>
    <p className="auth-switch">Guest mode lets you explore QuizForge and generate/practice quizzes. Create an account later to sync your progress.</p>
    <p className="auth-switch">New to QuizForge? <Link href="/auth/signup">Create your student account</Link></p>
  </section></main>;
}

export default function LoginPage(){
  return <Suspense fallback={<main className="auth-page"><div className="auth-card">Loading…</div></main>}><LoginForm/></Suspense>;
}
