import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {data,error}=await supabase.from("saved_quizzes").select("id,quiz_id,created_at,quizzes(title,subject,difficulty,question_count)").eq("user_id",user.id).order("created_at",{ascending:false});
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({saved:data||[]});
}
export async function POST(request:Request){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {quizId}=await request.json();
  const {data,error}=await supabase.from("saved_quizzes").insert({user_id:user.id,quiz_id:quizId}).select().single();
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({saved:data});
}
export async function DELETE(request:Request){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const quizId=new URL(request.url).searchParams.get("quizId");
  if(!quizId)return NextResponse.json({error:"quizId is required."},{status:400});
  const {error}=await supabase.from("saved_quizzes").delete().eq("user_id",user.id).eq("quiz_id",quizId);
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({ok:true});
}
