import { SignIn } from "@clerk/react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAFAF8] text-[#1A1A1A] py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left: Credible Brand Context */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#E5E5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#6B6B6B] shadow-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F5C5C]" />
              <span>Candidate Portal</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1A1A] leading-tight">
              Sign in to your candidate workspace.
            </h1>

            <p className="text-sm leading-relaxed text-[#6B6B6B] max-w-md">
              Access your saved interview sessions, review past score trends, and resume practice for your upcoming engineering interviews.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-[#1A1A1A]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0F5C5C] mt-0.5" />
                <span>Private interview evaluations and audio-video recordings</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#1A1A1A]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0F5C5C] mt-0.5" />
                <span>Historical performance trajectory and rubric breakdown</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#1A1A1A]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0F5C5C] mt-0.5" />
                <span>Configurable sessions for React, Django, Python & System Design</span>
              </div>
            </div>

            <div className="border-t border-[#E5E5E0] pt-6 text-xs text-[#8C8C88] leading-relaxed">
              "The most effective way to eliminate interview anxiety is calibrated, repeatable practice under realistic conditions."
            </div>
          </div>

          {/* Right: Crisp Clerk Auth Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                appearance={{
                  variables: {
                    colorPrimary: "#0F5C5C",
                    colorBackground: "#FFFFFF",
                    borderRadius: "0.5rem",
                    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  },
                  elements: {
                    card: "shadow-subtle border border-[#E5E5E0] bg-white rounded-xl p-6 sm:p-8",
                    headerTitle: "text-[#1A1A1A] font-semibold text-xl tracking-tight",
                    headerSubtitle: "text-[#6B6B6B] text-xs",
                    formButtonPrimary:
                      "bg-[#0F5C5C] hover:bg-[#0A4444] text-white text-xs font-medium rounded-md py-2.5 shadow-none transition",
                    socialButtonsBlockButton:
                      "border border-[#E5E5E0] hover:bg-[#F5F5F2] text-[#1A1A1A] text-xs rounded-md py-2",
                    formFieldInput:
                      "border-[#E5E5E0] bg-[#FAFAF8] text-[#1A1A1A] rounded-md text-xs py-2 focus:border-[#0F5C5C] focus:bg-white",
                    footerActionLink: "text-[#0F5C5C] hover:text-[#0A4444] font-medium text-xs",
                    dividerLine: "bg-[#E5E5E0]",
                    dividerText: "text-[#8C8C88] text-xs",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}