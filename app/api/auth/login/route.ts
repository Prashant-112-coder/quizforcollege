import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if(!email || !password)return NextResponse.json({error:"Enter your email and password."},{status:400});

    const supabase = await createClient();
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error)return NextResponse.json({error:error.message},{status:401});
    return NextResponse.json({success:true,user:{id:data.user?.id,email:data.user?.email}});
  } catch {
    return NextResponse.json({error:"Login service is temporarily unavailable. Please try again or use guest mode."},{status:500});
  }
}
