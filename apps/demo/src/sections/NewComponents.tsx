import { useState } from "react";
import {
  addDays,
  Alert,
  AspectRatio,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ColorPicker,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ConfirmDialog,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FileUpload,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Item,
  ItemContent,
  ItemDescription,
  ItemEnd,
  ItemMedia,
  ItemTitle,
  Kbd,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  NativeSelect,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TagInput,
  TimePicker,
  TimeRangePicker,
  Timeline,
  TimelineItem,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
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
  const [align, setAlign] = useState("center");
  const [day, setDay] = useState("mon");
  const [otp, setOtp] = useState("");

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

      <Section
        id="parity-primitives"
        title="shadcn-parity primitives"
        description="Table, Toggle/ToggleGroup, HoverCard, ContextMenu, Kbd, AspectRatio, ButtonGroup, NativeSelect, Empty, Item."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ada Lovelace</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>active</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Grace Hopper</TableCell>
                <TableCell>Editor</TableCell>
                <TableCell>active</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex flex-col gap-4">
            <ToggleGroup type="single" value={align} onValueChange={(v) => v && setAlign(v)} variant="outline">
              <ToggleGroupItem value="left" aria-label="Align left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">Right</ToggleGroupItem>
            </ToggleGroup>
            <div className="flex flex-wrap items-center gap-3">
              <Toggle defaultPressed aria-label="Toggle bold">
                Bold
              </Toggle>
              <ButtonGroup>
                <Button variant="outline" size="sm">Day</Button>
                <Button variant="outline" size="sm">Week</Button>
                <Button variant="outline" size="sm">Month</Button>
              </ButtonGroup>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Kbd>⌘</Kbd>+<Kbd>K</Kbd>
              </span>
            </div>
            <div className="w-56">
              <NativeSelect aria-label="Day" value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="mon">Monday</option>
                <option value="tue">Tuesday</option>
                <option value="wed">Wednesday</option>
              </NativeSelect>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">@adalovelace</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <p className="text-sm font-medium">Ada Lovelace</p>
                <p className="text-xs text-muted-foreground">First programmer</p>
              </HoverCardContent>
            </HoverCard>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                Right-click this area
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuLabel>Actions</ContextMenuLabel>
                <ContextMenuItem>
                  Copy <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuCheckboxItem checked>Wrap lines</ContextMenuCheckboxItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>Sort by</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem>Name</ContextMenuItem>
                    <ContextMenuItem>Size</ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>

          <div className="flex flex-wrap items-start gap-4">
            <div className="w-44 overflow-hidden rounded-lg border border-border">
              <AspectRatio ratio={16 / 9}>
                <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  16:9
                </div>
              </AspectRatio>
            </div>
            <div className="w-44">
              <Empty className="p-6">
                <EmptyMedia>🔍</EmptyMedia>
                <EmptyTitle>No results</EmptyTitle>
                <EmptyDescription>Try different keywords.</EmptyDescription>
                <EmptyContent>
                  <Button variant="outline" size="sm">Clear</Button>
                </EmptyContent>
              </Empty>
            </div>
            <div className="flex w-56 flex-col gap-3 rounded-lg border border-border p-3">
              <Item>
                <ItemMedia align="start">📄</ItemMedia>
                <ItemContent>
                  <ItemTitle>Q3 report.pdf</ItemTitle>
                  <ItemDescription>Updated 2 hours ago</ItemDescription>
                </ItemContent>
              </Item>
              <Item>
                <ItemMedia align="start">📊</ItemMedia>
                <ItemContent>
                  <ItemTitle>budget.xlsx</ItemTitle>
                  <ItemDescription>You edited this file</ItemDescription>
                </ItemContent>
                <ItemEnd>
                  <Toggle variant="outline" size="sm" aria-label="Star file">
                    Star
                  </Toggle>
                </ItemEnd>
              </Item>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="parity-p2"
        title="shadcn-parity — Field, Command, InputOTP, Carousel, Resizable, Menubar"
        description="The medium builds: context-wired fields, raw cmdk, OTP input, embla carousel, resizable panels, menu bar."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="w-full max-w-sm">
            <Field name="team-email">
              <FieldLabel>Team email</FieldLabel>
              <FieldControl>
                <Input placeholder="teammate@acme.com" />
              </FieldControl>
              <FieldDescription>They'll get an invite link.</FieldDescription>
            </Field>
            <div className="mt-4">
              <Field name="role-p2" invalid>
                <FieldLabel>Role</FieldLabel>
                <FieldControl>
                  <NativeSelect defaultValue="">
                    <option value="">Pick a role…</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                  </NativeSelect>
                </FieldControl>
                <FieldError>Pick a role to send the invite.</FieldError>
              </Field>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <Command>
              <CommandInput placeholder="Type a command or search…" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>Calendar</CommandItem>
                  <CommandItem>Profile</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          <div className="flex flex-col items-start gap-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp} aria-label="Verification code">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="w-full rounded-lg border border-border p-1">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarCheckboxItem checked>Auto-save</MenubarCheckboxItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>View</MenubarTrigger>
                  <MenubarContent>
                    <MenubarLabel>Zoom</MenubarLabel>
                    <MenubarRadioGroup value="100">
                      <MenubarRadioItem value="80">80%</MenubarRadioItem>
                      <MenubarRadioItem value="100">100%</MenubarRadioItem>
                    </MenubarRadioGroup>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="w-full max-w-xl">
              <Carousel>
                <CarouselContent>
                  {Array.from({ length: 6 }, (_, i) => (
                    <CarouselItem key={i} className="basis-1/3">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-4 text-xs text-muted-foreground">
                          Slide {i + 1}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="h-40 w-full max-w-xl">
              <ResizablePanelGroup orientation="horizontal" className="rounded-lg border border-border">
                <ResizablePanel defaultSize={30} className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  Sidebar
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70} className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  Main — drag the handle
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
