/**
 * @iammikz/srui — public API surface. Every export goes through here; Radix
 * and other underlying primitives are wrapped, never re-exported directly
 * (standing decision: keep the underlying library swappable).
 */

// provider + styling context
export {
  UIProvider,
  useUIStyle,
  noFlashScript,
  UI_STYLES,
  STYLE_STORAGE_KEY,
  SCHEME_STORAGE_KEY,
} from "./UIProvider";
export type { UIStyle, UIScheme, UIProviderProps, UIContextValue } from "./UIProvider";

// utilities
export { cn } from "./lib/cn";
export * from "./lib/date";

// Phase 0 components
export { Button, buttonStyles } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./components/Card";
export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./components/Dialog";
export {
  Spinner,
  DotsLoader,
  Skeleton,
  LoadingOverlay,
} from "./components/Loader";
export type { LoadingOverlayProps } from "./components/Loader";
export { StatCard } from "./components/StatCard";
export type { StatCardProps } from "./components/StatCard";
export { LineChart } from "./components/chart/LineChart";
export type { LineChartProps, LineChartSeries } from "./components/chart/LineChart";
export { BarChart } from "./components/chart/BarChart";
export type { BarChartProps, BarChartSeries } from "./components/chart/BarChart";

// Phase 3 components
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/Select";
export { Combobox } from "./components/Combobox";
export type { ComboboxProps, ComboboxOption } from "./components/Combobox";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/Tabs";
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./components/Tooltip";
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
} from "./components/Popover";
export {
  ToastProvider,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastViewport,
} from "./components/Toast";
export type { ToastOptions, ToastPosition } from "./components/Toast";
export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";
export { RadioGroup, RadioGroupItem } from "./components/RadioGroup";
export type { RadioGroupProps } from "./components/RadioGroup";
export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";
export { Textarea } from "./components/Textarea";
export type { TextareaProps } from "./components/Textarea";
export { Label } from "./components/Label";
export type { LabelProps } from "./components/Label";
export { FormField } from "./components/FormField";
export type { FormFieldProps } from "./components/FormField";
export { Avatar, AvatarImage, AvatarFallback } from "./components/Avatar";
export { Badge, badgeStyles } from "./components/Badge";
export type { BadgeProps } from "./components/Badge";
export { Separator } from "./components/Separator";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/Accordion";
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./components/Collapsible";

// Phase 6 components — date/time pickers and expanded primitives
export { Calendar } from "./components/Calendar";
export type { CalendarProps, CalendarRangeHighlight } from "./components/Calendar";
export { TimePanel, TimePicker } from "./components/TimePicker";
export type { TimePanelProps, TimePickerProps } from "./components/TimePicker";
export { DatePicker } from "./components/DatePicker";
export type { DatePickerProps } from "./components/DatePicker";
export { DateRangePicker } from "./components/DateRangePicker";
export type {
  DateRangePickerProps,
  DateRange,
  DateRangeMaxSpan,
} from "./components/DateRangePicker";
export { TimeRangePicker } from "./components/TimeRangePicker";
export type { TimeRangePickerProps, TimeRange } from "./components/TimeRangePicker";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./components/DropdownMenu";
export { Alert, AlertTitle, AlertDescription } from "./components/Alert";
export type { AlertProps, AlertVariant } from "./components/Alert";
export { Progress } from "./components/Progress";
export type { ProgressProps } from "./components/Progress";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./components/Sheet";
export type { SheetSide } from "./components/Sheet";
export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "./components/Drawer";
export type { DrawerContentProps } from "./components/Drawer";
export { Modal } from "./components/Modal";
export type { ModalProps } from "./components/Modal";
export { TagInput } from "./components/TagInput";
export type { TagInputProps } from "./components/TagInput";
export { ScrollArea, ScrollBar, ScrollViewport } from "./components/ScrollArea";
export type { ScrollAreaProps, ScrollBarProps } from "./components/ScrollArea";
export { FileUpload } from "./components/FileUpload";
export type { FileUploadProps, FileRejection } from "./components/FileUpload";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/Breadcrumb";
export { TreeView } from "./components/TreeView";
export type { TreeViewProps, TreeItemData } from "./components/TreeView";
export { Timeline, TimelineItem } from "./components/Timeline";
export type { TimelineItemProps, TimelineVariant } from "./components/Timeline";
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  ConfirmDialog,
} from "./components/AlertDialog";
export type { ConfirmDialogProps } from "./components/AlertDialog";
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  usePaginationRange,
} from "./components/Pagination";
export type { PaginationLinkProps } from "./components/Pagination";
export { Slider } from "./components/Slider";
export type { SliderProps } from "./components/Slider";
export { ColorPicker } from "./components/ColorPicker";
export type { ColorPickerProps } from "./components/ColorPicker";
export * from "./lib/color";

// Phase 5 super-components
export { AppShell, APP_SHELL_BREAKPOINT, useAppShell } from "./components/AppShell";
export type {
  AppShellProps,
  AppShellSlots,
  AppShellClassNames,
  AppShellBreadcrumb,
} from "./components/AppShell";
export { DataTable, DATA_TABLE_VIRTUALIZE_THRESHOLD, useDataTable } from "./components/DataTable";
export type {
  DataTableProps,
  DataTableSlots,
  DataTableClassNames,
  TableInstance,
  UseDataTableConfig,
} from "./components/DataTable";
export { ChartCard, useChartCard } from "./components/ChartCard";
export type {
  ChartCardProps,
  ChartCardSlots,
  ChartCardClassNames,
} from "./components/ChartCard";
export { FormBuilder, useFormBuilder } from "./components/FormBuilder";
export type {
  FormBuilderProps,
  FormBuilderSlots,
  FormBuilderClassNames,
  FormFieldConfig,
} from "./components/FormBuilder";
export { CommandPalette, useCommandPalette } from "./components/CommandPalette";
export type {
  CommandPaletteProps,
  CommandPaletteSlots,
  CommandPaletteClassNames,
  // Renamed: `CommandItem` is now the Command primitive component export.
  CommandItem as CommandPaletteItem,
} from "./components/CommandPalette";
export { NotificationCenter, useNotificationCenter } from "./components/NotificationCenter";
export type { NotificationItem } from "./components/NotificationCenter";
export { Wizard, useWizard } from "./components/Wizard";
export type { WizardProps, WizardStep } from "./components/Wizard";
export { DonutChart } from "./components/chart/DonutChart";
export type { DonutChartProps } from "./components/chart/DonutChart";
export { Sparkline } from "./components/chart/Sparkline";
export type { SparklineProps } from "./components/chart/Sparkline";

// shadcn-parity primitives (P1)
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/Table";
export { Toggle, toggleStyles } from "./components/Toggle";
export { ToggleGroup, ToggleGroupItem } from "./components/ToggleGroup";
export { HoverCard, HoverCardTrigger, HoverCardContent } from "./components/HoverCard";
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "./components/ContextMenu";
export { Kbd } from "./components/Kbd";
export { AspectRatio } from "./components/AspectRatio";
export { ButtonGroup } from "./components/ButtonGroup";
export { NativeSelect } from "./components/NativeSelect";
export {
  Empty,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "./components/Empty";
export {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemEnd,
} from "./components/Item";

// shadcn-parity components (P2)
export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldControl,
  useField,
} from "./components/Field";
export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandDialog,
} from "./components/Command";
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./components/InputOTP";
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
} from "./components/Carousel";
export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./components/Resizable";
export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "./components/Menubar";

// P3 — direction support + chart tooltip
export { DirectionProvider } from "./components/Direction";
export { ChartTooltip } from "./components/chart/ChartTooltip";
export type { ChartTooltipRow } from "./components/chart/ChartTooltip";
