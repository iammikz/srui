"use client";

import * as React from "react";
import { Folder, LayoutDashboard, Settings } from "lucide-react";
import { NavigationMenu, type NavigationMenuSidebarItem } from "@iammikz/srui";

const items: NavigationMenuSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "#dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "projects",
    label: "Projects",
    icon: <Folder />,
    children: [
      {
        id: "workspace",
        label: "Workspace",
        children: [
          { id: "overview", label: "Overview", href: "#overview" },
          { id: "team", label: "Team", href: "#team" },
        ],
      },
      { id: "all-projects", label: "All projects", href: "#all-projects" },
    ],
  },
  { id: "settings", label: "Settings", href: "#settings", icon: <Settings /> },
];

/** Interactive three-level example, also used inside the AppShell preview. */
export function NavigationMenuSidebarDemo() {
  const [activeHref, setActiveHref] = React.useState("#overview");
  return (
    <NavigationMenu
      variant="sidebar"
      aria-label="Example navigation"
      items={items}
      activeHref={activeHref}
      renderLink={(item, props) => (
        <a
          {...props}
          onClick={(event) => {
            event.preventDefault();
            setActiveHref(item.href);
          }}
        />
      )}
    />
  );
}
