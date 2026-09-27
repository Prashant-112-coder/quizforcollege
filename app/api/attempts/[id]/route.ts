import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const {data:attempt,error}=await supabase.from("attempts").select("id,quiz_id,score,percentage,time_taken_seconds,started_at,completed_at,correct_answers,wrong_answers,unanswered,created_at,quizzes(title,subject,difficulty,question_count,mode),answers(id,question_id,selected_answer,is_correct,questions(question,options,correct_answer,explanation,source_section))").eq("id",id).eq("user_id",user.id).single();
 if(error)return NextResponse.json({error:error.message},{status:404});
 return NextResponse.json({attempt});
}
