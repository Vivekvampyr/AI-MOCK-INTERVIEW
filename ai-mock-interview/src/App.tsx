import {
  Show,
  RedirectToSignIn,
} from "@clerk/react";

import {
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import InterviewPermission from "./pages/InterviewPermission";
import Interview from "./pages/Interview";

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

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/sign-in"
          element={<SignIn />}
        />

        <Route
          path="/sign-up"
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

      </Routes>
    </>
  );
}