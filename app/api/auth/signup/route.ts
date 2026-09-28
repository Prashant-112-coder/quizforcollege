import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
      return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: new URL("/auth/confirmed", request.url).toString(),
        data: { full_name: fullName, college, course, semester, department, student_id: studentId },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.session) {
      return NextResponse.json({ session: true });
    }

    return NextResponse.json({
      success: true,
      message: "Account created. Check your email to confirm the account, then sign in.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Account service is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
