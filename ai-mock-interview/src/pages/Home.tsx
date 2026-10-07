import { Show } from "@clerk/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Video,
  Volume2,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAFAF8] text-[#1A1A1A]">
      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16 text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-[#E5E5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#6B6B6B] shadow-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0F5C5C]" />
            <span>Structured Technical Practice</span>
          </div>

          <h1 className="mt-5 font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#1A1A1A] leading-[1.15]">
            Practice technical interviews for your target role and get specific feedback on every answer.
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-[#6B6B6B]">
            Simulate engineering interviews with realistic technical prompts, timed sessions,
            and actionable breakdowns of your architectural depth, communication clarity, and trade-off coverage.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Show when="signed-out">
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 rounded-md bg-[#0F5C5C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0A4444] shadow-subtle"
              >
                <span>Start a mock interview</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Show>

            <Show when="signed-in">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-[#0F5C5C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0A4444] shadow-subtle"
              >
                <span>Go to candidate dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Show>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E5E0] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F2]"
            >
              <span>How it works</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#8C8C88]" />
            </a>
          </div>

          <p className="mt-4 text-xs text-[#8C8C88]">
            No credit card required. Free practice sessions. Candidate data remains private.
          </p>
        </div>
      </section>

      {/* Realistic Product Mock Preview of the Interview Screen */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="rounded-xl border border-[#E5E5E0] bg-white p-3 sm:p-5 shadow-subtle">
          <div className="overflow-hidden rounded-lg border border-[#E5E5E0] bg-[#FAFAF8]">
            {/* Mock Top Utility Bar */}
            <div className="flex items-center justify-between border-b border-[#E5E5E0] bg-white px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-[#0F5C5C] text-[9px] font-bold text-white">
                  IC
                </span>
                <span className="font-medium text-[#1A1A1A]">
                  Full Stack Session: React & Django · 3–5 yrs
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-mono text-[11px] text-[#6B6B6B]">
                  <Clock className="h-3 w-3 text-[#8C8C88]" />
                  <span>04:12</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A] text-[11px]">
                  <span>Question 2 of 4</span>
                  <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#E5E5E0]">
                    <div className="h-full w-1/2 bg-[#0F5C5C]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Split Body */}
            <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[300px_1fr]">
              {/* Mock Video Pane */}
              <div className="space-y-3">
                <div className="relative aspect-video w-full rounded-lg border border-[#E5E5E0] bg-[#1A1A1A] p-3 text-white flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 rounded bg-black/60 px-2 py-0.5 text-[10px] w-fit border border-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1F5F3F]" />
                    <span>Recording Active</span>
                  </div>
                  <div className="text-center text-xs text-[#8C8C88]">
                    <Video className="mx-auto h-5 w-5 mb-1" />
                    Webcam feed live
                  </div>
                  <div className="text-[10px] text-white/60">
                    Candidate Camera (1080p)
                  </div>
                </div>

                <div className="rounded-lg border border-[#E5E5E0] bg-white p-3 text-xs text-[#6B6B6B]">
                  <div className="flex items-center justify-between font-medium text-[#1A1A1A]">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="h-3.5 w-3.5 text-[#0F5C5C]" />
                      Microphone
                    </span>
                    <span className="text-[11px] text-[#1F5F3F] font-semibold">Live</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#8C8C88]">
                    Natural cadence detection active
                  </p>
                </div>
              </div>

              {/* Mock Question & Answer Pane */}
              <div className="rounded-lg border border-[#E5E5E0] bg-white p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0F5C5C]">
                    Question 2 · State Architecture
                  </span>
                  <h2 className="mt-1 text-base font-semibold text-[#1A1A1A] leading-snug">
                    How would you architect client-side state management for an offline-first dashboard with optimistic UI updates and conflict resolution?
                  </h2>
                </div>

                <div className="rounded-md border border-[#E5E5E0] bg-[#FAFAF8] p-3 text-xs text-[#1A1A1A] leading-relaxed font-sans">
                  <p className="text-[#6B6B6B] italic mb-1.5">Candidate response preview:</p>
                  "I would prioritize an IndexedDB persistence store coupled with TanStack Query. All mutations update the cache optimistically with local UUIDs, write to an outgoing sync queue, and reconcile with the server using timestamped revision vectors..."
                </div>

                <div className="flex items-center justify-between border-t border-[#E5E5E0] pt-3 text-xs">
                  <span className="text-[#8C8C88]">42 words · Ctrl + Enter to submit</span>
                  <button
                    type="button"
                    className="rounded bg-[#0F5C5C] px-3.5 py-1.5 text-xs font-medium text-white"
                  >
                    Submit & Next Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: A clean numbered list, not a generic 3-card grid */}
      <section
        id="how-it-works"
        className="border-t border-[#E5E5E0] bg-white py-16 px-4 sm:px-6"
      >
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl">
            <span className="text-xs font-medium text-[#0F5C5C] uppercase tracking-wider">
              Process
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1A1A1A]">
              How it works
            </h2>
            <p className="mt-1.5 text-sm text-[#6B6B6B]">
              A straightforward three-step workflow designed to reproduce real hiring panel conditions.
            </p>
          </div>

          <div className="mt-10 divide-y divide-[#E5E5E0] border-y border-[#E5E5E0]">
            <div className="grid gap-3 py-6 sm:grid-cols-[80px_1fr]">
              <span className="font-mono text-xl font-semibold text-[#0F5C5C]">
                01
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#1A1A1A]">
                  Select your seniority and focus technologies
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6B6B6B]">
                  Choose from Fresher, Early Career, Mid-Level, or Senior Staff.
                  Pick the stack relevant to your pipeline (React, TypeScript, Django, Python, Databases, or System Design).
                </p>
              </div>
            </div>

            <div className="grid gap-3 py-6 sm:grid-cols-[80px_1fr]">
              <span className="font-mono text-xl font-semibold text-[#0F5C5C]">
                02
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#1A1A1A]">
                  Answer timed technical questions via text or voice
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6B6B6B]">
                  Respond under realistic time pacing with your camera active.
                  Explain design choices, architectural trade-offs, and failure recovery strategies without distractions.
                </p>
              </div>
            </div>

            <div className="grid gap-3 py-6 sm:grid-cols-[80px_1fr]">
              <span className="font-mono text-xl font-semibold text-[#0F5C5C]">
                03
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#1A1A1A]">
                  Review scored feedback and concrete recommendations
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6B6B6B]">
                  Get an authoritative breakdown on technical correctness, clarity of delivery, and missed edge cases.
                  Export summary reports and track improvement over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evaluation Rubric / Criteria */}
      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl">
            <span className="text-xs font-medium text-[#0F5C5C] uppercase tracking-wider">
              Scoring Methodology
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1A1A1A]">
              What real engineering teams look for
            </h2>
            <p className="mt-1.5 text-sm text-[#6B6B6B]">
              Every answer is evaluated against three core dimensions used by senior interviewers.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#E5E5E0] bg-white p-5 shadow-subtle">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0F5C5C]">
                Dimension 1
              </div>
              <h3 className="mt-1 text-base font-medium text-[#1A1A1A]">
                Technical Depth
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6B6B6B]">
                Understanding runtime internals, state reconciliation, boundary constraints, and memory profiling.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E5E0] bg-white p-5 shadow-subtle">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0F5C5C]">
                Dimension 2
              </div>
              <h3 className="mt-1 text-base font-medium text-[#1A1A1A]">
                Communication Clarity
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6B6B6B]">
                Stating the core proposal upfront, structuring arguments logically, and avoiding circular rambling.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E5E0] bg-white p-5 shadow-subtle">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0F5C5C]">
                Dimension 3
              </div>
              <h3 className="mt-1 text-base font-medium text-[#1A1A1A]">
                Trade-off Coverage
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6B6B6B]">
                Addressing production trade-offs, network latency, rollback procedures, and maintenance costs.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-[#E5E5E0] bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-subtle">
            <div>
              <h3 className="text-base font-semibold text-[#1A1A1A]">
                Ready to practice your next technical interview?
              </h3>
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Select your tech stack and begin a structured 15-minute mock session.
              </p>
            </div>

            <Show when="signed-out">
              <Link
                to="/sign-up"
                className="rounded-md bg-[#0F5C5C] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#0A4444]"
              >
                Start practice session
              </Link>
            </Show>

            <Show when="signed-in">
              <Link
                to="/dashboard"
                className="rounded-md bg-[#0F5C5C] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#0A4444]"
              >
                Go to Dashboard
              </Link>
            </Show>
          </div>
        </div>
      </section>

      {/* Calm Footer */}
      <footer className="border-t border-[#E5E5E0] bg-white py-8 px-4 sm:px-6 text-xs text-[#6B6B6B]">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#0F5C5C] text-[10px] font-bold text-white">
              IC
            </span>
            <span className="font-semibold text-[#1A1A1A]">InterviewCraft</span>
            <span className="text-[#8C8C88]">· Focused Technical Practice</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Candidate Privacy Guaranteed</span>
            <span className="text-[#E5E5E0]">·</span>
            <span>WCAG AA Accessible</span>
          </div>
        </div>
      </footer>
    </div>
  );
}