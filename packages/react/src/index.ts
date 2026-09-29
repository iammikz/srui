/**
 * @srui/react — public API surface. Every export goes through here; Radix
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
  SelectGroup,
  SelectLabel,
  SelectSeparator,
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
export type { ToastOptions } from "./components/Toast";
export { Checkbox } from "./components/Checkbox";
export { RadioGroup, RadioGroupItem } from "./components/RadioGroup";
export { Switch } from "./components/Switch";
export { Textarea } from "./components/Textarea";
export type { TextareaProps } from "./components/Textarea";
export { Label } from "./components/Label";
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
