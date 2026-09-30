"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UIStyle = "flat" | "glass" | "neumorphic" | "skeuomorphic";
export type UIScheme = "light" | "dark" | "system";

export const UI_STYLES: readonly UIStyle[] = [
  "flat",
  "glass",
  "neumorphic",
  "skeuomorphic",
] as const;

/** localStorage keys — part of the public contract (see the docs' Installation page). */
export const STYLE_STORAGE_KEY = "srui-style";
export const SCHEME_STORAGE_KEY = "srui-scheme";

function isUIStyle(v: unknown): v is UIStyle {
  return typeof v === "string" && (UI_STYLES as readonly string[]).includes(v);
}

function isUIScheme(v: unknown): v is UIScheme {
  return v === "light" || v === "dark" || v === "system";
}

/**
 * Inline script that applies the persisted style/scheme before first paint.
 * Render its return value into a <script> tag in the host app's <head>
 * (e.g. via next/script beforeInteractive, or a plain <script> element with
 * dangerouslySetInnerHTML) to avoid a flash of the wrong theme.
 */
export function noFlashScript(): string {
  return `(function(){try{var s=localStorage.getItem('${STYLE_STORAGE_KEY}');var c=localStorage.getItem('${SCHEME_STORAGE_KEY}');var sv=(s==='glass'||s==='neumorphic'||s==='skeuomorphic'||s==='flat')?s:'flat';var cv=(c==='light'||c==='dark'||c==='system')?c:'system';var dark=cv==='dark'||(cv==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.setAttribute('data-style',sv);e.classList.toggle('dark',dark);e.style.colorScheme=dark?'dark':'light';}catch(err){}})();`;
}

export interface UIContextValue {
  style: UIStyle;
  setStyle: (style: UIStyle) => void;
  scheme: UIScheme;
  setScheme: (scheme: UIScheme) => void;
  /** The scheme after resolving "system" against the OS preference. */
  resolvedScheme: "light" | "dark";
}

const UIContext = createContext<UIContextValue | null>(null);

export interface UIProviderProps {
  children: ReactNode;
  defaultStyle?: UIStyle;
  defaultScheme?: UIScheme;
}

export function UIProvider({
  children,
  defaultStyle = "flat",
  defaultScheme = "system",
}: UIProviderProps) {
  // First render ALWAYS uses the defaults so server-rendered (SSG/SSR)
  // markup and the first client render match — persisted choices and the
  // no-flash script's pre-paint state are synced in the mount effect
  // below (localStorage reads are deliberately deferred, never in the
  // useState initializers, or hydration mismatches).
  const [style, setStyleState] = useState<UIStyle>(defaultStyle);
  const [scheme, setSchemeState] = useState<UIScheme>(defaultScheme);
  const [systemDark, setSystemDark] = useState(false);

  // After mount, adopt whatever the no-flash script applied pre-paint
  // (dataset.style, from the same persisted keys) and the persisted scheme
  // — keeping the settled state aligned with the user's choice without
  // leaking it into the first render.
  useEffect(() => {
    const attr = document.documentElement.dataset.style;
    if (isUIStyle(attr) && attr !== style) setStyleState(attr);
    try {
      const stored = localStorage.getItem(SCHEME_STORAGE_KEY);
      if (isUIScheme(stored) && stored !== scheme) setSchemeState(stored);
    } catch {
      /* storage unavailable */
    }
    setSystemDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setStyle = useCallback((next: UIStyle) => {
    setStyleState(next);
    try {
      localStorage.setItem(STYLE_STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode etc.) — keep in-memory only */
    }
  }, []);

  const setScheme = useCallback((next: UIScheme) => {
    setSchemeState(next);
    try {
      localStorage.setItem(SCHEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const resolvedScheme: "light" | "dark" =
    scheme === "system" ? (systemDark ? "dark" : "light") : scheme;

  useEffect(() => {
    document.documentElement.dataset.style = style;
  }, [style]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedScheme === "dark");
    root.style.colorScheme = resolvedScheme;
  }, [resolvedScheme]);

  const value = useMemo<UIContextValue>(
    () => ({ style, setStyle, scheme, setScheme, resolvedScheme }),
    [style, setStyle, scheme, setScheme, resolvedScheme],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUIStyle(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUIStyle must be used inside a <UIProvider>.");
  }
  return ctx;
}
