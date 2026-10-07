import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { MediaProvider } from "./context/MediaContext";

import "./index.css";

const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY"
  );
}

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
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
  </React.StrictMode>
);