import { NextResponse } from "next/server";
export async function POST(request:Request){
 const backend=process.env.BACKEND_URL;
 if(!backend)return NextResponse.json({error:"BACKEND_URL is not configured."},{status:500});
 const form=await request.formData();
 const r=await fetch(backend.replace(/\/$/,"")+"/api/generate",{method:"POST",body:form});
 const data=await r.json(); return NextResponse.json(data,{status:r.status});
}