import { lazy, Suspense } from "react";
import {
  Show,
  RedirectToSignIn,
} from "@clerk/react";
import {
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

// Core page loaded eagerly
import Home from "./pages/Home";

// Route-level code-splitting for heavy pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const InterviewPermission = lazy(() => import("./pages/InterviewPermission"));
const Interview = lazy(() => import("./pages/Interview"));
const InterviewReport = lazy(() => import("./pages/InterviewReport"));

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  return (
    <Show
      when="signed-in"
      fallback={<RedirectToSignIn />}
    >
      {children}
    </Show>
  );
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#0F5C5C] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#6B6B6B] font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/sign-in/*"
            element={<SignIn />}
          />

          <Route
            path="/sign-up/*"
            element={<SignUp />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/permission"
            element={
              <ProtectedRoute>
                <InterviewPermission />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/report"
            element={
              <ProtectedRoute>
                <InterviewReport />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}