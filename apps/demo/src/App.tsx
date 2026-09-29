import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  Spinner,
  DotsLoader,
  Skeleton,
  LoadingOverlay,
  StatCard,
  LineChart,
  BarChart,
} from "@srui/react";
import { StyleSwitcher } from "./StyleSwitcher";
import { Primitives, Section } from "./sections/Primitives";
import { SuperComponents } from "./sections/SuperComponents";

const revenue = [4200, 5100, 4800, 6100, 5900, 7200, 8100];
const signups = [120, 180, 150, 210, 260, 240, 310];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export function App() {
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight">srui</span>
            <span className="text-xs text-muted-foreground">
              Supercomponent React UI — demo
            </span>
          </div>
          <StyleSwitcher />
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10">
        <Section
          id="buttons"
          title="Button"
          description="Six variants × four sizes, plus the loading state."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Icon button">
              ⌘
            </Button>
            <Button
              loading={busy}
              onClick={() => {
                setBusy(true);
                setTimeout(() => setBusy(false), 1500);
              }}
            >
              Save changes
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section id="cards" title="Card" description="The basic surface.">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>
                  Deploy your new project in one-click.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input invalid placeholder="Invalid input" />
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Deploy</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  You have 3 unread messages.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <p>Push notifications are enabled for this device.</p>
                <div className="flex gap-2">
                  <Spinner className="text-muted-foreground" />
                  <DotsLoader className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          id="dialog"
          title="Dialog"
          description="Modal overlay with scale-in animation."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive">Delete account</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section
          id="loaders"
          title="Loaders"
          description="Spinner, DotsLoader, Skeleton and LoadingOverlay with delay + min-display."
        >
          <div className="flex flex-wrap items-center gap-6">
            <Spinner />
            <DotsLoader />
            <div className="flex w-64 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="relative grid min-h-40 min-w-64 place-items-center rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground">
                Some content that gets covered while loading.
              </p>
              <LoadingOverlay active={busy} label="Fetching data…" />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setBusy(true);
                  setTimeout(() => setBusy(false), 1800);
                }}
              >
                Trigger overlay
              </Button>
            </div>
          </div>
        </Section>

        <Section id="stat-cards" title="StatCard" description="KPI tiles with count-up animation and deltas.">
          <div className="grid gap-6 sm:grid-cols-3">
            <StatCard label="Monthly revenue" value={48219} formatValue={(v) => `$${v.toLocaleString()}`} delta={{ value: 12.4, direction: "up" }} />
            <StatCard label="Active users" value={3128} delta={{ value: 3.1, direction: "up" }} />
            <StatCard label="Churn rate" value={2} formatValue={(v) => `${v}%`} delta={{ value: 0.6, direction: "down" }} />
          </div>
        </Section>

        <Section
          id="charts"
          title="Charts"
          description="Hand-rolled SVG on d3-scale/d3-shape, with draw-in and grow-in animations."
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium">LineChart — revenue</h3>
              <LineChart
                labels={months}
                series={[
                  { name: "Revenue", values: revenue },
                  { name: "Signups", values: signups },
                ]}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">BarChart — signups by month</h3>
              <BarChart
                labels={months}
                series={[{ name: "Signups", values: signups }]}
              />
            </div>
          </div>
        </Section>

        <Primitives />
        <SuperComponents />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        srui demo — flip the preset switcher above; every component restyles at
        runtime, no reload.
      </footer>
    </div>
  );
}
