import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { MediaProvider } from "./context/MediaContext";

import "./index.css";

const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_c2V0dGxpbmctdGV0cmEtNzk1My5jbGVyay5hY2NvdW50cy5kZXYk";

if (!publishableKey) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, sans-serif", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}>
          <div style={{ maxWidth: "480px", width: "100%", padding: "24px", backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E5E0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>Something went wrong</h2>
            <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "16px" }}>
              {this.state.error?.message || "An unexpected error occurred while loading the application."}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: "8px 16px", backgroundColor: "#0F5C5C", color: "#FFFFFF", borderRadius: "8px", border: "none", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer" }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={publishableKey}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#0F5C5C",
            colorBackground: "#FFFFFF",
            borderRadius: "0.5rem",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          },
          elements: {
            card: "shadow-none border border-[#E5E5E0] bg-white rounded-xl",
            formButtonPrimary: "bg-[#0F5C5C] hover:bg-[#0A4444] text-white text-sm font-medium rounded-lg shadow-none",
            footerActionLink: "text-[#0F5C5C] hover:text-[#0A4444]",
          },
        }}
      >
        <BrowserRouter>
          <MediaProvider>
            <App />
          </MediaProvider>
        </BrowserRouter>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
);