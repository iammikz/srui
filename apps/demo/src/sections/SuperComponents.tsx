import { useEffect, useMemo, useState } from "react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { z } from "zod";
import {
  AppShell,
  Badge,
  Button,
  Card,
  CardContent,
  ChartCard,
  CommandPalette,
  DataTable,
  DonutChart,
  FormBuilder,
  Input,
  NotificationCenter,
  Sparkline,
  Wizard,
} from "@iammikz/srui";
import { Section } from "./Primitives";

type Person = { id: number; name: string; email: string; role: string; status: string };

const people: Person[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com", role: "Admin", status: "active" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com", role: "Editor", status: "active" },
  { id: 3, name: "Alan Turing", email: "alan@example.com", role: "Viewer", status: "invited" },
  { id: 4, name: "Katherine Johnson", email: "kj@example.com", role: "Editor", status: "active" },
  { id: 5, name: "Margaret Hamilton", email: "mh@example.com", role: "Admin", status: "inactive" },
  { id: 6, name: "Linus Torvalds", email: "linus@example.com", role: "Viewer", status: "active" },
  { id: 7, name: "Barbara Liskov", email: "bl@example.com", role: "Editor", status: "active" },
  { id: 8, name: "Donald Knuth", email: "don@example.com", role: "Viewer", status: "invited" },
];

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "success" : "secondary"}
      >
        {row.original.status}
      </Badge>
    ),
  },
];

function makePeople(n: number): Person[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
    status: i % 5 === 0 ? "inactive" : "active",
  }));
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

// The "server" for the manual-pagination demo: one page per request.
const SERVER_PEOPLE = makePeople(257);
const rangeData: Record<string, number[]> = {
  "7d": [12, 18, 15, 21, 26, 24, 31],
  "30d": [42, 51, 48, 61, 59, 72, 81],
  "90d": [80, 74, 69, 77, 83, 91, 96],
};

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  role: z.string().min(1, "Pick a role."),
  bio: z.string().max(120, "Keep it under 120 characters.").optional(),
});

function AppShellDemo() {
  return (
    <div className="h-96 overflow-hidden rounded-xl border border-border">
      <AppShell
        classNames={{ root: "min-h-full" }}
        sidebar={
          <ul className="grid gap-1 text-sm">
            {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
              <li key={item}>
                <a
                  href="#app-shell"
                  className="block rounded-md px-3 py-2 text-sidebar-foreground transition-colors duration-(--dur-fast) hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        }
        topbar={<span className="text-sm font-medium">Acme Admin</span>}
        breadcrumbs={[
          { label: "Home", href: "#app-shell" },
          { label: "Projects", href: "#app-shell" },
          { label: "srui" },
        ]}
        slots={{ topbarEnd: <Badge variant="success">live</Badge> }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              Main content keeps a stable width when the sidebar swaps to a
              drawer below 768px — resize the window.
            </CardContent>
          </Card>
          <DonutChart label="Capacity" value={72} suffix="%" className="justify-self-center" />
        </div>
      </AppShell>
    </div>
  );
}

export function SuperComponents() {
  const [bigData, setBigData] = useState<Person[] | null>(null);
  const [chartRange, setChartRange] = useState("30d");
  const [chartLoading, setChartLoading] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "1", title: "Deploy finished", read: false, timestamp: new Date(Date.now() - 5 * 60000) },
    { id: "2", title: "New comment on #482", read: false, timestamp: new Date(Date.now() - 42 * 60000) },
    { id: "3", title: "Weekly report ready", read: true, timestamp: new Date(Date.now() - 26 * 3600000) },
  ]);
  const [serverPagination, setServerPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [serverPage, setServerPage] = useState<Person[]>(() => SERVER_PEOPLE.slice(0, 10));

  useEffect(() => {
    const timer = setTimeout(() => {
      const start = serverPagination.pageIndex * serverPagination.pageSize;
      setServerPage(SERVER_PEOPLE.slice(start, start + serverPagination.pageSize));
    }, 300);
    return () => clearTimeout(timer);
  }, [serverPagination]);

  const tableData = bigData ?? people;
  const tableColumns = useMemo(() => columns, []);

  return (
    <>
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        commands={[
          { label: "Go to Buttons", onSelect: () => document.getElementById("buttons")?.scrollIntoView({ behavior: "smooth" }), shortcut: "G B" },
          { label: "Go to Charts", onSelect: () => document.getElementById("charts")?.scrollIntoView({ behavior: "smooth" }), shortcut: "G C" },
          { label: "Toggle 10k rows", onSelect: () => setBigData((d) => (d ? null : makePeople(10000))) },
        ]}
      />

      <Section
        id="app-shell"
        title="AppShell"
        description="Fixed sidebar ≥768px, Dialog drawer below. Resize the window across the breakpoint."
      >
        <AppShellDemo />
      </Section>

      <Section
        id="data-table"
        title="DataTable"
        description="Sort, filter, paginate (client- or server-side), select, pin, export CSV — and 10,000-row virtualization."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <Button size="sm" variant={bigData ? "default" : "outline"} onClick={() => setBigData((d) => (d ? null : makePeople(10000)))}>
            {bigData ? "Back to 8 rows (paged)" : "Load 10,000 rows (virtualized)"}
          </Button>
        </div>
        {bigData ? (
          <DataTable columns={tableColumns} data={bigData} filterable pinColumns />
        ) : (
          <DataTable
            columns={tableColumns}
            data={tableData}
            selectable
            filterable
            pageSize={5}
            pinColumns
            onRowSelectionChange={(rows) => console.log("selected", rows.length)}
            slots={{ empty: "No people match your filters." }}
          />
        )}
        <div id="data-table-server" className="mt-6">
          <p className="mb-2 text-xs text-muted-foreground">
            Server-side: the “API” serves one page per request — 257 rows
            total, 10 per page, footer pages through the whole dataset.
          </p>
          <DataTable
            columns={tableColumns}
            data={serverPage}
            manualPagination
            rowCount={SERVER_PEOPLE.length}
            pagination={serverPagination}
            onPaginationChange={setServerPagination}
          />
        </div>
      </Section>

      <Section id="chart-card" title="ChartCard" description="Card + chart + time-range switcher; ranges re-trigger the draw-in.">
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Revenue"
            description="Switching ranges remounts the chart."
            chart="line"
            area
            labels={months}
            series={[{ name: "Revenue", values: rangeData[chartRange] }]}
            timeRanges={["7d", "30d", "90d"]}
            onTimeRangeChange={setChartRange}
            loading={chartLoading}
            slots={{
              headerAction: (
                <Button size="sm" variant="ghost" onClick={() => setChartLoading((v) => !v)}>
                  {chartLoading ? "Stop loading" : "Simulate loading"}
                </Button>
              ),
            }}
          />
          <div className="flex flex-wrap items-center justify-around gap-6">
            <DonutChart label="Storage used" value={68} suffix="%" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Weekly signups</div>
              <div className="text-xl font-semibold tabular-nums">1,284</div>
              <Sparkline values={rangeData["7d"]} />
            </div>
          </div>
        </div>
      </Section>

      <Section id="form-builder" title="FormBuilder" description="react-hook-form + Zod; submit empty to see field errors.">
        <div className="max-w-md">
          <FormBuilder
            schema={signupSchema}
            fields={[
              { name: "name", label: "Name", type: "text", placeholder: "Ada Lovelace" },
              { name: "email", label: "Email", type: "email", placeholder: "ada@example.com" },
              {
                name: "role",
                label: "Role",
                type: "select",
                options: [
                  { value: "admin", label: "Admin" },
                  { value: "editor", label: "Editor" },
                  { value: "viewer", label: "Viewer" },
                ],
              },
              { name: "bio", label: "Bio (optional)", type: "textarea", hint: "Up to 120 characters." },
            ]}
            submitLabel="Create account"
            onSubmit={async () => {
              await new Promise((r) => setTimeout(r, 900));
            }}
          />
        </div>
      </Section>

      <Section id="command-palette" title="CommandPalette" description="Opens on Cmd/Ctrl+K.">
        <Button variant="outline" onClick={() => setPaletteOpen(true)}>
          Open command palette (⌘K)
        </Button>
      </Section>

      <Section id="notifications" title="NotificationCenter">
        <NotificationCenter
          notifications={notifications}
          onMarkRead={(id) =>
            setNotifications((list) =>
              list.map((n) => (n.id === id ? { ...n, read: true } : n)),
            )
          }
        />
      </Section>

      <Section id="wizard" title="Wizard">
        <div className="max-w-xl">
          <Wizard
            steps={[
              { label: "Account", content: <Input placeholder="Workspace name" aria-label="Workspace name" /> },
              { label: "Team", content: <p className="text-sm text-muted-foreground">Invite teammates in the next step.</p> },
              { label: "Confirm", content: <p className="text-sm text-muted-foreground">Review and finish.</p> },
            ]}
            onComplete={() => console.log("wizard complete")}
          />
        </div>
      </Section>
    </>
  );
}
