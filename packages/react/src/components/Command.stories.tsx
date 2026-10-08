import type { Meta, StoryObj } from "@storybook/react";
import { Calendar, Search, Settings, User } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./Command";

const meta: Meta<typeof Command> = {
  title: "Components/Command",
  component: Command,
};
export default meta;

type Story = StoryObj<typeof Command>;

export const Grouped: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              Calendar <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <User />
              Profile
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <Settings />
              Settings
            </CommandItem>
            <CommandItem disabled>
              <Search />
              Search logs
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};
