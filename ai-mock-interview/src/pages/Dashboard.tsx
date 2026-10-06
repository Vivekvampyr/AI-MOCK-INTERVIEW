import { useState } from "react";
import { useUser } from "@clerk/react";

import InterviewSetupModal from "../components/InterviewSetupModal";

import type {
  InterviewSetup,
} from "../types/interview";

import {
  useNavigate,
} from "react-router-dom";

export default function Dashboard() {
  const { user } = useUser();

  const navigate = useNavigate();

  const [isSetupOpen, setIsSetupOpen] =
    useState(false);

  const handleInterviewSetup = (
    setup: InterviewSetup
    ) => {
        setIsSetupOpen(false);

        navigate("/interview/permission", {
            state: {
            setup,
            },
        });
    };

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div>
            <p className="text-sm text-zinc-500">
              Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Welcome,{" "}
              {user?.firstName || "Candidate"}
            </h1>

            <p className="mt-2 text-zinc-400">
              Ready to practice your next interview?
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-500">
                Interviews
              </p>

              <p className="mt-2 text-3xl font-bold">
                0
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-500">
                Average Score
              </p>

              <p className="mt-2 text-3xl font-bold">
                --
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-500">
                Best Score
              </p>

              <p className="mt-2 text-3xl font-bold">
                --
              </p>
            </div>
          </div>

          {/* Start Interview */}
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-xl font-semibold">
              Start a Mock Interview
            </h2>

            <p className="mt-2 max-w-xl text-zinc-400">
              Choose your experience and tech stack to
              generate a personalized technical interview.
            </p>

            <button
              type="button"
              onClick={() => setIsSetupOpen(true)}
              className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-500"
            >
              Start Interview
            </button>
          </div>
        </div>
      </main>

      <InterviewSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onContinue={handleInterviewSetup}
      />
    </>
  );
}