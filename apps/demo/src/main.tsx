import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  UIProvider,
  ToastProvider,
  TooltipProvider,
  type UIScheme,
  type UIStyle,
} from "@srui/react";
import { App } from "./App";
import "./app.css";

// Test hook: let ?style=&scheme= URL params pick the initial preset/scheme
// (used by the Playwright a11y / visual suites).
const params = new URLSearchParams(window.location.search);
const styleParam = params.get("style") as UIStyle | null;
const schemeParam = params.get("scheme") as UIScheme | null;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UIProvider
      defaultStyle={styleParam ?? undefined}
      defaultScheme={schemeParam ?? undefined}
    >
      <ToastProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </ToastProvider>
    </UIProvider>
  </StrictMode>,
);
