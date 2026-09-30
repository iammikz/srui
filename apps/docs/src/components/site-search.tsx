"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Popover, PopoverAnchor, PopoverContent } from "@iammikz/srui";

interface PagefindResult {
  results: {
    data: () => Promise<{ url: string; excerpt: string; meta: { title?: string } }>;
  }[];
}
interface Pagefind {
  search: (q: string) => Promise<PagefindResult>;
  options?: (o: Record<string, unknown>) => void;
}

interface Hit {
  url: string;
  title: string;
  excerpt: string;
}

/**
 * Full-text search over the static build (tech-stack plan §5: the deferred
 * search item, implemented with Pagefind — a client-side index built at
 * build time, no server). Chrome is srui components (Input + Popover +
 * Button). In `vite dev` there is no index yet, so the box explains that
 * instead of failing.
 */
export function SiteSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [hits, setHits] = React.useState<Hit[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [unavailable, setUnavailable] = React.useState(false);
  const pagefindRef = React.useRef<Pagefind | null>(null);
  const navigate = useNavigate();

  // The specifier is a variable so Rollup cannot resolve it at build time —
  // it must load from the deployed site at runtime.
  const load = React.useCallback(async (): Promise<Pagefind | null> => {
    if (pagefindRef.current) return pagefindRef.current;
    try {
      const url = "/pagefind/pagefind.js";
      const mod = (await import(/* @vite-ignore */ url)) as unknown as Pagefind;
      mod.options?.({ excerptLength: 18 });
      pagefindRef.current = mod;
      return mod;
    } catch {
      setUnavailable(true);
      return null;
    }
  }, []);

  // Search whenever the query changes — deps are [query] only; all other
  // flow state lives in refs/state set imperatively so the effect can't
  // re-trigger itself.
  React.useEffect(() => {
    if (query.trim().length < 2) {
      setHits([]);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = window.setTimeout(async () => {
      const pf = await load();
      if (!pf || cancelled) return;
      try {
        const res = await pf.search(query.trim());
        const data = await Promise.all(res.results.slice(0, 8).map((r) => r.data()));
        if (!cancelled) {
          setHits(
            data.map((d) => ({
              url: d.url,
              title: d.meta?.title ?? d.url,
              excerpt: d.excerpt.replace(/<[^>]+>/g, ""),
            })),
          );
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 220);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [query, load]);

  const go = (url: string) => {
    setOpen(false);
    setQuery("");
    // Pagefind URLs are relative to the site root and lack the trailing
    // slash the preview needs for nested pages.
    const path = url.startsWith("/") ? url : `/${url}`;
    navigate(path.endsWith("/") || path === "/" ? path : `${path}/`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor>
        <Input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && hits[0]) go(hits[0].url);
          }}
          placeholder="Search docs…"
          aria-label="Search docs"
          className="w-36 sm:w-52"
        />
      </PopoverAnchor>
      <PopoverContent align="end" className="w-80 p-2">
        {unavailable ? (
          <p className="p-3 text-center text-sm text-muted-foreground">
            Search runs on the built site — use <code>pnpm build:docs</code> and
            <code> pnpm --filter docs preview</code>.
          </p>
        ) : query.trim().length < 2 ? (
          <p className="p-3 text-center text-sm text-muted-foreground">
            Type at least two characters.
          </p>
        ) : searching && hits.length === 0 ? (
          <p className="p-3 text-center text-sm text-muted-foreground">Searching…</p>
        ) : hits.length === 0 ? (
          <p className="p-3 text-center text-sm text-muted-foreground">No matches.</p>
        ) : (
          <ul className="grid max-h-80 gap-1 overflow-y-auto">
            {hits.map((h) => (
              <li key={h.url}>
                <Button
                  variant="ghost"
                  className="h-auto w-full flex-col items-start gap-0.5 px-3 py-2 text-left"
                  onClick={() => go(h.url)}
                >
                  <span className="text-sm font-medium">{h.title}</span>
                  <span className="line-clamp-2 text-xs font-normal text-muted-foreground">
                    {h.excerpt}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
