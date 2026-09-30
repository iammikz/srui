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
      { label: "Form Field", href: "/components/form-field" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
      { label: "Separator", href: "/components/separator" },
      { label: "Accordion", href: "/components/accordion" },
      { label: "Collapsible", href: "/components/collapsible" },
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
