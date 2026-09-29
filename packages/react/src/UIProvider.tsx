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
  // Prefer whatever the no-flash script already applied to <html>, so the
  // first client render agrees with the pre-paint state.
  const [style, setStyleState] = useState<UIStyle>(() => {
    if (typeof document === "undefined") return defaultStyle;
    const attr = document.documentElement.dataset.style;
    return isUIStyle(attr) ? attr : defaultStyle;
  });
  const [scheme, setSchemeState] = useState<UIScheme>(() => {
    if (typeof window === "undefined") return defaultScheme;
    try {
      const stored = localStorage.getItem(SCHEME_STORAGE_KEY);
      if (isUIScheme(stored)) return stored;
    } catch {
      /* storage unavailable */
    }
    return defaultScheme;
  });
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

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
