import { useLocation, useNavigate } from "react-router-dom";

import { useMedia } from "../context/MediaContext";

import type { InterviewSetup } from "../types/interview";

interface LocationState {
  setup?: InterviewSetup;
}

export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  const { stream } = useMedia();

  const state =
    location.state as LocationState | null;

  if (!state?.setup || !stream) {
    navigate("/dashboard", {
      replace: true,
    });

    return null;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">
          Interview Screen
        </h1>

        <p className="mt-2 text-zinc-400">
          Interview UI will be implemented in the next
          phase.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            Selected Experience
          </p>

          <p className="mt-1 font-medium">
            {state.setup.experience}
          </p>

          <p className="mt-6 text-sm text-zinc-500">
            Selected Tech Stack
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {state.setup.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-400"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 aspect-video max-w-2xl overflow-hidden rounded-xl bg-black">
            <video
              ref={(element) => {
                if (element) {
                  element.srcObject = stream;
                }
              }}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}