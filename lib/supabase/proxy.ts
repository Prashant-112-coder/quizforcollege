import { NextResponse, type NextRequest } from "next/server";

export function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  // QuizForge now runs in instant guest mode. No account or auth service is
  // required to explore, generate, take, and review quizzes.
  if (request.cookies.get("quizforge_guest")?.value !== "1") {
    response.cookies.set("quizforge_guest", "1", {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}
