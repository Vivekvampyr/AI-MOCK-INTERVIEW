import { useState } from "react";
import { X, Check } from "lucide-react";
import type { ExperienceLevel, InterviewSetup } from "../types/interview";

interface InterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (setup: InterviewSetup) => void;
}

const experienceOptions: {
  label: string;
  sub: string;
  value: ExperienceLevel;
}[] = [
  {
    label: "Fresher",
    sub: "0–1 yr",
    value: "fresher",
  },
  {
    label: "Early Career",
    sub: "1–2 yrs",
    value: "1-2",
  },
  {
    label: "Mid-Level",
    sub: "3–5 yrs",
    value: "3-5",
  },
  {
    label: "Senior Staff",
    sub: "5+ yrs",
    value: "5+",
  },
];

const techStackOptions = [
  "React",
  "TypeScript",
  "Django",
  "Python",
  "Node.js",
  "FastAPI",
  "System Design",
  "SQL & Databases",
  "Java",
];

export default function InterviewSetupModal({
  isOpen,
  onClose,
  onContinue,
}: InterviewSetupModalProps) {
  const [experience, setExperience] = useState<ExperienceLevel>("3-5");
  const [techStack, setTechStack] = useState<string[]>(["React", "TypeScript"]);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl rounded-xl border border-[#E5E5E0] bg-white p-6 shadow-popover">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E5E0] pb-4">
          <div>
            <span className="text-xs font-medium text-[#0F5C5C] uppercase tracking-wider">
              Step 1 of 3
            </span>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#1A1A1A]">
              Configure Mock Interview
            </h2>
            <p className="mt-1 text-xs text-[#6B6B6B]">
              Specify your seniority level and target tech stack to tailor the questions.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#6B6B6B] hover:bg-[#F5F5F2] hover:text-[#1A1A1A]"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Experience Level */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-[#1A1A1A]">
            Target Seniority Level
          </label>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {experienceOptions.map((option) => {
              const selected = experience === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setExperience(option.value)}
                  className={`rounded-lg border p-3 text-left transition ${
                    selected
                      ? "border-[#0F5C5C] bg-[#EBF5F5] text-[#0F5C5C]"
                      : "border-[#E5E5E0] bg-[#FAFAF8] text-[#1A1A1A] hover:bg-[#F5F5F2]"
                  }`}
                >
                  <p className="text-xs font-semibold">{option.label}</p>
                  <p className="mt-0.5 text-[11px] text-[#6B6B6B]">{option.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#1A1A1A]">
              Focus Technologies
            </label>
            <span className="text-xs text-[#8C8C88]">
              {techStack.length} selected
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {techStackOptions.map((tech) => {
              const selected = techStack.includes(tech);

              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTechStack(tech)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    selected
                      ? "border-[#0F5C5C] bg-[#EBF5F5] text-[#0F5C5C]"
                      : "border-[#E5E5E0] bg-[#FAFAF8] text-[#1A1A1A] hover:bg-[#F5F5F2]"
                  }`}
                >
                  <span>{tech}</span>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      selected
                        ? "border-[#0F5C5C] bg-[#0F5C5C] text-white"
                        : "border-[#D1D1CB] bg-white"
                    }`}
                  >
                    {selected && <Check className="h-3 w-3 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {techStack.length === 0 && (
            <p className="mt-2 text-xs text-[#855312]">
              Select at least one technology to continue.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-7 flex items-center justify-end gap-2.5 border-t border-[#E5E5E0] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#E5E5E0] bg-white px-3.5 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F5F2]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={techStack.length === 0}
            className="rounded-md bg-[#0F5C5C] px-4 py-2 text-xs font-medium text-white hover:bg-[#0A4444] disabled:bg-[#D1D1CB] disabled:text-[#8C8C88]"
          >
            Proceed to Device Check
          </button>
        </div>
      </div>
    </div>
  );
}