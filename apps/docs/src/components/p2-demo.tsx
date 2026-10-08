"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@iammikz/srui";

export function InputOTPDemo() {
  const [value, setValue] = React.useState("");
  return (
    <div className="flex flex-col gap-3">
      <InputOTP maxLength={6} value={value} onChange={setValue} aria-label="Verification code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <span className="text-xs text-muted-foreground">{value || "Type or paste a code"}</span>
    </div>
  );
}

export function CarouselDemo() {
  return (
    <div className="w-full max-w-xl">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 6 }, (_, i) => (
            <CarouselItem key={i} className="basis-1/3">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6 text-sm text-muted-foreground">
                  Slide {i + 1}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
