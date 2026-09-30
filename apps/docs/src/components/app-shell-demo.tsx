"use client";
import { AppShell, Badge, Card, CardContent } from "@iammikz/srui";

/** Bounded AppShell demo for the docs page (the real one is full-viewport). */
export function AppShellDemo() {
  return (
    <div className="my-6 h-80 overflow-hidden rounded-xl border border-border">
      <AppShell
        classNames={{ root: "min-h-full" }}
        sidebar={
          <ul className="grid gap-1 text-sm">
            {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
              <li key={item}>
                <a
                  href="#app-shell"
                  className="block rounded-md px-3 py-2 transition-colors duration-(--dur-fast) hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        }
        topbar={<span className="text-sm font-medium">Acme Admin</span>}
        breadcrumbs={[{ label: "Home", href: "#app-shell" }, { label: "srui" }]}
        slots={{ topbarEnd: <Badge variant="success">live</Badge> }}
      >
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            Resize the browser across 768px: the sidebar swaps to a drawer and
            this area keeps its width — no layout shift.
          </CardContent>
        </Card>
      </AppShell>
    </div>
  );
}
