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
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <BrowserRouter>
        <MediaProvider>
          <App />
        </MediaProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);