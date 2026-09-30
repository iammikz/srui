import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import "./app.css";

export const createRoot = ViteReactSSG(
  // react-router-dom data routes (src/routes.tsx) — the root route mounts
  // DocsLayout (AppShell + providers), the children are the MDX pages.
  { routes },
  ({ router, isClient }) => {
    // No custom router setup needed; the hook is documented in
    // vite-react-ssg's API and kept for future use (e.g. scroll restoration).
    void router;
    void isClient;
  },
);
