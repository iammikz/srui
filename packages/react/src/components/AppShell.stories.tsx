import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "./AppShell";
import { NavigationMenu } from "./NavigationMenu";
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
  <NavigationMenu
    variant="sidebar"
    activeHref="#overview"
    items={[
      { id: "dashboard", label: "Dashboard", href: "#dashboard" },
      {
        id: "projects",
        label: "Projects",
        children: [
          {
            id: "srui",
            label: "srui",
            children: [
              { id: "overview", label: "Overview", href: "#overview" },
              { id: "team", label: "Team", href: "#team" },
            ],
          },
        ],
      },
      { id: "settings", label: "Settings", href: "#settings" },
    ]}
  />
);

export const DesktopShell: Story = {
  parameters: { viewport: { defaultViewport: "desktop" } },
  render: () => (
    <AppShell
      sidebar={sidebar}
      topbar={<span className="text-sm font-medium">Acme Admin</span>}
      breadcrumbs={[
        { label: "Home" },
        { label: "Projects" },
        { label: "srui" },
      ]}
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
