"use client";

import { useEffect, useState } from "react";
import { BarChart3, Loader2, Target, TrendingUp } from "lucide-react";
import AppShell from "@/components/AppShell";

type Attempt = { id: string; percentage?: number | string };
type Subject = { subject: string; average: number };

export default function AnalyticsPage() {
  const [data, setData] = useState<{ attempts?: Attempt[]; subjects?: Subject[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then((response) => response.json())
      .then((result) => {
        if (result.error) setError(result.error);
        else setData(result);
      })
      .catch(() => setError("Unable to load analytics."));
  }, []);

  if (error) {
    return (
      <AppShell>
        <div className="page">
          <div className="card empty">
            <h2>Analytics unavailable</h2>
            <p>{error}</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell>
        <div className="page">
          <div className="card loading-card">
            <Loader2 className="spin" />
            Loading analytics…
          </div>
        </div>
      </AppShell>
    );
  }

  const attempts = data.attempts ?? [];
  const subjects = data.subjects ?? [];

  return (
    <AppShell>
      <div className="page workspace">
        <div className="page-header">
          <div>
            <div className="eyebrow">PERFORMANCE</div>
            <h1>Your progress.</h1>
            <p>See score trends and recommended practice areas from your real attempts.</p>
          </div>
        </div>

        <div className="analytics-grid">
          <section className="card analytics-card">
            <div className="section-heading">
              <div>
                <h2>Score trend</h2>
                <p>Recent completed quizzes.</p>
              </div>
              <TrendingUp />
            </div>

            {attempts.length > 0 ? (
              <div className="score-bars">
                {attempts.slice(-12).map((attempt) => {
                  const percentage = Number(attempt.percentage ?? 0);
                  return (
                    <div className="score-bar-item" key={attempt.id}>
                      <div
                        className="score-bar"
                        style={{ height: Math.max(8, Math.min(100, percentage)) + "%" }}
                      />
                      <span>{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty small-empty">
                <BarChart3 />
                <p>Complete quizzes to build your score trend.</p>
              </div>
            )}
          </section>

          <section className="card analytics-card">
            <div className="section-heading">
              <div>
                <h2>Subject performance</h2>
                <p>Average score by subject.</p>
              </div>
              <Target />
            </div>

            {subjects.length > 0 ? (
              subjects.map((item) => (
                <div className="subject-meter" key={item.subject}>
                  <div>
                    <b>{item.subject}</b>
                    <span>{item.average}%</span>
                  </div>
                  <div className="meter">
                    <i style={{ width: Math.min(100, item.average) + "%" }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="empty small-empty">
                <p>Subject data will appear after your first quiz.</p>
              </div>
            )}
          </section>
        </div>

        <section className="card analytics-card">
          <h2>Recommended Practice</h2>
          <p>Supportive recommendations based on recent subject averages.</p>

          <div className="recommend-grid">
            {subjects
              .filter((item) => item.average < 75)
              .slice(0, 4)
              .map((item) => (
                <div className="recommend-card" key={item.subject}>
                  <b>{item.subject}</b>
                  <span>{item.average}% recent average</span>
                  <a href={"/practice?topic=" + encodeURIComponent(item.subject)}>
                    Practice now →
                  </a>
                </div>
              ))}

            {!subjects.some((item) => item.average < 75) && (
              <div className="empty small-empty">
                <p>No priority practice areas yet. Keep building your baseline.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
