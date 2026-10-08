/**
 * Sidebar configuration — a plain TypeScript array, not a framework
 * convention. DocsLayout renders it as AppShell's sidebar; routes.tsx is
 * the routing counterpart (one route per page).
 */
export interface NavItem {
  label: string;
  href: string;
}
export interface NavSection {
  section: string;
  items: NavItem[];
}

export const nav: NavSection[] = [
  {
    section: "Getting Started",
    items: [
      { label: "Introduction", href: "/" },
      { label: "Installation", href: "/installation" },
    ],
  },
  {
    section: "Theming",
    items: [
      { label: "Theming", href: "/theming" },
      { label: "Presets", href: "/theming/presets" },
      { label: "Theme Builder", href: "/theming/theme-builder" },
    ],
  },
  {
    section: "Components",
    items: [
      { label: "Button", href: "/components/button" },
      { label: "Card", href: "/components/card" },
      { label: "Input", href: "/components/input" },
      { label: "Dialog", href: "/components/dialog" },
      { label: "Loader", href: "/components/loader" },
      { label: "Stat Card", href: "/components/stat-card" },
      { label: "Charts", href: "/components/charts" },
      { label: "Select", href: "/components/select" },
      { label: "Combobox", href: "/components/combobox" },
      { label: "Tabs", href: "/components/tabs" },
      { label: "Tooltip", href: "/components/tooltip" },
      { label: "Popover", href: "/components/popover" },
      { label: "Toast", href: "/components/toast" },
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "Radio Group", href: "/components/radio-group" },
      { label: "Switch", href: "/components/switch" },
      { label: "Textarea", href: "/components/textarea" },
      { label: "Slider", href: "/components/slider" },
      { label: "Color Picker", href: "/components/color-picker" },
      { label: "Form Field", href: "/components/form-field" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
      { label: "Separator", href: "/components/separator" },
      { label: "Accordion", href: "/components/accordion" },
      { label: "Collapsible", href: "/components/collapsible" },
      { label: "Calendar", href: "/components/calendar" },
      { label: "DatePicker", href: "/components/date-picker" },
      { label: "DateRangePicker", href: "/components/date-range-picker" },
      { label: "TimePicker", href: "/components/time-picker" },
      { label: "TimeRangePicker", href: "/components/time-range-picker" },
      { label: "Dropdown Menu", href: "/components/dropdown-menu" },
      { label: "Alert", href: "/components/alert" },
      { label: "Alert Dialog", href: "/components/alert-dialog" },
      { label: "Progress", href: "/components/progress" },
      { label: "Sheet", href: "/components/sheet" },
      { label: "Drawer", href: "/components/drawer" },
      { label: "Modal", href: "/components/modal" },
      { label: "Tag Input", href: "/components/tag-input" },
      { label: "Scroll Area", href: "/components/scroll-area" },
      { label: "File Upload", href: "/components/file-upload" },
      { label: "Breadcrumb", href: "/components/breadcrumb" },
      { label: "Tree View", href: "/components/tree-view" },
      { label: "Timeline", href: "/components/timeline" },
      { label: "Pagination", href: "/components/pagination" },
      { label: "Table", href: "/components/table" },
      { label: "Toggle", href: "/components/toggle" },
      { label: "Toggle Group", href: "/components/toggle-group" },
      { label: "Hover Card", href: "/components/hover-card" },
      { label: "Context Menu", href: "/components/context-menu" },
      { label: "Kbd", href: "/components/kbd" },
      { label: "Aspect Ratio", href: "/components/aspect-ratio" },
      { label: "Button Group", href: "/components/button-group" },
      { label: "Native Select", href: "/components/native-select" },
      { label: "Empty", href: "/components/empty" },
      { label: "Item", href: "/components/item" },
      { label: "Field", href: "/components/field" },
      { label: "Command", href: "/components/command" },
      { label: "Input OTP", href: "/components/input-otp" },
      { label: "Carousel", href: "/components/carousel" },
      { label: "Resizable", href: "/components/resizable" },
      { label: "Menubar", href: "/components/menubar" },
      { label: "App Shell", href: "/components/app-shell" },
      { label: "Data Table", href: "/components/data-table" },
      { label: "Chart Card", href: "/components/chart-card" },
      { label: "Form Builder", href: "/components/form-builder" },
      { label: "Command Palette", href: "/components/command-palette" },
      { label: "Notification Center", href: "/components/notification-center" },
      { label: "Wizard", href: "/components/wizard" },
    ],
  },
  {
    section: "Blocks",
    items: [
      { label: "Dashboard", href: "/blocks/dashboard" },
      { label: "Auth", href: "/blocks/auth" },
      { label: "Settings", href: "/blocks/settings" },
      { label: "Pricing", href: "/blocks/pricing" },
    ],
  },
];
