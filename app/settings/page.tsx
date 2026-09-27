"use client";
import {useState} from "react";
import {Loader2,LogOut,Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import AppShell from "@/components/AppShell";
import {createClient} from "@/lib/supabase/client";

export default function SettingsPage(){
 const router=useRouter();const[loading,setLoading]=useState(false);const[error,setError]=useState("");
 async function logout(){setLoading(true);const {error}=await createClient().auth.signOut({scope:"local"});if(error)setError(error.message);else router.replace("/");setLoading(false)}
 async function deleteAccount(){if(!window.confirm("Delete your QuizForge account and all saved quiz data? This cannot be undone."))return;setLoading(true);const r=await fetch("/api/account/delete",{method:"DELETE"});const x=await r.json();if(!r.ok){setError(x.error||"Unable to delete account.");setLoading(false);return}await createClient().auth.signOut({scope:"local"});router.replace("/")}
 return <AppShell><div className="page workspace"><div className="page-header"><div><div className="eyebrow">PREFERENCES</div><h1>Settings.</h1><p>Manage your session and account preferences.</p></div></div><div className="settings-stack"><section className="card settings-row"><div><b>Session</b><p>Sign out from this browser session.</p></div><button className="button ghost" disabled={loading} onClick={logout}><LogOut size={16}/>Log out</button></section><section className="card settings-row danger-section"><div><b>Delete account</b><p>Permanently remove your profile, quizzes, attempts and saved items.</p></div><button className="button danger-button" disabled={loading} onClick={deleteAccount}>{loading?<><Loader2 size={16} className="spin"/>Working…</>:<><Trash2 size={16}/>Delete account</>}</button></section>{error&&<div className="error">{error}</div>}</div></div></AppShell>;
}
