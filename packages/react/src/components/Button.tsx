import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../lib/cn";
import { Spinner } from "./Loader";

const button = tv({
  base: "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-[color,background-color,border-color,box-shadow] duration-(--dur-base) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default:
        "bg-primary text-primary-foreground surface hover:shadow-(--surface-shadow-hover) active:shadow-(--surface-shadow-pressed)",
      secondary:
        "bg-secondary text-secondary-foreground surface hover:shadow-(--surface-shadow-hover) active:shadow-(--surface-shadow-pressed)",
      destructive:
        "bg-destructive text-destructive-foreground surface hover:shadow-(--surface-shadow-hover) active:shadow-(--surface-shadow-pressed)",
      outline:
        "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground active:shadow-(--surface-shadow-pressed)",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      sm: "h-8 gap-1.5 rounded-sm px-3 text-xs",
      md: "h-9 px-4",
      lg: "h-10 rounded-lg px-6 text-base",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  /** Shows a spinner and disables the button while true. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      data-loading={loading ? "" : undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(button({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner className="size-4" /> : null}
      {children}
    </button>
  ),
);
Button.displayName = "Button";

export { button as buttonStyles };
