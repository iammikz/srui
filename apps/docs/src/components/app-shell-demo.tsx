"use client";
import * as React from "react";
import { AppShell, Badge, Card, CardContent, Switch } from "@iammikz/srui";
import { NavigationMenuSidebarDemo } from "./navigation-menu-demo";

/** Bounded AppShell demo for the docs page (the real one is full-viewport). */
export function AppShellDemo() {
  const [sidebarCollapsible, setSidebarCollapsible] = React.useState(true);
  const [closeOnSelect, setCloseOnSelect] = React.useState(true);
  return (
    <section aria-label="AppShell example" className="my-6">
      <div className="mb-3 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <Switch checked={sidebarCollapsible} onCheckedChange={setSidebarCollapsible} />
          Collapsible desktop sidebar
        </label>
        <label className="flex items-center gap-2">
          <Switch checked={closeOnSelect} onCheckedChange={setCloseOnSelect} />
          Close on selection
        </label>
      </div>
      <div className="h-80 overflow-hidden rounded-xl border border-border">
        <AppShell
          sidebarCollapsible={sidebarCollapsible}
          closeOnSelect={closeOnSelect}
          classNames={{ root: "min-h-full" }}
          sidebar={<NavigationMenuSidebarDemo />}
          topbar={<span className="text-sm font-medium">Acme Admin</span>}
          breadcrumbs={[{ label: "Home", href: "#app-shell" }, { label: "srui" }]}
          slots={{ topbarEnd: <Badge variant="success">live</Badge> }}
        >
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              Expand Projects → Workspace to explore three navigation levels.
              Use the hamburger to hide or show the sidebar. Selecting a link
              closes it when Close on selection is enabled. Below 768px the same
              navigation appears in the drawer.
            </CardContent>
          </Card>
        </AppShell>
      </div>
    </section>
  );
}
