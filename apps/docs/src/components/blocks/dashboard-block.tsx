"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import {
  AppShell,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartCard,
  DataTable,
  DonutChart,
  FormBuilder,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@srui/react";

/** Phase 8 "Dashboard" block: AppShell + StatCard + ChartCard + DataTable. */
type Person = { id: number; name: string; email: string; role: string; status: string };

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "success" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export function DashboardBlock() {
  const [range, setRange] = React.useState("30d");
  const data: Record<string, number[]> = {
    "7d": [12, 18, 15, 21, 26, 24, 31],
    "30d": [42, 51, 48, 61, 59, 72, 81],
    "90d": [80, 74, 69, 77, 83, 91, 96],
  };

  return (
    <div className="my-6 h-[30rem] overflow-hidden rounded-xl border border-border">
      <AppShell
        classNames={{ root: "min-h-full" }}
        sidebar={
          <ul className="grid gap-1 text-sm">
            {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
              <li key={item}>
                <a
                  href="#blocks/dashboard"
                  className="block rounded-md px-3 py-2 transition-colors duration-(--dur-fast) hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        }
        topbar={<span className="text-sm font-medium">Acme Analytics</span>}
        slots={{ topbarEnd: <Badge variant="success">live</Badge> }}
      >
        <div className="grid gap-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <StatCard
              label="Monthly revenue"
              value={48219}
              formatValue={(v) => `$${v.toLocaleString()}`}
              delta={{ value: 12.4, direction: "up" }}
            />
            <StatCard label="Active users" value={3128} delta={{ value: 3.1, direction: "up" }} />
            <StatCard
              label="Error rate"
              value={1}
              formatValue={(v) => `${v}%`}
              delta={{ value: 0.4, direction: "down" }}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <ChartCard
              title="Revenue"
              description="Range switches replay the draw-in."
              chart="line"
              area
              labels={months}
              series={[{ name: "Revenue", values: data[range] }]}
              timeRanges={["7d", "30d", "90d"]}
              onTimeRangeChange={setRange}
            />
            <Card className="justify-center">
              <CardContent className="flex flex-col items-center gap-2">
                <DonutChart label="Capacity" value={72} suffix="%" />
              </CardContent>
            </Card>
          </div>
          <DataTable
            columns={columns}
            filterable
            pinColumns
            pageSize={5}
            data={Array.from({ length: 14 }, (_, i) => ({
              id: i + 1,
              name: `Person ${i + 1}`,
              email: `person${i + 1}@example.com`,
              role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
              status: i % 5 === 0 ? "inactive" : "active",
            }))}
          />
        </div>
      </AppShell>
    </div>
  );
}

/** Phase 8 "Auth" block: a sign-in FormBuilder in a Card. */
export function AuthBlock() {
  return (
    <Card className="my-6 w-full max-w-md justify-self-center">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormBuilder
          schema={z.object({
            email: z.string().email("Enter a valid email."),
            password: z.string().min(8, "At least 8 characters."),
          })}
          fields={[
            { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { name: "password", label: "Password", type: "password" },
          ]}
          submitLabel="Sign in"
          onSubmit={async () => {
            await new Promise((r) => setTimeout(r, 900));
          }}
          slots={{
            footer: <Button variant="link" size="sm">Forgot password?</Button>,
          }}
        />
      </CardContent>
    </Card>
  );
}

/** Phase 8 "Settings" block: Tabs + FormBuilder per section. */
export function SettingsBlock() {
  return (
    <Card className="my-6 w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Workspace settings</CardTitle>
        <CardDescription>Changes save per section.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <FormBuilder
              schema={z.object({
                name: z.string().min(2, "Name must be at least 2 characters."),
                email: z.string().email("Enter a valid email."),
              })}
              fields={[
                { name: "name", label: "Workspace name", type: "text" },
                { name: "email", label: "Contact email", type: "email" },
              ]}
              submitLabel="Save profile"
              onSubmit={async () => {}}
            />
          </TabsContent>
          <TabsContent value="notifications">
            <p className="text-sm text-muted-foreground">
              Notification preferences compose the same FormBuilder inside the
              second tab — swap the field list for switches.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
