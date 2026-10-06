import { useState } from "react";
import type {
  ExperienceLevel,
  InterviewSetup,
} from "../types/interview";

interface InterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (setup: InterviewSetup) => void;
}

const experienceOptions: {
  label: string;
  value: ExperienceLevel;
}[] = [
  {
    label: "Fresher",
    value: "fresher",
  },
  {
    label: "1–2 Years",
    value: "1-2",
  },
  {
    label: "3–5 Years",
    value: "3-5",
  },
  {
    label: "5+ Years",
    value: "5+",
  },
];

const techStackOptions = [
  "React",
  "Django",
  "Python",
  "Java",
  "JavaScript",
  "Node.js",
  "FastAPI",
  "MERN",
  "SQL",
];

export default function InterviewSetupModal({
  isOpen,
  onClose,
  onContinue,
}: InterviewSetupModalProps) {
  const [experience, setExperience] =
    useState<ExperienceLevel>("fresher");

  const [techStack, setTechStack] = useState<string[]>([]);

  if (!isOpen) {
    return null;
  }

  const toggleTechStack = (tech: string) => {
    setTechStack((current) =>
      current.includes(tech)
        ? current.filter((item) => item !== tech)
        : [...current, tech]
    );
  };

  const handleContinue = () => {
    if (techStack.length === 0) {
      return;
    }

    onContinue({
      experience,
      techStack,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              Interview Setup
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Configure your mock interview
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Choose your experience level and the technologies
              you want to be interviewed on.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Experience */}
        <div className="mt-8">
          <label className="text-sm font-semibold text-zinc-200">
            Years of Experience
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {experienceOptions.map((option) => {
              const selected =
                experience === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setExperience(option.value)
                  }
                  className={`rounded-xl border px-4 py-4 text-sm font-medium transition ${
                    selected
                      ? "border-violet-500 bg-violet-500/10 text-violet-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-200">
              Tech Stack
            </label>

            <span className="text-xs text-zinc-500">
              {techStack.length} selected
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            {techStackOptions.map((tech) => {
              const selected =
                techStack.includes(tech);

              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() =>
                    toggleTechStack(tech)
                  }
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    selected
                      ? "border-violet-500 bg-violet-500/10 text-violet-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <span className="mr-2">
                    {selected ? "✓" : "○"}
                  </span>

                  {tech}
                </button>
              );
            })}
          </div>

          {techStack.length === 0 && (
            <p className="mt-3 text-xs text-amber-400">
              Select at least one technology.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={techStack.length === 0}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}