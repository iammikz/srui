"use client";

import * as React from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { Badge } from "./Badge";
import { Button } from "./Button";

export interface WizardStep {
  label: string;
  content: React.ReactNode;
}

export interface WizardProps {
  steps: WizardStep[];
  onComplete: () => void;
  /** Tier 2 — slots + per-part classNames. */
  slots?: {
    /** Extra content at the start of the footer (e.g. a Cancel link). */
    footerStart?: React.ReactNode;
  };
  classNames?: {
    root?: string;
    indicator?: string;
    content?: string;
    footer?: string;
  };
}

/**
 * Tier 3 headless hook — multi-step state with zero JSX: current index,
 * boundaries, and next/back/reset handlers. Wire to any step UI.
 */
export function useWizard(stepCount: number, onComplete?: () => void) {
  const [index, setIndex] = React.useState(0);
  const next = React.useCallback(() => {
    setIndex((i) => {
      if (i >= stepCount - 1) {
        onComplete?.();
        return i;
      }
      return i + 1;
    });
  }, [stepCount, onComplete]);
  const back = React.useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const reset = React.useCallback(() => setIndex(0), []);
  return {
    index,
    stepCount,
    isFirst: index === 0,
    isLast: index === stepCount - 1,
    next,
    back,
    reset,
  };
}

/**
 * Multi-step form shell: a step indicator (Badge step numbers, the current
 * one highlighted), the step's content, and Back/Next `Button`s. Next on
 * the last step becomes "Finish" and fires `onComplete`.
 */
export function Wizard({ steps, onComplete, slots, classNames }: WizardProps) {
  const { index, isFirst, isLast, next, back } = useWizard(steps.length, onComplete);
  const current = steps[index];

  return (
    <div
      className={cn("surface flex flex-col gap-6 rounded-xl bg-card p-6", classNames?.root)}
      data-step={index + 1}
    >
      <ol
        aria-label="Steps"
        className={cn("flex flex-wrap items-center gap-2", classNames?.indicator)}
      >
        {steps.map((s, i) => {
          const state = i < index ? "done" : i === index ? "current" : "todo";
          return (
            <li key={s.label} className="flex items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
                  state === "current" && "bg-primary text-primary-foreground",
                  state === "done" && "bg-muted text-muted-foreground",
                  state === "todo" && "text-muted-foreground",
                )}
              >
                <Badge variant={state === "current" ? "default" : "secondary"}>
                  {state === "done" ? <Check className="size-3" aria-hidden="true" /> : i + 1}
                </Badge>
                {s.label}
              </span>
              {i < steps.length - 1 ? (
                <span aria-hidden="true" className="h-px w-6 bg-border" />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className={cn("min-h-28 motion-safe:animate-fade-in", classNames?.content)} key={index}>
        {current.content}
      </div>

      <div className={cn("flex items-center gap-2", classNames?.footer)}>
        {slots?.footerStart}
        <Button
          variant="ghost"
          onClick={back}
          disabled={isFirst}
          className={isFirst ? "invisible" : undefined}
        >
          <ChevronLeft aria-hidden="true" /> Back
        </Button>
        <Button onClick={next} className="ml-auto">
          {isLast ? "Finish" : "Next"} {!isLast && <ChevronRight aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
}
