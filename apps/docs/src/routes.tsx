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
