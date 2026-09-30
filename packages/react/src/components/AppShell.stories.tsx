import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "./AppShell";
import { Badge } from "./Badge";
import { Card, CardContent } from "./Card";

const meta: Meta<typeof AppShell> = {
  title: "Super-components/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AppShell>;

const sidebar = (
  <ul className="grid gap-1 text-sm">
    {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
      <li key={item}>
        <a
          href="#"
          className="block rounded-md px-3 py-2 transition-colors duration-(--dur-fast) hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {item}
        </a>
      </li>
    ))}
  </ul>
);

export const DesktopShell: Story = {
  parameters: { viewport: { defaultViewport: "desktop" } },
  render: () => (
    <AppShell
      sidebar={sidebar}
      topbar={<span className="text-sm font-medium">Acme Admin</span>}
      breadcrumbs={[{ label: "Home" }, { label: "Projects" }, { label: "srui" }]}
      slots={{ topbarEnd: <Badge variant="success">live</Badge> }}
    >
      <Card className="max-w-md">
        <CardContent className="text-sm text-muted-foreground">
          Resize the viewport across 768px: the sidebar docks or becomes a
          Dialog drawer.
        </CardContent>
      </Card>
    </AppShell>
  ),
};
