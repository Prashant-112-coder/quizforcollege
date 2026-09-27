import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});

  const [profileRes,attemptsRes,quizzesRes,savedRes,subjectsRes]=await Promise.all([
    supabase.from("profiles").select("*").eq("id",user.id).single(),
    supabase.from("attempts").select("id,quiz_id,score,percentage,time_taken_seconds,started_at,completed_at,created_at,correct_answers,wrong_answers,unanswered,quizzes(title,subject,difficulty,question_count)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(100),
    supabase.from("quizzes").select("id,title,subject,difficulty,question_count,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(100),
    supabase.from("saved_quizzes").select("id,quiz_id,created_at,quizzes(title,subject,difficulty,question_count)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(12),
    supabase.from("subjects").select("id,name,slug").order("name")
  ]);

  if(profileRes.error)return NextResponse.json({error:profileRes.error.message},{status:500});
  if(attemptsRes.error)return NextResponse.json({error:attemptsRes.error.message},{status:500});

  const attempts:any[]=attemptsRes.data||[];
  const total=attempts.length;
  const average=total?Math.round(attempts.reduce((s,a)=>s+Number(a.percentage||0),0)/total):0;
  const best=total?Math.max(...attempts.map(a=>Number(a.percentage||0))):0;
  const questionsAnswered=attempts.reduce((s,a)=>s+Number(a.correct_answers||0)+Number(a.wrong_answers||0),0);
  const correct=attempts.reduce((s,a)=>s+Number(a.correct_answers||0),0);
  const accuracy=questionsAnswered?Math.round(correct/questionsAnswered*100):0;
  const bySubject=new Map<string,{name:string,total:number,score:number}>();
  for(const a of attempts){
    const name=a.quizzes?.subject||"General";
    const x=bySubject.get(name)||{name,total:0,score:0};
    x.total++;x.score+=Number(a.percentage||0);bySubject.set(name,x);
  }
  const performance=[...bySubject.values()].map(x=>({name:x.name,average:Math.round(x.score/x.total)})).sort((a,b)=>a.average-b.average);
  const recommendations=performance.filter(x=>x.average<75).slice(0,3).map(x=>({
    subject:x.name,
    title:"Practice "+x.name,
    reason:"Your recent average is "+x.average+"%. Build confidence with another focused set."
  }));

  const dates=[...new Set(attempts.filter(a=>a.completed_at).map(a=>new Date(a.completed_at).toISOString().slice(0,10)))];
  let streak=0;
  for(let i=0;i<dates.length;i++){
    if(i===0){streak=1;continue}
    const diff=(new Date(dates[i-1]).getTime()-new Date(dates[i]).getTime())/86400000;
    if(Math.round(diff)===1)streak++;else break;
  }

  return NextResponse.json({
    profile:profileRes.data,
    stats:{totalQuizzes:quizzesRes.data?.length||0,quizzesCompleted:attempts.filter(a=>a.completed_at).length,averageScore:average,bestScore:best,questionsAnswered,accuracy,currentStreak:streak},
    recentAttempts:attempts.slice(0,8),
    recommendations,
    saved:savedRes.data||[],
    subjects:subjectsRes.data||[],
  });
}
