"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./Button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselContextValue {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used inside a <Carousel>.");
  return ctx;
}

/** Scroll-snap carousel over embla — content, items, prev/next controls. */
export function Carousel({
  orientation = "horizontal",
  opts,
  plugins,
  setApi,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  orientation?: "horizontal" | "vertical";
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  setApi?: (api: CarouselApi) => void;
  children: React.ReactNode;
}) {
  const [emblaRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((embla: NonNullable<CarouselApi>) => {
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, []);

  const { scrollPrev, scrollNext } = React.useMemo(
    () => ({
      scrollPrev: () => api?.scrollPrev(),
      scrollNext: () => api?.scrollNext(),
    }),
    [api],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{ emblaRef, api, scrollPrev, scrollNext, canScrollPrev, canScrollNext, orientation }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        data-orientation={orientation}
        className={cn("relative w-full", className)}
        onKeyDownCapture={(e) => {
          // Arrow keys scroll when the carousel itself holds focus.
          if (document.activeElement === e.currentTarget) {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollPrev();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              scrollNext();
            }
          }
        }}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { emblaRef, orientation } = useCarousel();
  return (
    <div ref={emblaRef} className="overflow-hidden" data-slot="carousel-content">
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

export function CarouselPrevious({
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button> & { variant?: "outline" | "ghost" }) {
  const { scrollPrev, canScrollPrev, orientation } = useCarousel();
  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size="icon"
      className={cn(
        "absolute rounded-full",
        orientation === "horizontal"
          ? "top-1/2 left-2 -translate-y-1/2"
          : "top-2 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ArrowLeft className="size-4" />
    </Button>
  );
}

export function CarouselNext({
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button> & { variant?: "outline" | "ghost" }) {
  const { scrollNext, canScrollNext, orientation } = useCarousel();
  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size="icon"
      className={cn(
        "absolute rounded-full",
        orientation === "horizontal"
          ? "top-1/2 right-2 -translate-y-1/2"
          : "bottom-2 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ArrowRight className="size-4" />
    </Button>
  );
}
