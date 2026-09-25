import Link from "next/link";
import { ArrowRight, BrainCircuit, FileUp, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="landing landing-simple">
      <header className="landing-nav glass-nav">
        <Link href="/" className="brand landing-brand">
          <span className="brand-mark"><Sparkles size={16} /></span>
          QuizForge
        </Link>

        <nav className="landing-links" aria-label="Primary navigation">
          <Link href="/dashboard" className="nav-text">Dashboard</Link>
          <Link href="/generate" className="nav-text">Generate</Link>
          <Link href="/practice" className="nav-text">Practice</Link>
          <Link href="/history" className="nav-text">History</Link>
        </nav>

        <Link href="/generate" className="landing-nav-cta">
          Get started <ArrowRight size={15} />
        </Link>
      </header>

      <section className="simple-hero">
        <div className="simple-hero-copy">
          <div className="simple-eyebrow"><span /> AI QUIZ MAKER</div>
          <h1>Study smarter.<br /><em>Practice better.</em></h1>
          <p>
            Turn your notes, PDFs and slides into focused MCQs in seconds.
            Learn from explanations and practice exactly what you need.
          </p>

          <div className="simple-actions">
            <Link href="/generate" className="simple-primary">
              Create a quiz <ArrowRight size={17} />
            </Link>
            <Link href="/practice" className="simple-secondary">
              Practice a topic
            </Link>
          </div>
        </div>

        <div className="simple-visual" aria-label="Quiz workflow preview">
          <div className="visual-card visual-main">
            <div className="visual-header">
              <div>
                <small>YOUR NEXT QUIZ</small>
                <strong>Operating Systems</strong>
              </div>
              <span>03 / 10</span>
            </div>
            <div className="visual-line"><i /></div>
            <h2>Which scheduling algorithm can cause starvation?</h2>
            <div className="visual-answer active"><b>A</b><span>Priority Scheduling</span><strong>✓</strong></div>
            <div className="visual-answer"><b>B</b><span>Round Robin</span></div>
            <div className="visual-answer"><b>C</b><span>FCFS</span></div>
          </div>

          <div className="visual-mini visual-upload">
            <FileUp size={17} />
            <div><b>Upload notes</b><span>PDF · PPTX · DOCX</span></div>
          </div>
          <div className="visual-mini visual-ai">
            <BrainCircuit size={17} />
            <div><b>AI generated</b><span>Grounded in your material</span></div>
          </div>
        </div>
      </section>

      <section className="simple-steps">
        <div><span>01</span><div><b>Upload</b><p>Bring your study material.</p></div></div>
        <div><span>02</span><div><b>Generate</b><p>Choose your quiz settings.</p></div></div>
        <div><span>03</span><div><b>Practice</b><p>Answer, review and improve.</p></div></div>
      </section>
    </main>
  );
}
