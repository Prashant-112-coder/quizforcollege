import { NextResponse } from "next/server";

const DEFAULT_BACKEND_URL = "https://quizforge-ai-backend-ii0e.onrender.com";

export async function POST(request: Request) {
  const backend = (process.env.BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/$/, "");

  try {
    const form = await request.formData();
    const response = await fetch(`${backend}/api/generate`, {
      method: "POST",
      body: form,
      cache: "no-store",
    });

    const text = await response.text();
    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || "Backend returned an invalid response." };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reach quiz backend.";
    return NextResponse.json(
      { error: `Quiz backend unavailable: ${message}` },
      { status: 502 }
    );
  }
}
