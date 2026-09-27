import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {data,error}=await supabase.from("attempts").select("id,score,percentage,time_taken_seconds,completed_at,correct_answers,wrong_answers,unanswered,quizzes(subject,title)").eq("user_id",user.id).order("completed_at",{ascending:true}).limit(200);
  if(error)return NextResponse.json({error:error.message},{status:500});
  const attempts:any[]=data||[];const by=new Map<string,{sum:number,count:number}>();
  for(const a of attempts){const key=a.quizzes?.subject||"General";const x=by.get(key)||{sum:0,count:0};x.sum+=Number(a.percentage||0);x.count++;by.set(key,x);}
  const subjects=[...by.entries()].map(([subject,x])=>({subject,average:Math.round(x.sum/x.count)})).sort((a,b)=>b.average-a.average);
  return NextResponse.json({attempts,subjects});
}
