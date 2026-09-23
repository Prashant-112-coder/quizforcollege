import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const backend = process.env.BACKEND_URL;
  if (!backend) return NextResponse.json({ error: "BACKEND_URL is not configured." }, { status: 500 });
  const upstream = await fetch(backend.replace(/\/$/, "") + "/api/generate", { method: "POST", body: form });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
