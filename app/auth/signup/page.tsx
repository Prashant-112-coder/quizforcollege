"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

const initial={fullName:"",email:"",password:"",confirm:"",college:"",course:"",semester:"",department:"",studentId:""};

export default function SignupPage(){
  const router=useRouter(); const [form,setForm]=useState(initial); const [loading,setLoading]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  function set(name:keyof typeof initial,value:string){setForm(prev=>({...prev,[name]:value}))}
  async function submit(event:FormEvent){
    event.preventDefault();setError("");setMessage("");
    if(Object.values(form).some(v=>!v.trim())){setError("Please complete every field.");return}
    if(!/^\S+@\S+\.\S+$/.test(form.email.trim())){setError("Enter a valid email address.");return}
    if(form.password.length<8){setError("Password must be at least 8 characters.");return}
    if(form.password!==form.confirm){setError("Passwords do not match.");return}
    setLoading(true);
    try{
      const response=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        fullName:form.fullName.trim(),email:form.email.trim().toLowerCase(),password:form.password,
        college:form.college.trim(),course:form.course.trim(),semester:form.semester.trim(),
        department:form.department.trim(),studentId:form.studentId.trim()
      })});
      const result=await response.json().catch(()=>({}));
      if(!response.ok){setError(result.error||"Unable to create your account.");return}
      if(result.session){router.replace("/dashboard");router.refresh();return}
      setMessage(result.message||"Account created. Check your email to confirm the account, then sign in.");
    }catch{setError("Could not connect to the account service. Please try again.")}
    finally{setLoading(false)}
  }
  return <main className="auth-page"><section className="auth-card auth-card-wide">
    <Link href="/" className="auth-brand"><span><Sparkles size={16}/></span>QuizForge</Link>
    <div className="auth-heading"><div className="eyebrow">CREATE STUDENT ACCOUNT</div><h1>Build your learning profile.</h1><p>Your academic details and quiz progress will stay attached to your account.</p></div>
    <form className="auth-form" onSubmit={submit}><div className="auth-grid">
      <label>Full name<input value={form.fullName} onChange={e=>set("fullName",e.target.value)} autoComplete="name" placeholder="Full name"/></label>
      <label>College email<input type="email" value={form.email} onChange={e=>set("email",e.target.value)} autoComplete="email" placeholder="you@college.edu"/></label>
      <label>Password<input type="password" value={form.password} onChange={e=>set("password",e.target.value)} autoComplete="new-password" placeholder="At least 8 characters"/></label>
      <label>Confirm password<input type="password" value={form.confirm} onChange={e=>set("confirm",e.target.value)} autoComplete="new-password" placeholder="Repeat password"/></label>
      <label>College / University<input value={form.college} onChange={e=>set("college",e.target.value)} placeholder="College name"/></label>
      <label>Course / Program<input value={form.course} onChange={e=>set("course",e.target.value)} placeholder="MCA, BCA, B.Tech…"/></label>
      <label>Semester<input value={form.semester} onChange={e=>set("semester",e.target.value)} placeholder="e.g. 3rd Semester"/></label>
      <label>Department<input value={form.department} onChange={e=>set("department",e.target.value)} placeholder="Computer Applications"/></label>
      <label className="auth-full">Student ID / Roll Number<input value={form.studentId} onChange={e=>set("studentId",e.target.value)} placeholder="Student ID"/></label>
    </div>{error&&<div className="auth-error">{error}</div>}{message&&<div className="auth-success">{message}</div>}
    <button className="button auth-submit" disabled={loading}>{loading?<><Loader2 size={16} className="spin"/>Creating account…</>:<>Create account <ArrowRight size={16}/></>}</button></form>
    <p className="auth-switch">Already have an account? <Link href="/auth/login">Sign in</Link></p>
  </section></main>;
}
