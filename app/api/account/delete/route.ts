import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {error}=await createAdminClient().auth.admin.deleteUser(user.id);
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({ok:true});
}
