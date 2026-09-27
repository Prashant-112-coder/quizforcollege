import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {data,error}=await supabase.from("attempts").select("id,quiz_id,score,percentage,time_taken_seconds,started_at,completed_at,created_at,correct_answers,wrong_answers,unanswered,quizzes(title,subject,difficulty,question_count)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(200);
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({attempts:data||[]});
}

export async function POST(request:Request){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json();
  const questions=Array.isArray(body.questions)?body.questions:[];
  const answers=Array.isArray(body.answers)?body.answers:[];
  if(!questions.length)return NextResponse.json({error:"No quiz questions supplied."},{status:400});

  const {data:subjectRow}=await supabase.from("subjects").select("id").eq("name",String(body.subject||"General")).maybeSingle();
  const quizPayload={
    user_id:user.id,
    title:String(body.title||"Untitled Quiz").slice(0,180),
    subject:String(body.subject||"General").slice(0,100),
    subject_id:subjectRow?.id||null,
    difficulty:String(body.difficulty||"mixed").slice(0,30),
    mode:String(body.mode||"exam").slice(0,20),
    question_count:questions.length,
    source_filename:body.source_filename?String(body.source_filename).slice(0,255):null
  };
  const {data:quiz,error:quizError}=await supabase.from("quizzes").insert(quizPayload).select("id").single();
  if(quizError)return NextResponse.json({error:quizError.message},{status:400});

  const questionRows=questions.map((q:any)=>({
    quiz_id:quiz.id,question:String(q.question||"").slice(0,5000),options:q.options,
    correct_answer:Number(q.answer),explanation:String(q.explanation||"").slice(0,5000),
    difficulty:quizPayload.difficulty,topic:quizPayload.subject,
    source_section:q.source?String(q.source).slice(0,255):null
  }));
  const {data:savedQuestions,error:qError}=await supabase.from("questions").insert(questionRows).select("id");
  if(qError)return NextResponse.json({error:qError.message},{status:400});

  const score=questions.reduce((sum:number,q:any,i:number)=>sum+(Number(answers[i])===Number(q.answer)?1:0),0);
  const answered=answers.filter((x:any)=>Number(x)>=0).length;
  const wrong=answered-score;
  const unanswered=questions.length-answered;
  const {data:attempt,error:attemptError}=await supabase.from("attempts").insert({
    user_id:user.id,quiz_id:quiz.id,started_at:body.started_at||new Date().toISOString(),
    completed_at:new Date().toISOString(),score,percentage:Math.round(score/questions.length*10000)/100,
    correct_answers:score,wrong_answers:wrong,unanswered,time_taken_seconds:Number(body.time_taken_seconds||0)
  }).select("id").single();
  if(attemptError)return NextResponse.json({error:attemptError.message},{status:400});

  const answerRows=questions.map((q:any,i:number)=>({
    attempt_id:attempt.id,question_id:savedQuestions?.[i]?.id,
    selected_answer:Number(answers[i])>=0?Number(answers[i]):null,
    is_correct:Number(answers[i])===Number(q.answer)
  }));
  const {error:answerError}=await supabase.from("answers").insert(answerRows);
  if(answerError)return NextResponse.json({error:answerError.message},{status:400});

  return NextResponse.json({attemptId:attempt.id,quizId:quiz.id,score,percentage:Math.round(score/questions.length*10000)/100,correctAnswers:score,wrongAnswers:wrong,unanswered});
}
