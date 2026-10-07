import {
  Show,
  UserButton,
  useUser,
} from "@clerk/react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user } = useUser();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isInterview = location.pathname.startsWith("/interview");

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Candidate";

  const displayEmail = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E0] bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-[#1A1A1A] transition hover:opacity-85"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#0F5C5C] text-[11px] font-semibold text-white">
              IC
            </span>
            <span>InterviewCraft</span>
          </Link>

          <Show when="signed-in">
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <Link
                to="/dashboard"
                className={`rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition ${
                  isDashboard
                    ? "bg-[#F5F5F2] text-[#1A1A1A]"
                    : "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F5F2]"
                }`}
              >
                Dashboard
              </Link>
              {isInterview && (
                <span className="rounded-md bg-[#EBF5F5] px-2.5 py-1 text-xs font-medium text-[#0F5C5C] border border-[#B8DCDC]">
                  Active Session
                </span>
              )}
            </nav>
          </Show>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Signed-out actions: Directly route to dedicated Sign-in and Sign-up pages */}
          <Show when="signed-out">
            <div className="flex items-center gap-2.5">
              <Link
                to="/sign-in"
                className="rounded-md border border-[#E5E5E0] bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F2] hover:border-[#D1D1CB]"
              >
                Sign In
              </Link>

              <Link
                to="/sign-up"
                className="rounded-md bg-[#0F5C5C] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-[#0A4444]"
              >
                Get Started
              </Link>
            </div>
          </Show>

          {/* Signed-in user profile: Shows Avatar + User Name + Email ID */}
          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="sm:hidden text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A]"
              >
                Dashboard
              </Link>

              <div className="flex items-center gap-3 rounded-lg border border-[#E5E5E0] bg-[#FAFAF8] px-3 py-1.5 shadow-subtle">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8 rounded-md ring-1 ring-[#E5E5E0]",
                    },
                  }}
                />

                <div className="flex flex-col text-left leading-tight">
                  <span className="text-xs font-semibold text-[#1A1A1A]">
                    {displayName}
                  </span>
                  {displayEmail && (
                    <span className="text-[11px] text-[#6B6B6B] max-w-[140px] sm:max-w-[200px] truncate">
                      {displayEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}