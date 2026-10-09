import type { Meta, StoryObj } from "@storybook/react";
import { Calendar, Layers, Settings } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./NavigationMenu";
import { cn } from "../lib/cn";

const meta: Meta<typeof NavigationMenu> = {
  title: "Components/NavigationMenu",
  component: NavigationMenu,
};
export default meta;

type Story = StoryObj<typeof NavigationMenu>;

const ListItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <li>
    <NavigationMenuLink
      className={cn("flex flex-col items-start gap-1 rounded-md p-3")}
      href="#"
    >
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs text-muted-foreground">{children}</span>
    </NavigationMenuLink>
  </li>
);

export const Default: Story = {
  render: () => (
    <div className="relative w-full max-w-xl">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Layers className="size-4" /> Components
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[26rem] gap-1 p-2 sm:w-[32rem] sm:grid-cols-2">
                <ListItem title="Data Table">
                  Sort, filter, paginate — client or server side.
                </ListItem>
                <ListItem title="Charts">
                  Animated SVG charts with hover tooltips.
                </ListItem>
                <ListItem title="Form Builder">
                  Zod-driven forms with headless hooks.
                </ListItem>
                <ListItem title="Command Palette">
                  ⌘K palette on cmdk.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="gap-1.5">
              <Calendar className="size-4" /> Changelog
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Settings className="size-4" /> Settings
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-64 gap-1 p-2">
                <ListItem title="Preferences">Theme, presets, density.</ListItem>
                <ListItem title="Team">Members and roles.</ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator />
        <NavigationMenuViewport />
      </NavigationMenu>
    </div>
  ),
};
