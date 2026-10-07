import { SignUp } from "@clerk/react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Shield } from "lucide-react";

export default function SignUpPage() {
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
              <span>Create Candidate Account</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1A1A] leading-tight">
              Start practicing engineering interviews today.
            </h1>

            <p className="text-sm leading-relaxed text-[#6B6B6B] max-w-md">
              Create a free candidate profile to configure interview sessions tailored to your target seniority and tech stack.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-[#1A1A1A]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0F5C5C] mt-0.5" />
                <span>Simulate live technical questions with camera & microphone</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#1A1A1A]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0F5C5C] mt-0.5" />
                <span>Receive detailed feedback on technical correctness and clarity</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#1A1A1A]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0F5C5C] mt-0.5" />
                <span>Zero spam, zero fake stats, and completely private results</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-[#E5E5E0] bg-white p-3 text-xs text-[#6B6B6B] shadow-subtle">
              <Shield className="h-4 w-4 text-[#0F5C5C] shrink-0" />
              <span>Free tier includes unlimited practice sessions for all supported stacks.</span>
            </div>
          </div>

          {/* Right: Crisp Clerk Auth Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
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