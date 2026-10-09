"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";
import { cn } from "../lib/cn";

/** One-time-code input: groups of slots, paste- and keyboard-driven. */
const InputOTP = React.forwardRef<
  React.ComponentRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, ...props }, ref) => (
  <OTPInput
    ref={ref}
    data-slot="input-otp"
    // The library renders the input as a transparent full-size overlay over
    // the container — extra input styling (e.g. sr-only) breaks hit-testing.
    containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & { index: number }) {
  const inputContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputContext?.slots?.[index] ?? {};
  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive || undefined}
      className={cn(
        "surface relative flex size-9 items-center justify-center rounded-md border border-border bg-input/30 text-sm outline-none transition-all duration-(--dur-fast) ease-(--ease-out)",
        isActive && "outline-2 outline-offset-2 outline-ring z-10",
        char && "border-transparent bg-accent/50",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground motion-reduce:hidden" />
        </div>
      ) : null}
    </div>
  );
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      aria-orientation="vertical"
      className={cn("flex items-center justify-center text-muted-foreground", className)}
      {...props}
    >
      <Minus className="size-4" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
