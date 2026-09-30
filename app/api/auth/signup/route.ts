import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const college = String(body.college ?? "").trim();
    const course = String(body.course ?? "").trim();
    const semester = String(body.semester ?? "").trim();
    const department = String(body.department ?? "").trim();
    const studentId = String(body.studentId ?? "").trim();

    if (![fullName,email,password,college,course,semester,department,studentId].every(Boolean)) {
      return NextResponse.json({error:"Please complete every field."},{status:400});
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({error:"Enter a valid email address."},{status:400});
    }
    if (password.length < 8) {
      return NextResponse.json({error:"Password must be at least 8 characters."},{status:400});
    }

    const supabase = createAdminClient();
    const {data,error}=await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm:true,
      user_metadata:{full_name:fullName,college,course,semester,department,student_id:studentId}
    });

    if(error){
      if(error.message.toLowerCase().includes("already registered")){
        return NextResponse.json({error:"An account with this email already exists. Please sign in instead."},{status:409});
      }
      console.error("Supabase signup error:",error);
      return NextResponse.json({error:error.message||"Unable to create your account."},{status:400});
    }

    if(!data.user){
      return NextResponse.json({error:"Account creation did not return a user. Please try again."},{status:500});
    }

    return NextResponse.json({success:true,message:"Account created successfully. You can sign in now."});
  }catch(error){
    console.error("Signup error:",error);
    return NextResponse.json({error:"Account service is temporarily unavailable. Please try again."},{status:500});
  }
}
