import type { ComponentType } from "react";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { DocsLayout } from "./DocsLayout";
import { MdxProvider } from "./mdx-components";

/**
 * Explicit route list — one entry per page, no file-based routing
 * convention. Each page imports its .mdx file directly as a component;
 * title/description come from the file's frontmatter via
 * remark-mdx-frontmatter. The root route mounts DocsLayout (built from
 * AppShell) around every page.
 */
import * as Intro from "../content/docs/index.mdx";
import * as Installation from "../content/docs/installation.mdx";
import * as Theming from "../content/docs/theming.mdx";
import * as Presets from "../content/docs/theming/presets.mdx";
import * as ThemeBuilder from "../content/docs/theming/theme-builder.mdx";
import * as BlockDashboard from "../content/docs/blocks/dashboard.mdx";
import * as BlockAuth from "../content/docs/blocks/auth.mdx";
import * as BlockSettings from "../content/docs/blocks/settings.mdx";
import * as BlockPricing from "../content/docs/blocks/pricing.mdx";
import * as Button from "../content/docs/components/button.mdx";
import * as Card from "../content/docs/components/card.mdx";
import * as Input from "../content/docs/components/input.mdx";
import * as Dialog from "../content/docs/components/dialog.mdx";
import * as Loader from "../content/docs/components/loader.mdx";
import * as StatCard from "../content/docs/components/stat-card.mdx";
import * as Charts from "../content/docs/components/charts.mdx";
import * as Select from "../content/docs/components/select.mdx";
import * as Combobox from "../content/docs/components/combobox.mdx";
import * as Tabs from "../content/docs/components/tabs.mdx";
import * as Tooltip from "../content/docs/components/tooltip.mdx";
import * as Popover from "../content/docs/components/popover.mdx";
import * as Toast from "../content/docs/components/toast.mdx";
import * as Checkbox from "../content/docs/components/checkbox.mdx";
import * as RadioGroup from "../content/docs/components/radio-group.mdx";
import * as Switch from "../content/docs/components/switch.mdx";
import * as Textarea from "../content/docs/components/textarea.mdx";
import * as FormField from "../content/docs/components/form-field.mdx";
import * as Avatar from "../content/docs/components/avatar.mdx";
import * as Badge from "../content/docs/components/badge.mdx";
import * as Separator from "../content/docs/components/separator.mdx";
import * as Accordion from "../content/docs/components/accordion.mdx";
import * as Collapsible from "../content/docs/components/collapsible.mdx";
import * as Calendar from "../content/docs/components/calendar.mdx";
import * as DatePicker from "../content/docs/components/date-picker.mdx";
import * as DateRangePicker from "../content/docs/components/date-range-picker.mdx";
import * as TimePicker from "../content/docs/components/time-picker.mdx";
import * as TimeRangePicker from "../content/docs/components/time-range-picker.mdx";
import * as DropdownMenu from "../content/docs/components/dropdown-menu.mdx";
import * as Alert from "../content/docs/components/alert.mdx";
import * as Progress from "../content/docs/components/progress.mdx";
import * as Sheet from "../content/docs/components/sheet.mdx";
import * as Drawer from "../content/docs/components/drawer.mdx";
import * as Modal from "../content/docs/components/modal.mdx";
import * as TagInput from "../content/docs/components/tag-input.mdx";
import * as ScrollArea from "../content/docs/components/scroll-area.mdx";
import * as FileUpload from "../content/docs/components/file-upload.mdx";
import * as Breadcrumb from "../content/docs/components/breadcrumb.mdx";
import * as TreeView from "../content/docs/components/tree-view.mdx";
import * as Timeline from "../content/docs/components/timeline.mdx";
import * as AlertDialog from "../content/docs/components/alert-dialog.mdx";
import * as Pagination from "../content/docs/components/pagination.mdx";
import * as Table from "../content/docs/components/table.mdx";
import * as Toggle from "../content/docs/components/toggle.mdx";
import * as ToggleGroup from "../content/docs/components/toggle-group.mdx";
import * as HoverCard from "../content/docs/components/hover-card.mdx";
import * as ContextMenu from "../content/docs/components/context-menu.mdx";
import * as Kbd from "../content/docs/components/kbd.mdx";
import * as AspectRatio from "../content/docs/components/aspect-ratio.mdx";
import * as ButtonGroup from "../content/docs/components/button-group.mdx";
import * as NativeSelect from "../content/docs/components/native-select.mdx";
import * as Empty from "../content/docs/components/empty.mdx";
import * as Item from "../content/docs/components/item.mdx";
import * as Field from "../content/docs/components/field.mdx";
import * as Command from "../content/docs/components/command.mdx";
import * as InputOTP from "../content/docs/components/input-otp.mdx";
import * as Carousel from "../content/docs/components/carousel.mdx";
import * as Resizable from "../content/docs/components/resizable.mdx";
import * as Menubar from "../content/docs/components/menubar.mdx";
import * as Chat from "../content/docs/components/chat.mdx";
import * as Slider from "../content/docs/components/slider.mdx";
import * as ColorPicker from "../content/docs/components/color-picker.mdx";
import * as AppShell from "../content/docs/components/app-shell.mdx";
import * as DataTable from "../content/docs/components/data-table.mdx";
import * as ChartCard from "../content/docs/components/chart-card.mdx";
import * as FormBuilder from "../content/docs/components/form-builder.mdx";
import * as CommandPalette from "../content/docs/components/command-palette.mdx";
import * as NotificationCenter from "../content/docs/components/notification-center.mdx";
import * as Wizard from "../content/docs/components/wizard.mdx";

/**
 * Static hosts differ on extensionless deep links (`vite preview` and other
 * strict servers only resolve the trailing-slash form). Normalize: any path
 * without a trailing slash redirects to its slashed form, which serves the
 * correct prerendered page; anything else is a real 404.
 */
function TrailingSlashRedirect() {
  const { pathname, search } = useLocation();
  if (pathname !== "/" && !pathname.endsWith("/")) {
    return <Navigate to={`${pathname}/${search}`} replace />;
  }
  return (
    <article className="docs-page">
      <h1>Page not found</h1>
      <p className="text-muted-foreground">
        That route doesn&apos;t exist. Try the sidebar.
      </p>
    </article>
  );
}

interface MdxModule {
  default: ComponentType;
  frontmatter: { title: string; description?: string };
}

function DocsPage({ mod }: { mod: MdxModule }) {
  const { default: Body, frontmatter } = mod;
  useEffect(() => {
    document.title = `${frontmatter.title} — srui`;
  }, [frontmatter.title]);
  return (
    <article className="docs-page">
      <h1>{frontmatter.title}</h1>
      {frontmatter.description ? (
        <p className="mt-0! text-muted-foreground">{frontmatter.description}</p>
      ) : null}
      <Body />
    </article>
  );
}

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: (
      <DocsLayout>
        <MdxProvider>
          <Outlet />
        </MdxProvider>
      </DocsLayout>
    ),
    entry: "src/DocsLayout.tsx",
    children: [
      { path: "", element: <DocsPage mod={Intro} /> },
      { path: "installation", element: <DocsPage mod={Installation} /> },
      { path: "theming", element: <DocsPage mod={Theming} /> },
      { path: "theming/presets", element: <DocsPage mod={Presets} /> },
      { path: "theming/theme-builder", element: <DocsPage mod={ThemeBuilder} /> },
      { path: "blocks/dashboard", element: <DocsPage mod={BlockDashboard} /> },
      { path: "blocks/auth", element: <DocsPage mod={BlockAuth} /> },
      { path: "blocks/settings", element: <DocsPage mod={BlockSettings} /> },
      { path: "blocks/pricing", element: <DocsPage mod={BlockPricing} /> },
      { path: "components/button", element: <DocsPage mod={Button} /> },
      { path: "components/card", element: <DocsPage mod={Card} /> },
      { path: "components/input", element: <DocsPage mod={Input} /> },
      { path: "components/dialog", element: <DocsPage mod={Dialog} /> },
      { path: "components/loader", element: <DocsPage mod={Loader} /> },
      { path: "components/stat-card", element: <DocsPage mod={StatCard} /> },
      { path: "components/charts", element: <DocsPage mod={Charts} /> },
      { path: "components/select", element: <DocsPage mod={Select} /> },
      { path: "components/combobox", element: <DocsPage mod={Combobox} /> },
      { path: "components/tabs", element: <DocsPage mod={Tabs} /> },
      { path: "components/tooltip", element: <DocsPage mod={Tooltip} /> },
      { path: "components/popover", element: <DocsPage mod={Popover} /> },
      { path: "components/toast", element: <DocsPage mod={Toast} /> },
      { path: "components/checkbox", element: <DocsPage mod={Checkbox} /> },
      { path: "components/radio-group", element: <DocsPage mod={RadioGroup} /> },
      { path: "components/switch", element: <DocsPage mod={Switch} /> },
      { path: "components/textarea", element: <DocsPage mod={Textarea} /> },
      { path: "components/form-field", element: <DocsPage mod={FormField} /> },
      { path: "components/avatar", element: <DocsPage mod={Avatar} /> },
      { path: "components/badge", element: <DocsPage mod={Badge} /> },
      { path: "components/separator", element: <DocsPage mod={Separator} /> },
      { path: "components/accordion", element: <DocsPage mod={Accordion} /> },
      { path: "components/collapsible", element: <DocsPage mod={Collapsible} /> },
      { path: "components/calendar", element: <DocsPage mod={Calendar} /> },
      { path: "components/date-picker", element: <DocsPage mod={DatePicker} /> },
      { path: "components/date-range-picker", element: <DocsPage mod={DateRangePicker} /> },
      { path: "components/time-picker", element: <DocsPage mod={TimePicker} /> },
      { path: "components/time-range-picker", element: <DocsPage mod={TimeRangePicker} /> },
      { path: "components/dropdown-menu", element: <DocsPage mod={DropdownMenu} /> },
      { path: "components/alert", element: <DocsPage mod={Alert} /> },
      { path: "components/progress", element: <DocsPage mod={Progress} /> },
      { path: "components/sheet", element: <DocsPage mod={Sheet} /> },
      { path: "components/drawer", element: <DocsPage mod={Drawer} /> },
      { path: "components/modal", element: <DocsPage mod={Modal} /> },
      { path: "components/tag-input", element: <DocsPage mod={TagInput} /> },
      { path: "components/scroll-area", element: <DocsPage mod={ScrollArea} /> },
      { path: "components/file-upload", element: <DocsPage mod={FileUpload} /> },
      { path: "components/breadcrumb", element: <DocsPage mod={Breadcrumb} /> },
      { path: "components/tree-view", element: <DocsPage mod={TreeView} /> },
      { path: "components/timeline", element: <DocsPage mod={Timeline} /> },
      { path: "components/alert-dialog", element: <DocsPage mod={AlertDialog} /> },
      { path: "components/pagination", element: <DocsPage mod={Pagination} /> },
      { path: "components/table", element: <DocsPage mod={Table} /> },
      { path: "components/toggle", element: <DocsPage mod={Toggle} /> },
      { path: "components/toggle-group", element: <DocsPage mod={ToggleGroup} /> },
      { path: "components/hover-card", element: <DocsPage mod={HoverCard} /> },
      { path: "components/context-menu", element: <DocsPage mod={ContextMenu} /> },
      { path: "components/kbd", element: <DocsPage mod={Kbd} /> },
      { path: "components/aspect-ratio", element: <DocsPage mod={AspectRatio} /> },
      { path: "components/button-group", element: <DocsPage mod={ButtonGroup} /> },
      { path: "components/native-select", element: <DocsPage mod={NativeSelect} /> },
      { path: "components/empty", element: <DocsPage mod={Empty} /> },
      { path: "components/item", element: <DocsPage mod={Item} /> },
      { path: "components/field", element: <DocsPage mod={Field} /> },
      { path: "components/command", element: <DocsPage mod={Command} /> },
      { path: "components/input-otp", element: <DocsPage mod={InputOTP} /> },
      { path: "components/carousel", element: <DocsPage mod={Carousel} /> },
      { path: "components/resizable", element: <DocsPage mod={Resizable} /> },
      { path: "components/menubar", element: <DocsPage mod={Menubar} /> },
      { path: "components/chat", element: <DocsPage mod={Chat} /> },
      { path: "components/slider", element: <DocsPage mod={Slider} /> },
      { path: "components/color-picker", element: <DocsPage mod={ColorPicker} /> },
      { path: "components/app-shell", element: <DocsPage mod={AppShell} /> },
      { path: "components/data-table", element: <DocsPage mod={DataTable} /> },
      { path: "components/chart-card", element: <DocsPage mod={ChartCard} /> },
      { path: "components/form-builder", element: <DocsPage mod={FormBuilder} /> },
      { path: "components/command-palette", element: <DocsPage mod={CommandPalette} /> },
      { path: "components/notification-center", element: <DocsPage mod={NotificationCenter} /> },
      { path: "components/wizard", element: <DocsPage mod={Wizard} /> },
      { path: "*", element: <TrailingSlashRedirect /> },
    ],
  },
];
