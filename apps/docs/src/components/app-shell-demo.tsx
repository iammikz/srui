"use client";
import { AppShell, Badge, Card, CardContent } from "@iammikz/srui";
import { NavigationMenuSidebarDemo } from "./navigation-menu-demo";

/** Bounded AppShell demo for the docs page (the real one is full-viewport). */
export function AppShellDemo() {
  return (
    <div className="my-6 h-80 overflow-hidden rounded-xl border border-border">
      <AppShell
        classNames={{ root: "min-h-full" }}
        sidebar={<NavigationMenuSidebarDemo />}
        topbar={<span className="text-sm font-medium">Acme Admin</span>}
        breadcrumbs={[{ label: "Home", href: "#app-shell" }, { label: "srui" }]}
        slots={{ topbarEnd: <Badge variant="success">live</Badge> }}
      >
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            Expand Projects → Workspace to explore three navigation levels.
            Below 768px the same navigation appears in the drawer.
          </CardContent>
        </Card>
      </AppShell>
    </div>
  );
}
