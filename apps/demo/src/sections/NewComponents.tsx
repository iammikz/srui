import { useState } from "react";
import {
  addDays,
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Calendar,
  ColorPicker,
  ConfirmDialog,
  DatePicker,
  DateRangePicker,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  FileUpload,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  ScrollArea,
  Slider,
  TagInput,
  TimePicker,
  TimeRangePicker,
  Timeline,
  TimelineItem,
  TreeView,
  todayKey,
  usePaginationRange,
  type DateRange,
  type TimeRange,
  type TreeItemData,
} from "@iammikz/srui";
import { Section } from "./Primitives";

const TREE: TreeItemData[] = [
  {
    id: "src",
    label: "src",
    defaultExpanded: true,
    children: [
      { id: "components", label: "components", children: [{ id: "button", label: "Button.tsx" }] },
      { id: "lib", label: "lib", children: [{ id: "date", label: "date.ts" }] },
    ],
  },
  { id: "package", label: "package.json" },
];

export function NewComponents() {
  const [date, setDate] = useState("");
  const [range, setRange] = useState<DateRange>({});
  const [time, setTime] = useState("09:30");
  const [shift, setShift] = useState<TimeRange>({});
  const [tags, setTags] = useState(["react", "typescript"]);
  const [files, setFiles] = useState<File[]>([]);
  const [treeSel, setTreeSel] = useState("button");
  const [page, setPage] = useState(5);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pageRange = usePaginationRange(page, 12);
  const [opacity, setOpacity] = useState([60]);
  const [brand, setBrand] = useState("#2563EB");

  return (
    <>
      <Section
        id="date-time-pickers"
        title="Date & time pickers"
        description="Calendar engine + anchored pickers over string wire formats."
      >
        <div className="flex flex-wrap items-start gap-4">
          <Calendar aria-label="Demo calendar" />
          <div className="flex w-56 flex-col gap-3">
            <DatePicker value={date} onChange={setDate} ariaLabel="Due date" />
            <DateRangePicker
              value={range}
              onChange={setRange}
              maxRange="3m"
              ariaLabel="Report window"
            />
            <TimePicker value={time} onChange={setTime} ariaLabel="Meeting time" />
            <TimeRangePicker value={shift} onChange={setShift} ariaLabel="Shift window" />
          </div>
        </div>
      </Section>

      <Section
        id="new-primitives"
        title="Primitives — feedback & data"
        description="Alert, Progress, Timeline, Breadcrumb, TagInput, TreeView, ScrollArea, FileUpload."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Alert variant="success" title="Deployed">
            Build 128 is live on all regions.
          </Alert>
          <Alert variant="warning" title="Approaching limit">
            85% of the monthly build minutes are used.
          </Alert>
          <div className="flex flex-col gap-3">
            <Progress value={62} label="Uploading build" showValue />
            <Progress label="Syncing" showValue />
          </div>
          <Timeline>
            <TimelineItem title="Deployed" time="12:04" description="Build 128 is live." variant="success" />
            <TimelineItem title="Rollback" time="09:30" description="Error spike." variant="destructive" />
          </Timeline>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#new-primitives">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TagInput value={tags} onChange={setTags} placeholder="Add tag…" />
          <TreeView items={TREE} selectedId={treeSel} onSelect={setTreeSel} aria-label="Project files" />
          <ScrollArea className="h-40 rounded-md border border-border p-3">
            <div className="text-sm">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className="py-1">
                  Row {i + 1} of 16
                </div>
              ))}
            </div>
          </ScrollArea>
          <FileUpload
            value={files}
            onChange={setFiles}
            accept=".pdf,image/*"
            maxSizeBytes={2 * 1024 * 1024}
            prompt="Drop report files"
          />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-muted-foreground">Opacity</span>
              <Slider
                value={opacity}
                onValueChange={setOpacity}
                aria-label="Overlay opacity"
                className="flex-1"
              />
              <span className="w-8 text-right text-xs text-muted-foreground">{opacity[0]}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-muted-foreground">Brand</span>
              <ColorPicker value={brand} onChange={setBrand} ariaLabel="Brand color" className="flex-1" />
            </div>
            <div
              className="h-10 rounded-md border border-border"
              style={{ backgroundColor: brand, opacity: opacity[0] / 100 }}
            />
          </div>
        </div>
      </Section>

      <Section
        id="menus-overlays"
        title="Menus & overlays"
        description="DropdownMenu, Drawer, ConfirmDialog — Sheet and Modal share the Dialog treatment."
      >
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Build 128</DropdownMenuLabel>
              <DropdownMenuItem>
                Redeploy <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>View logs</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Roll back</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Report window</DrawerTitle>
                <DrawerDescription>
                  {range.from ? `${range.from} → ${range.to ?? "…"}` : "Pick a range above first."}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Done</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete account…
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete this account?"
            description="This permanently removes the account and all of its data. This action cannot be undone."
            confirmLabel="Delete"
            tone="destructive"
            onConfirm={() => setConfirmOpen(false)}
          />
          <span className="text-xs text-muted-foreground">
            bounded demo: {todayKey()} + 30d = {addDays(todayKey(), 30)}
          </span>
        </div>
        <div className="mt-6">
          <Pagination className="justify-start">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              {pageRange.map((item) => (
                <PaginationItem key={item}>
                  {item === "ellipsis-start" || item === "ellipsis-end" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink isActive={item === page} onClick={() => setPage(item)}>
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(12, p + 1))}
                  disabled={page === 12}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Section>
    </>
  );
}
