import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, FileUp, Sparkles, Target, Timer } from "lucide-react";

export default function Home() {
  return (
    <main className="landing">
      <header className="landing-nav glass-nav">
        <Link href="/" className="brand" aria-label="QuizForge home">
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>QuizForge</span>
        </Link>

        <nav className="landing-links" aria-label="Primary navigation">
          <Link href="/dashboard" className="nav-text">Overview</Link>
          <Link href="/generate" className="nav-text">Generate</Link>
          <Link href="/practice" className="nav-text">Practice</Link>
          <Link href="/history" className="nav-text">History</Link>
        </nav>

        <Link href="/generate" className="button small-button">
          Start learning <ArrowRight size={15} />
        </Link>
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> AI STUDY WORKSPACE</div>
          <h1>Turn your notes into <span>better practice.</span></h1>
          <p>
            Upload your lectures, PDFs or slides and get focused MCQs with explanations.
            Then practice by topic and see where you need to improve.
          </p>

          <div className="hero-actions">
            <Link href="/generate" className="button">
              Generate a quiz <ArrowRight size={17} />
            </Link>
            <Link href="/practice" className="button ghost">
              Practice a topic
            </Link>
          </div>

          <div className="trust-line">
            <span><BrainCircuit size={15} /> AI-powered</span>
            <span><Target size={15} /> Exam-ready</span>
            <span><FileUp size={15} /> 6 formats</span>
          </div>
        </div>

        <div className="quiz-preview-wrap" aria-label="Quiz preview">
          <div className="preview-glow" />
          <div className="quiz-preview glass-panel">
            <div className="preview-top">
              <div>
                <span className="preview-kicker">QUICK PRACTICE</span>
                <strong>Operating Systems</strong>
              </div>
              <span className="preview-timer"><Timer size={13} /> 08:42</span>
            </div>

            <div className="preview-progress"><span /></div>

            <div className="preview-question">
              <span>QUESTION 03 / 10</span>
              <h3>Which scheduling algorithm can cause starvation?</h3>
            </div>

            <div className="preview-options">
              <div><span>A</span> Round Robin</div>
              <div className="preview-selected"><span>B</span> Priority Scheduling <CheckCircle2 size={16} /></div>
              <div><span>C</span> FCFS</div>
              <div><span>D</span> FIFO</div>
            </div>

            <div className="preview-footer">
              <span>AI-generated from your study material</span>
              <span className="preview-badge">Study mode</span>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div>
          <span className="feature-number">01</span>
          <h3>Bring your material</h3>
          <p>Upload notes, PDFs, slides and common study formats.</p>
        </div>
        <div>
          <span className="feature-number">02</span>
          <h3>Build your practice</h3>
          <p>Choose count, difficulty and exam or study mode.</p>
        </div>
        <div>
          <span className="feature-number">03</span>
          <h3>Learn from every attempt</h3>
          <p>Review explanations and keep your progress visible.</p>
        </div>
      </section>
    </main>
  );
}
