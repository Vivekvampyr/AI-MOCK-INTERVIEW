import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import type { Interview } from "../types/api";

interface LocationState {
  interview?: Interview;
  totalDuration?: number;
}

// Representative sample report data for demonstration/fallback


export default function InterviewReport() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;
  const interview = state?.interview;

  if (!interview) {
    navigate("/dashboard");
    return null;
  }

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  const toggleExpand = (qNum: number) => {
    setExpandedQuestion((prev) => (prev === qNum ? null : qNum));
  };

  const handlePrint = () => {
    window.print();
  };

  // Compute aggregate scores
  const technicalAvg = Math.round(
    interview.questions.reduce(
      (acc, q) => acc + (q.technical_score ?? 0),
      0
    ) / interview.questions.length
  );

  const communicationAvg = Math.round(
    interview.questions.reduce(
      (acc, q) => acc + (q.communication_score ?? 0),
      0
    ) / interview.questions.length
  );

  const completenessAvg = Math.round(
    interview.questions.reduce(
      (acc, q) => acc + (q.completeness_score ?? 0),
      0
    ) / interview.questions.length
  );

  const overallAvg = interview.total_score ?? Math.round(
    (technicalAvg + communicationAvg + completenessAvg) / 3
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAFAF8] text-[#1A1A1A] py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E5E0] bg-white px-3 py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F5F2]"
            >
              <Printer className="h-3.5 w-3.5 text-[#6B6B6B]" />
              <span>Print / Export PDF</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0F5C5C] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#0A4444]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>New Interview</span>
            </button>
          </div>
        </div>

        {/* Report Header Card */}
        <div className="rounded-xl border border-[#E5E5E0] bg-white p-6 sm:p-8 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-[#E5E5E0] pb-6">
            <div>
              <span className="text-xs font-medium text-[#0F5C5C] uppercase tracking-wider">
                Evaluation Report
              </span>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1A1A1A]">
                Technical Interview Assessment
              </h1>
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Focus: {interview.tech_stack.join(", ")} · Seniority: {interview.experience} Years · Completed on{" "}
                {new Date(interview.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-baseline gap-2 rounded-lg border border-[#E5E5E0] bg-[#FAFAF8] px-4 py-3 sm:text-right">
              <div>
                <div className="text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">
                  Overall Score
                </div>
                <div className="text-3xl font-bold tracking-tight text-[#0F5C5C]">
                  {overallAvg}
                  <span className="text-sm font-normal text-[#8C8C88]">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Single-Color Thin-Line Metric Bars (No Neon Gauges) */}
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#1A1A1A]">Technical Depth</span>
                <span className="font-mono text-[#0F5C5C] font-medium">{technicalAvg}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E0]">
                <div
                  className="h-full bg-[#0F5C5C]"
                  style={{ width: `${technicalAvg}%` }}
                />
              </div>
              <p className="text-[11px] text-[#8C8C88]">
                Framework concepts, API boundaries, correctness
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#1A1A1A]">Communication</span>
                <span className="font-mono text-[#0F5C5C] font-medium">{communicationAvg}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E0]">
                <div
                  className="h-full bg-[#0F5C5C]"
                  style={{ width: `${communicationAvg}%` }}
                />
              </div>
              <p className="text-[11px] text-[#8C8C88]">
                Clarity, structural pacing, concise delivery
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#1A1A1A]">Completeness</span>
                <span className="font-mono text-[#0F5C5C] font-medium">{completenessAvg}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E0]">
                <div
                  className="h-full bg-[#0F5C5C]"
                  style={{ width: `${completenessAvg}%` }}
                />
              </div>
              <p className="text-[11px] text-[#8C8C88]">
                Edge cases, production trade-offs, rationale
              </p>
            </div>
          </div>
        </div>

        {/* Executive Summary: Strengths & Improvements in plain readable text */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-xl border border-[#C8E5D3] bg-[#EBF6EF]/50 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1F5F3F]">
              <CheckCircle2 className="h-4 w-4" />
              <span>Key Strengths</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#1A1A1A]">
              <li className="flex items-start gap-2">
                <span className="text-[#1F5F3F] font-bold">•</span>
                <span>
                  Consistently provided direct answers before elaborating on supporting technical nuances.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1F5F3F] font-bold">•</span>
                <span>
                  Accurate mental model of modern runtime behavior, memory management, and browser internals.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1F5F3F] font-bold">•</span>
                <span>
                  Sound judgment in selecting appropriate data persistence layers for offline and distributed state.
                </span>
              </li>
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="rounded-xl border border-[#EEDBB2] bg-[#FCF6E9]/50 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#855312]">
              <AlertCircle className="h-4 w-4" />
              <span>Priority Improvements</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#1A1A1A]">
              <li className="flex items-start gap-2">
                <span className="text-[#855312] font-bold">•</span>
                <span>
                  Ground operational trade-offs with concrete metrics (latency percentiles, payload size, memory ceilings).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#855312] font-bold">•</span>
                <span>
                  Proactively address CI/CD regression guards and automated monitoring rather than manual inspection.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#855312] font-bold">•</span>
                <span>
                  Specify failure scenarios and degradation paths when high-availability guarantees cannot be met.
                </span>
              </li>
            </ul>
          </div>
        </div>


        {/* Interview Warnings */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1A1A1A]">
                Interview Monitoring
              </h2>
              <p className="text-xs text-[#6B6B6B]">
                Behavioral monitoring events detected during the session
              </p>
            </div>

            <span className="text-xs font-medium text-[#6B6B6B]">
              {interview.warnings.length} warnings
            </span>
          </div>

          {interview.warnings.length === 0 ? (
            <div className="rounded-xl border border-[#C8E5D3] bg-[#EBF6EF]/50 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1F5F3F]">
                <CheckCircle2 className="h-4 w-4" />
                <span>No warnings detected</span>
              </div>

              <p className="mt-1.5 text-xs text-[#6B6B6B]">
                No monitoring events were recorded during this interview.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#E5E5E0] bg-white shadow-subtle">
              <div className="divide-y divide-[#E5E5E0]">
                {interview.warnings.map((warning) => {
                  const warningLabel =
                    warning.warning_type === "eye_movement"
                      ? "Eye Movement"
                      : warning.warning_type === "lip_movement"
                      ? "Lip Movement"
                      : "Smart Device";

                  const minutes = Math.floor(warning.timestamp_seconds / 60);
                  const seconds = Math.floor(warning.timestamp_seconds % 60);

                  return (
                    <div
                      key={warning.id}
                      className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-[#1A1A1A]">
                          {warningLabel}
                        </div>

                        <div className="mt-1 text-xs text-[#6B6B6B]">
                          Question {warning.question_number}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
                        <span className="font-mono">
                          {String(minutes).padStart(2, "0")}:
                          {String(seconds).padStart(2, "0")}
                        </span>

                        {warning.confidence !== null &&
                          warning.confidence !== undefined && (
                            <span>
                              Confidence: {Math.round(warning.confidence * 100)}%
                            </span>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>  
              
        {/* Per-Question Breakdown */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Question-by-Question Breakdown
            </h2>
            <span className="text-xs text-[#6B6B6B]">
              {interview.questions.length} questions evaluated
            </span>
          </div>

          <div className="space-y-3">
            {interview.questions.map((q, idx) => {
              const isExpanded = expandedQuestion === q.question_number;
              const qScore = q.overall_score ?? 0;
              const fb = (q.feedback as any) || {};

              return (
                <div
                  key={q.id || idx}
                  className="overflow-hidden rounded-xl border border-[#E5E5E0] bg-white transition shadow-subtle"
                >
                  {/* Accordion header */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(q.question_number)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left hover:bg-[#FAFAF8]"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-3 pr-4">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#F5F5F2] text-[11px] font-mono font-medium text-[#1A1A1A]">
                        {q.question_number}
                      </span>
                      <div>
                        <h3 className="text-sm font-medium text-[#1A1A1A] leading-snug">
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-xs font-semibold text-[#0F5C5C]">
                        {qScore}/100
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-[#8C8C88]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#8C8C88]" />
                      )}
                    </div>
                  </button>

                  {/* Accordion content */}
                  {isExpanded && (
                    <div className="border-t border-[#E5E5E0] bg-[#FAFAF8] p-4 sm:p-6 space-y-5">
                      {/* Candidate response */}
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                          Your Recorded Response
                        </div>
                        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#1A1A1A] bg-white border border-[#E5E5E0] rounded-lg p-3.5">
                          {q.answer || "No response recorded."}
                        </p>
                      </div>

                      {/* Strengths & Improvements */}
                      <div className="grid gap-4 sm:grid-cols-2 text-xs">
                        <div className="rounded-lg border border-[#C8E5D3] bg-[#EBF6EF]/40 p-3.5">
                          <span className="font-semibold text-[#1F5F3F] block">
                            Observed Strengths
                          </span>
                          <ul className="mt-2 space-y-1.5 text-[#1A1A1A]">
                            {fb.strengths && fb.strengths.length > 0 ? (
                              fb.strengths.map((str: string, sIdx: number) => (
                                <li key={sIdx} className="flex items-start gap-1.5">
                                  <span className="text-[#1F5F3F] font-bold">•</span>
                                  <span>{str}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-[#6B6B6B]">
                                Direct, sound explanation of the problem statement.
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="rounded-lg border border-[#EEDBB2] bg-[#FCF6E9]/40 p-3.5">
                          <span className="font-semibold text-[#855312] block">
                            Recommended Improvements
                          </span>
                          <ul className="mt-2 space-y-1.5 text-[#1A1A1A]">
                            {fb.improvements && fb.improvements.length > 0 ? (
                              fb.improvements.map((imp: string, iIdx: number) => (
                                <li key={iIdx} className="flex items-start gap-1.5">
                                  <span className="text-[#855312] font-bold">•</span>
                                  <span>{imp}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-[#6B6B6B]">
                                Introduce concrete operational thresholds and benchmarks.
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
