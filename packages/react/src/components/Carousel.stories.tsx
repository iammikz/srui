import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent } from "./Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./Carousel";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
};
export default meta;

type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => (
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
  ),
};
