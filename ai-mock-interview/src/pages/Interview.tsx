import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useMedia } from "../context/MediaContext";

import type { Interview } from "../types/api";

interface LocationState {
  interview?: Interview;
}

export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  const { stream } = useMedia();

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const state =
    location.state as LocationState | null;

  const interview = state?.interview;

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!interview || !stream) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [interview, stream, navigate]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!interview || !stream) {
    return null;
  }

  const currentQuestion =
    interview.questions[currentQuestionIndex];

  const isLastQuestion =
    currentQuestionIndex ===
    interview.questions.length - 1;

  const handleSubmit = () => {
    if (!answer.trim()) {
      return;
    }

    if (isLastQuestion) {
      console.log("Interview completed");

      return;
    }

    setCurrentQuestionIndex(
      (current) => current + 1
    );

    setAnswer("");
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-violet-400">
              AI Mock Interview
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Technical Interview
            </h1>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm">
            Question{" "}
            <span className="font-semibold text-violet-400">
              {currentQuestionIndex + 1}
            </span>{" "}
            / {interview.questions.length}
          </div>
        </div>

        {/* Main content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Camera */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="aspect-video bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
              <div>
                <p className="text-sm font-medium">
                  Camera
                </p>

                <p className="text-xs text-zinc-500">
                  Interview recording active
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Live
              </span>
            </div>
          </div>

          {/* Question + Answer */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-500">
              Question {currentQuestionIndex + 1}
            </p>

            <h2 className="mt-3 text-2xl font-semibold leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="mt-8">
              <label
                htmlFor="answer"
                className="text-sm font-medium text-zinc-300"
              >
                Your Answer
              </label>

              <textarea
                id="answer"
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                placeholder="Type your answer here..."
                className="mt-3 min-h-56 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Take your time and provide a clear answer.
              </p>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {isLastQuestion
                  ? "Finish Interview"
                  : "Submit Answer"}
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">
              Interview Progress
            </span>

            <span className="text-zinc-500">
              {currentQuestionIndex + 1} /{" "}
              {interview.questions.length}
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) /
                    interview.questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}