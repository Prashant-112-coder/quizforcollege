import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuizForge AI",
  description: "Turn study material and topics into interactive AI quizzes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
