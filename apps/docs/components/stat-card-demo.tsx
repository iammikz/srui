"use client";

import * as React from "react";
import { StatCard } from "@srui/react";

/**
 * Interactive StatCard demo. Lives in a client component because the
 * formatValue prop is a function, which server-rendered MDX cannot pass.
 */
export function StatCardDemo() {
  const [nonce, setNonce] = React.useState(0);
  return (
    <div className="not-prose my-6">
      <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-3">
        <StatCard
          key={`rev-${nonce}`}
          label="Monthly revenue"
          value={48219}
          formatValue={(v) => `$${v.toLocaleString()}`}
          delta={{ value: 12.4, direction: "up" }}
        />
        <StatCard key={`users-${nonce}`} label="Active users" value={3128} delta={{ value: 3.1, direction: "up" }} />
        <StatCard
          key={`churn-${nonce}`}
          label="Churn rate"
          value={2}
          formatValue={(v) => `${v}%`}
          delta={{ value: 0.6, direction: "down" }}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        The count-up re-runs whenever the value changes —{" "}
        <button
          type="button"
          className="underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={() => setNonce((n) => n + 1)}
        >
          replay
        </button>
        .
      </p>
    </div>
  );
}
