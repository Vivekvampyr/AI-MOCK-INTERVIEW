import {
  Show,
  SignUpButton,
} from "@clerk/react";

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-6 py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
            AI-Powered Mock Interviews
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Practice interviews.
            <span className="block text-violet-500">
              Improve faster.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Prepare for technical interviews with AI-generated
            questions, real-time interview monitoring, and
            detailed performance feedback.
          </p>

          <div className="mt-10 flex gap-4">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="rounded-xl bg-violet-600 px-6 py-3 font-medium hover:bg-violet-500">
                  Start Interview
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link
                to="/dashboard"
                className="rounded-xl bg-violet-600 px-6 py-3 font-medium hover:bg-violet-500"
              >
                Go to Dashboard
              </Link>
            </Show>
          </div>
        </div>
      </section>
    </main>
  );
}