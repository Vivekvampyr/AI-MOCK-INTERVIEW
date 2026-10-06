import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/react";

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight"
        >
          Mock<span className="text-violet-500">Interview</span>
        </Link>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-lg px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500">
                Get Started
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link
              to="/dashboard"
              className="rounded-lg px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Dashboard
            </Link>

            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
}