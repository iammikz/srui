import type { Meta, StoryObj } from "@storybook/react";
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "./Drawer";
import { Button } from "./Button";

const meta: Meta<typeof DrawerContent> = {
  title: "Components/Drawer",
  component: DrawerContent,
};
export default meta;

type Story = StoryObj<typeof DrawerContent>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Review order</DrawerTitle>
          <DrawerDescription>Swipe down or press Escape to dismiss.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Keep shopping</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button>Checkout</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
