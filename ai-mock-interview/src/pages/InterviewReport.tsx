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

export default function InterviewReport() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;
  const interview = state?.interview;

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  const toggleExpand = (qNum: number) => {
    setExpandedQuestion((prev) => (prev === qNum ? null : qNum));
  };

  const handlePrint = () => {
    window.print();
  };

  if (!interview) {
    navigate("/dashboard");
    return null;
  }

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

  const overallAvg =
    interview.total_score ??
    Math.round((technicalAvg + communicationAvg + completenessAvg) / 3);
  
  const allStrengths = interview.questions.flatMap((q) => {
  const feedback = (q.feedback as any) || {};
  return Array.isArray(feedback.strengths) ? feedback.strengths : [];
  });

  const allImprovements = interview.questions.flatMap((q) => {
    const feedback = (q.feedback as any) || {};
    return Array.isArray(feedback.improvements)
      ? feedback.improvements
      : [];
  });

  const uniqueStrengths = [...new Set(allStrengths)].slice(0, 3);
  const uniqueImprovements = [...new Set(allImprovements)].slice(0, 3);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAFAF8] text-[#1A1A1A] py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Top Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="rounded-xl border border-[#E5E5E0] bg-white p-6 shadow-subtle sm:p-8">
          <div className="flex flex-col gap-4 border-b border-[#E5E5E0] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#0F5C5C]">
                Evaluation Report
              </span>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1A1A1A]">
                Technical Interview Assessment
              </h1>

              <p className="mt-1 text-xs text-[#6B6B6B]">
                Focus: {interview.tech_stack.join(", ")} · Seniority:{" "}
                {interview.experience} · Completed on{" "}
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
                <div className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                  Overall Score
                </div>

                <div className="text-3xl font-bold tracking-tight text-[#0F5C5C]">
                  {overallAvg}
                  <span className="text-sm font-normal text-[#8C8C88]">
                    /100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Bars */}
          <div className="mt-6 grid gap-5 sm:grid-cols-3">

            {/* Technical */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#1A1A1A]">
                  Technical Depth
                </span>

                <span className="font-mono font-medium text-[#0F5C5C]">
                  {technicalAvg}%
                </span>
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

            {/* Communication */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#1A1A1A]">
                  Communication
                </span>

                <span className="font-mono font-medium text-[#0F5C5C]">
                  {communicationAvg}%
                </span>
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

            {/* Completeness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#1A1A1A]">
                  Completeness
                </span>

                <span className="font-mono font-medium text-[#0F5C5C]">
                  {completenessAvg}%
                </span>
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

        {/* Executive Summary */}
        <div className="grid gap-6 sm:grid-cols-2">

          {/* Strengths */}
          <div className="rounded-xl border border-[#C8E5D3] bg-[#EBF6EF]/50 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1F5F3F]">
              <CheckCircle2 className="h-4 w-4" />
              <span>Key Strengths</span>
            </div>

            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#1A1A1A]">
              {uniqueStrengths.length > 0 ? (
                uniqueStrengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-bold text-[#1F5F3F]">•</span>
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#6B6B6B]">
                  No strengths were identified.
                </li>
              )}
            </ul>
          </div>

          {/* Improvements */}
          <div className="rounded-xl border border-[#EEDBB2] bg-[#FCF6E9]/50 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#855312]">
              <AlertCircle className="h-4 w-4" />
              <span>Priority Improvements</span>
            </div>

            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#1A1A1A]">
              {uniqueImprovements.length > 0 ? (
                uniqueImprovements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-bold text-[#855312]">•</span>
                    <span>{improvement}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#6B6B6B]">
                  No improvements were identified.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Interview Recording */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Interview Recording
            </h2>

            <p className="mt-0.5 text-xs text-[#6B6B6B]">
              Recorded video and audio from your interview session
            </p>
          </div>

          {interview.recording ? (
            <div className="overflow-hidden rounded-xl border border-[#E5E5E0] bg-black shadow-subtle">
              <video
                controls
                className="w-full"
                src={
                  interview.recording.startsWith("http")
                    ? interview.recording
                    : `http://127.0.0.1:8000${interview.recording}`
                }
              />
            </div>
          ) : (
            <div className="rounded-xl border border-[#E5E5E0] bg-white p-5">
              <p className="text-xs text-[#6B6B6B]">
                No interview recording is available.
              </p>
            </div>
          )}
        </section>

        {/* Interview Monitoring */}
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
                        : warning.warning_type === "smart_device"
                          ? "Smart Device Detected"
                          : warning.warning_type === "tab_switch"
                            ? "Tab Switch Detected"
                            : warning.warning_type === "fullscreen_exit"
                              ? "Fullscreen Exited"
                              : "Unknown Warning";

                  const minutes = Math.floor(
                    warning.timestamp_seconds / 60
                  );

                  const seconds = Math.floor(
                    warning.timestamp_seconds % 60
                  );

                  const screenshotUrl = warning.screenshot
                    ? warning.screenshot.startsWith("http")
                      ? warning.screenshot
                      : `http://127.0.0.1:8000${warning.screenshot}`
                    : null;

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
                        {screenshotUrl && (
                          <a
                            href={screenshotUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={screenshotUrl}
                              alt={`${warningLabel} warning`}
                              className="h-14 w-24 rounded-md border border-[#E5E5E0] object-cover"
                            />
                          </a>
                        )}

                        <span className="font-mono">
                          {String(minutes).padStart(2, "0")}:
                          {String(seconds).padStart(2, "0")}
                        </span>

                        {warning.confidence !== null &&
                          warning.confidence !== undefined && (
                            <span>
                              Confidence:{" "}
                              {Math.round(warning.confidence * 100)}%
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
              const isExpanded =
                expandedQuestion === q.question_number;

              const qScore = q.overall_score ?? 0;

              const fb = (q.feedback as any) || {};

              return (
                <div
                  key={q.id || idx}
                  className="overflow-hidden rounded-xl border border-[#E5E5E0] bg-white shadow-subtle transition"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleExpand(q.question_number)
                    }
                    className="flex w-full items-center justify-between p-4 text-left hover:bg-[#FAFAF8] sm:p-5"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-3 pr-4">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#F5F5F2] text-[11px] font-mono font-medium text-[#1A1A1A]">
                        {q.question_number}
                      </span>

                      <div>
                        <h3 className="text-sm font-medium leading-snug text-[#1A1A1A]">
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
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

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="space-y-5 border-t border-[#E5E5E0] bg-[#FAFAF8] p-4 sm:p-6">

                      {/* Candidate Response */}
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                          Your Recorded Response
                        </div>

                        <p className="mt-1.5 rounded-lg border border-[#E5E5E0] bg-white p-3.5 text-xs leading-relaxed text-[#1A1A1A] sm:text-sm">
                          {q.answer || "No response recorded."}
                        </p>
                      </div>

                      {/* Strengths & Improvements */}
                      <div className="grid gap-4 text-xs sm:grid-cols-2">

                        {/* Strengths */}
                        <div className="rounded-lg border border-[#C8E5D3] bg-[#EBF6EF]/40 p-3.5">
                          <span className="block font-semibold text-[#1F5F3F]">
                            Observed Strengths
                          </span>

                          <ul className="mt-2 space-y-1.5 text-[#1A1A1A]">
                            {fb.strengths &&
                            fb.strengths.length > 0 ? (
                              fb.strengths.map(
                                (str: string, sIdx: number) => (
                                  <li
                                    key={sIdx}
                                    className="flex items-start gap-1.5"
                                  >
                                    <span className="font-bold text-[#1F5F3F]">
                                      •
                                    </span>

                                    <span>{str}</span>
                                  </li>
                                )
                              )
                            ) : (
                              <li className="text-[#6B6B6B]">
                                Direct, sound explanation of the problem
                                statement.
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Improvements */}
                        <div className="rounded-lg border border-[#EEDBB2] bg-[#FCF6E9]/40 p-3.5">
                          <span className="block font-semibold text-[#855312]">
                            Recommended Improvements
                          </span>

                          <ul className="mt-2 space-y-1.5 text-[#1A1A1A]">
                            {fb.improvements &&
                            fb.improvements.length > 0 ? (
                              fb.improvements.map(
                                (imp: string, iIdx: number) => (
                                  <li
                                    key={iIdx}
                                    className="flex items-start gap-1.5"
                                  >
                                    <span className="font-bold text-[#855312]">
                                      •
                                    </span>

                                    <span>{imp}</span>
                                  </li>
                                )
                              )
                            ) : (
                              <li className="text-[#6B6B6B]">
                                Introduce concrete operational thresholds
                                and benchmarks.
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