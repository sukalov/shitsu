import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  console.error("VITE_CONVEX_URL is not set. Please configure the Convex URL.");
}
const convex = new ConvexReactClient(
  convexUrl || "https://your-convex-url.convex.cloud",
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexAuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
