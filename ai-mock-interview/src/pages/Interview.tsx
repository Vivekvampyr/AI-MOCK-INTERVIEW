import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { useAuth } from "@clerk/react";
import {
  Clock,
  Video,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Volume2,
} from "lucide-react";

import { useMedia } from "../context/MediaContext";
import type { Interview, InterviewQuestion } from "../types/api";
import { createWarningEvent, submitAnswer, terminateInterview } from "../services/api";
import type {WarningEvent, WarningType} from "../types/interview";
import { detectEyeMovement } from "../services/eyeMovementDetector";
import { detectLipMovement } from "../services/lipMovementDetector";
import { detectSmartDevice } from "../services/smartDeviceDetector";

interface LocationState {
  interview?: Interview;
}

// Fallback questions for direct viewing/testing
const fallbackInterview: Interview = {
  id: 101,
  experience: "3-5",
  tech_stack: ["React", "TypeScript", "System Design"],
  total_questions: 4,
  current_question: 1,
  total_score: null,
  status: "in_progress",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  questions: [
    {
      id: 1,
      question_number: 1,
      question:
        "Explain how React 19's Server Actions and compiler handle component re-renders compared to traditional useMemo and useCallback optimizations.",
      answer: "",
      technical_score: null,
      communication_score: null,
      completeness_score: null,
      overall_score: null,
      feedback: {},
    },
    {
      id: 2,
      question_number: 2,
      question:
        "How would you architect client-side state management for an offline-first dashboard with optimistic UI updates and conflict resolution?",
      answer: "",
      technical_score: null,
      communication_score: null,
      completeness_score: null,
      overall_score: null,
      feedback: {},
    },
    {
      id: 3,
      question_number: 3,
      question:
        "Walk through a scenario where a memory leak occurred in a React single-page application. How did you identify, profile, and resolve it?",
      answer: "",
      technical_score: null,
      communication_score: null,
      completeness_score: null,
      overall_score: null,
      feedback: {},
    },
    {
      id: 4,
      question_number: 4,
      question:
        "What architectural trade-offs do you consider when choosing between client-side rendering, SSR with streaming, and static site generation?",
      answer: "",
      technical_score: null,
      communication_score: null,
      completeness_score: null,
      overall_score: null,
      feedback: {},
    },
  ],
  warnings: [],
};

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { getToken } = useAuth();
  const { stream } = useMedia();

  const eyeMovementCountRef = useRef(0);
  const lastEyeWarningRef = useRef(0);

  const lipMovementCountRef = useRef(0);
  const lastLipWarningRef = useRef(0);

  // const smartDeviceCountRef = useRef(0);
  const lastSmartDeviceWarningRef = useRef(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const state = location.state as LocationState | null;
  const interview = state?.interview || fallbackInterview;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answersMap, setAnswersMap] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [warnings, setWarnings] = useState<WarningEvent[]>([]);
  const currentQuestion: InterviewQuestion = interview.questions[currentQuestionIndex] || interview.questions[0];

  
  
  const recordWarning = useCallback(
    async (
      type: WarningType,
      confidence?: number
    ) => {
      try {
        const token = await getToken();

        if (!token || !interview.id) {
          return;
        }

        const result = await createWarningEvent(
          token,
          interview.id,
          type,
          currentQuestion.question_number,
          elapsedSeconds,
          confidence
        );

        if (result.warning) {
          setWarnings((prev) => [
            ...prev,
            {
              id: result.warning.id,
              type: result.warning.warning_type as WarningType,
              timestamp: result.warning.timestamp_seconds,
              questionNumber: result.warning.question_number,
              confidence: result.warning.confidence,
            },
          ]);
        }
      } catch (error) {
        console.error(
          "Failed to save warning event:",
          error
        );
      }
    },
    [
      getToken,
      interview.id,
      currentQuestion.question_number,
      elapsedSeconds,
    ]
  );

  useEffect(() => {
    if (!stream) return;

    let animationFrameId = 0;
    let isActive = true;

    const detect = async () => {
      if (!isActive) return;

      const video = videoRef.current;

      if (video) {
        try {
          const moved = await detectEyeMovement(video);

          if (moved) {
            eyeMovementCountRef.current += 1;
          } else {
            eyeMovementCountRef.current = 0;
          }

          const now = Date.now();

          const sustainedMovement =
            eyeMovementCountRef.current >= 3;

          const cooldownPassed =
            now - lastEyeWarningRef.current >= 10000;

          if (sustainedMovement && cooldownPassed) {
            lastEyeWarningRef.current = now;
            eyeMovementCountRef.current = 0;

            await recordWarning("eye_movement");
          }
        } catch (error) {
          console.error(
            "Eye movement detection error:",
            error
          );
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    };

    detect();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [stream, recordWarning]);

  useEffect(() => {
    if (!stream) return;

    let animationFrameId = 0;
    let isActive = true;

    const detect = async () => {
      if (!isActive) return;

      const video = videoRef.current;

      if (video) {
        try {
          const moved = await detectLipMovement(video);

          if (moved) {
            lipMovementCountRef.current += 1;
          } else {
            lipMovementCountRef.current = 0;
          }

          const now = Date.now();

          const sustainedMovement =
            lipMovementCountRef.current >= 3;

          const cooldownPassed =
            now - lastLipWarningRef.current >= 10000;

          if (sustainedMovement && cooldownPassed) {
            lastLipWarningRef.current = now;
            lipMovementCountRef.current = 0;

            await recordWarning("lip_movement");
          }
        } catch (error) {
          console.error(
            "Lip movement detection error:",
            error
          );
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    };

    detect();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [stream, recordWarning]);

  useEffect(() => {
    if (!stream) return;

    let isActive = true;
    let isDetecting = false;
    let lastDetectionTime = 0;

    const detect = async () => {
      if (!isActive) return;

      const now = Date.now();

      if (isDetecting || now - lastDetectionTime < 500) {
        requestAnimationFrame(detect);
        return;
      }

      const video = videoRef.current;

      if (video) {
        isDetecting = true;
        lastDetectionTime = now;

        try {
          const confidence = await detectSmartDevice(video);

          if (confidence !== null) {
            console.log("PHONE DETECTED:", confidence);

            const currentTime = Date.now();

            const cooldownPassed =
              currentTime - lastSmartDeviceWarningRef.current >= 10000;

            if (cooldownPassed) {
              console.log("TRIGGERING SMART DEVICE WARNING");

              lastSmartDeviceWarningRef.current = currentTime;

              await recordWarning(
                "smart_device",
                confidence
              );
            }
          }
        } catch (error) {
          console.error(
            "Smart device detection error:",
            error
          );
        } finally {
          isDetecting = false;
        }
      }

      requestAnimationFrame(detect);
    };

    detect();

    return () => {
      isActive = false;
    };
  }, [stream, recordWarning]);

  // Timer: quiet elapsed counter
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Video feed hookup
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Speech Recognition setup (Voice input option)

  const totalQuestions = interview.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Keyboard shortcut Ctrl/Cmd + Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (answer.trim() && !isSubmitting) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const trimmedAnswer = answer.trim();

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token unavailable.");
      }

      if (!interview.id) {
        throw new Error("Interview ID is missing.");
      }

      const result = await submitAnswer(
        token,
        interview.id,
        currentQuestion.question_number,
        trimmedAnswer
      );

      const updatedAnswers = {
        ...answersMap,
        [currentQuestion.question_number]: trimmedAnswer,
      };

      setAnswersMap(updatedAnswers);

      if (isLastQuestion) {
        if (!result.interview) {
          throw new Error("Completed interview data was not returned.");
        }

        navigate("/interview/report", {
          state: {
            interview: result.interview,
            totalDuration: elapsedSeconds,
          },
        });

        return;
      }

      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswer("");
    } catch (error) {
      console.error("Failed to save answer:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to save your answer. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-canvas text-text-primary">
      {/* Distraction-free top utility bar */}
      <header className="border-b border-border-base bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Leave this interview session? Your progress will be discarded.")) {
                  navigate("/dashboard");
                }
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary"
              aria-label="Exit interview"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Exit session</span>
            </button>
            <span className="text-border-base">|</span>
            <span className="text-xs font-medium text-text-secondary">
              {interview.tech_stack.join(", ")} · {interview.experience} yrs
            </span>
          </div>

          {/* Quiet Timer & Progress */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-text-secondary">
              <Clock className="h-3.5 w-3.5 text-text-tertiary" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-primary">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border-base">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Left Column: Quiet Camera & Audio Monitor */}
          <aside className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-border-base bg-white shadow-subtle">
              <div className="relative aspect-video w-full bg-background">
                {stream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center p-4">
                    <Video className="h-7 w-7 text-text-tertiary" />
                    <p className="mt-2 text-xs text-text-tertiary">
                      Camera stream standby
                    </p>
                  </div>
                )}

                {warnings.length > 0 && (
                  <div className="mt-3 rounded-lg border border-border-error bg-background-error px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-error animate-pulse" />

                      <span className="text-xs font-medium text-error">
                        Warning detected
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] text-text-secondary">
                      {warnings[warnings.length - 1].type === "eye_movement"
                        ? "Please keep your eyes focused on the interview screen."
                        : warnings[warnings.length - 1].type === "lip_movement"
                        ? "Unusual lip movement detected."
                        : "Smart device detected."}
                    </p>
                  </div>
                )}

                {/* Recording status */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-white/95 px-2 py-1 text-[11px] font-medium text-text-primary border border-border-base">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>Recording Active</span>
                </div>

                {/* Live warning count */}
                <div className="absolute top-2.5 right-2.5 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-text-primary border border-border-base">
                  {warnings.length}: Warnings
                </div>
              </div>

              <div className="border-t border-border-base px-3.5 py-3 text-xs text-text-secondary">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium text-text-primary">
                    <Volume2 className="h-3.5 w-3.5 text-primary" />
                    Microphone Input
                  </span>
                  <span className="rounded bg-background-success px-1.5 py-0.5 text-[11px] font-medium text-text-success">
                    Connected
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                  Keep your focus forward and structure your responses clearly.
                </p>
              </div>
            </div>

            {/* Quiet Tips / Checklist */}
            <div className="rounded-xl border border-border-base bg-white p-4 text-xs text-text-secondary">
              <h3 className="font-medium text-text-primary">Response Guidelines</h3>
              <ul className="mt-2.5 space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">1.</span>
                  <span>State your direct answer or recommendation first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">2.</span>
                  <span>Reference concrete technical trade-offs and edge cases.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">3.</span>
                  <span>Mention production experience and architectural rationale.</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* Right Column: Question & Answer Workspace */}
          <section className="flex flex-col rounded-xl border border-border-base bg-white p-6 shadow-subtle sm:p-8">
            {/* Question Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Question {currentQuestionIndex + 1}
                </span>
                <span className="text-xs text-text-secondary">
                  Technical Depth & Implementation
                </span>
              </div>

              <h1 className="mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-text-primary">
                {currentQuestion.question}
              </h1>
            </div>

            {/* Answer Input Area */}
            <div className="mt-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-2">
                <label
                  htmlFor="interview-answer"
                  className="text-xs font-medium text-text-primary"
                >
                  Your Answer
                </label>

                <div className="flex items-center gap-3">

                  <span className="text-xs text-text-tertiary">
                    {wordCount} {wordCount === 1 ? "word" : "words"}
                  </span>
                </div>
              </div>

              <textarea
                id="interview-answer"
                rows={9}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your structured response here, detailing implementation details, architectural choices, and why you made them..."
                className="w-full flex-1 rounded-lg border border-border-base bg-canvas p-4 text-sm leading-relaxed text-text-primary placeholder:text-text-tertiary focus:border-primary focus:bg-white focus:outline-none"
              />

              <div className="mt-3 flex items-center justify-between text-xs text-text-tertiary">
                <span>
                  Shortcut: <kbd className="rounded border border-border-base bg-canvas px-1.5 py-0.5 text-[11px] font-mono text-text-primary">Ctrl</kbd> + <kbd className="rounded border border-border-base bg-canvas px-1.5 py-0.5 text-[11px] font-mono text-text-primary">Enter</kbd> to submit
                </span>
              </div>
            </div>

            {/* Submission Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-border-base pt-5">
              <button
                type="button"
                onClick={() => setAnswer("")}
                disabled={!answer}
                className="text-xs font-medium text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Clear text
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-md bg-teal-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-hover disabled:cursor-not-allowed disabled:bg-border-strong disabled:text-text-tertiary"
                >
                  {isSubmitting ? (
                    "Saving response..."
                  ) : isLastQuestion ? (
                    <>
                      <span>Complete & Review Report</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Submit & Next Question</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}