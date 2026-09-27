import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowed=["full_name","college","course","semester","department","student_id","profile_photo","theme","notifications_enabled"];

export async function GET(){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {data,error}=await supabase.from("profiles").select("*").eq("id",user.id).single();
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({profile:data,email:user.email});
}

export async function PUT(request:Request){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json();const patch:Record<string,unknown>={};
  for(const key of allowed)if(key in body)patch[key]=body[key];
  if(typeof patch.full_name==="string"&&!patch.full_name.trim())return NextResponse.json({error:"Full name is required."},{status:400});
  const {data,error}=await supabase.from("profiles").update(patch).eq("id",user.id).select().single();
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({profile:data});
}
