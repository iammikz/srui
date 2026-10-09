import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "lead"
  | "large"
  | "small"
  | "muted"
  | "blockquote"
  | "ul"
  | "code"
  | "inlineCode";

const VARIANTS: Record<TypographyVariant, [React.ElementType, string]> = {
  h1: ["h1", "scroll-m-20 text-4xl font-extrabold tracking-tight text-foreground"],
  h2: ["h2", "scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight text-foreground first:mt-0"],
  h3: ["h3", "text-2xl font-semibold tracking-tight text-foreground"],
  h4: ["h4", "text-xl font-semibold tracking-tight text-foreground"],
  p: ["p", "leading-7 text-foreground [&:not(:first-child)]:mt-4"],
  lead: ["p", "text-xl text-muted-foreground"],
  large: ["div", "text-lg font-semibold text-foreground"],
  small: ["small", "text-sm font-medium leading-none text-foreground"],
  muted: ["p", "text-sm text-muted-foreground"],
  blockquote: ["blockquote", "mt-4 border-l-2 border-border pl-6 italic text-foreground"],
  ul: ["ul", "my-4 ml-6 list-disc text-foreground [&>li]:mt-1"],
  code: ["pre", "overflow-x-auto rounded-lg bg-foreground/5 p-4 font-mono text-sm text-foreground"],
  inlineCode: ["code", "relative rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm font-semibold text-foreground"],
};

export interface TypographyProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Text style — maps to a semantic element (see the docs table). */
  variant?: TypographyVariant;
  /** Render the child element instead of the variant's default element. */
  asChild?: boolean;
  children?: React.ReactNode;
}

/** Styled semantic text (shadcn Typography parity) on the design tokens. */
export function Typography({
  variant = "p",
  asChild = false,
  className,
  ...props
}: TypographyProps) {
  const [Comp, variantClass] = VARIANTS[variant];
  const Tag = asChild ? Slot : Comp;
  return (
    <Tag
      data-slot="typography"
      data-variant={variant}
      className={cn(variantClass, className)}
      {...props}
    />
  );
}
