import Link from "next/link";
import {ArrowLeft,BookOpen} from "lucide-react";
import {createClient} from "@/lib/supabase/server";
import AppShell from "@/components/AppShell";

export default async function SubjectPage({params}:{params:Promise<{subjectId:string}>}){
 const {subjectId}=await params;const supabase=await createClient();
 const [{data:subject},{data:quizzes}]=await Promise.all([
  supabase.from("subjects").select("id,name").eq("id",subjectId).single(),
  supabase.from("quizzes").select("id,title,subject,difficulty,question_count,created_at").eq("subject_id",subjectId).order("created_at",{ascending:false})
 ]);
 return <AppShell><div className="page workspace"><Link href="/subjects" className="text-link"><ArrowLeft size={15}/> All subjects</Link><div className="page-header"><div><div className="eyebrow">SUBJECT</div><h1>{subject?.name||"Subject"}</h1><p>Quizzes generated for this subject.</p></div></div><div className="quiz-list">{quizzes?.length?quizzes.map(q=><div className="card quiz-list-row" key={q.id}><BookOpen/><div><b>{q.title}</b><span>{q.difficulty} · {q.question_count} questions</span></div><Link href="/quizzes" className="button ghost">Open</Link></div>):<div className="card empty"><h2>No quizzes yet</h2><p>Generate your first quiz for this subject.</p><Link href="/generate" className="button">Generate quiz</Link></div>}</div></div></AppShell>;
}
