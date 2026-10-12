"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface NavigationMenuSidebarLink {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface NavigationMenuSidebarGroup {
  id: string;
  label: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: readonly NavigationMenuSidebarLink[];
}

/** Root → optional subgroup → link: at most three navigation levels. */
export type NavigationMenuSidebarItem =
  | NavigationMenuSidebarLink
  | (Omit<NavigationMenuSidebarGroup, "children"> & {
      children: readonly (
        | NavigationMenuSidebarLink
        | NavigationMenuSidebarGroup
      )[];
    });

export type NavigationMenuSidebarLinkProps = React.ComponentProps<"a">;

export type NavigationMenuProps =
  | (React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
      variant?: "header";
    })
  | (Omit<React.ComponentProps<"nav">, "children"> & {
      variant: "sidebar";
      items: readonly NavigationMenuSidebarItem[];
      activeHref?: string;
      /** Return a router link using the supplied accessible anchor props. */
      renderLink?: (
        item: NavigationMenuSidebarLink,
        props: NavigationMenuSidebarLinkProps
      ) => React.ReactNode;
    });

type SidebarOptions = Extract<NavigationMenuProps, { variant: "sidebar" }>;

function containsActive(
  item: NavigationMenuSidebarItem,
  activeHref?: string
): boolean {
  return "children" in item
    ? item.children.some((child) => containsActive(child, activeHref))
    : !item.disabled && item.href === activeHref;
}

function SidebarItem({
  item,
  depth,
  activeHref,
  renderLink,
}: {
  item: NavigationMenuSidebarItem;
  depth: number;
  activeHref?: string;
  renderLink?: SidebarOptions["renderLink"];
}) {
  const active = containsActive(item, activeHref);
  const [open, setOpen] = React.useState(
    active || ("children" in item && !!item.defaultOpen)
  );
  const contentId = React.useId();
  React.useEffect(() => {
    if (active) setOpen(true);
  }, [activeHref, active]);

  const rowClass = cn(
    "flex min-h-9 w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm outline-none transition-colors duration-(--dur-fast) hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
    active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
  );
  const label = (
    <>
      {item.icon ? (
        <span aria-hidden="true" className="shrink-0 [&_svg]:size-4">
          {item.icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 break-words">{item.label}</span>
    </>
  );

  if ("children" in item) {
    return (
      <li data-depth={depth}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          className={rowClass}
          onClick={() => setOpen((value) => !value)}
        >
          {label}
          <ChevronRight
            aria-hidden="true"
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-(--dur-fast) motion-reduce:transition-none",
              open && "rotate-90"
            )}
          />
        </button>
        <ul
          id={contentId}
          hidden={!open}
          className="ml-4 mt-1 grid gap-1 border-l border-sidebar-border pl-2"
        >
          {item.children.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              depth={depth + 1}
              activeHref={activeHref}
              renderLink={renderLink}
            />
          ))}
        </ul>
      </li>
    );
  }

  const linkProps: NavigationMenuSidebarLinkProps = {
    href: item.disabled ? undefined : item.href,
    "aria-current": active ? "page" : undefined,
    "aria-disabled": item.disabled || undefined,
    tabIndex: item.disabled ? -1 : undefined,
    onClick: item.disabled ? (event) => event.preventDefault() : undefined,
    className: cn(rowClass, item.disabled && "pointer-events-none opacity-50"),
    children: label,
  };
  return (
    <li data-depth={depth}>
      {renderLink && !item.disabled ? (
        renderLink(item, linkProps)
      ) : (
        <a {...linkProps} />
      )}
    </li>
  );
}

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(function NavigationMenu(props, ref) {
  if (props.variant === "sidebar") {
    const {
      variant: _variant,
      items,
      activeHref,
      renderLink,
      className,
      ...navProps
    } = props;
    return (
      <nav
        ref={ref}
        aria-label="Navigation"
        {...navProps}
        data-slot="navigation-menu-sidebar"
        className={cn("w-full text-sidebar-foreground", className)}
      >
        <ul className="grid gap-1">
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              depth={1}
              activeHref={activeHref}
              renderLink={renderLink}
            />
          ))}
        </ul>
      </nav>
    );
  }
  const { variant: _variant, ...rootProps } = props;
  return <NavigationMenuPrimitive.Root ref={ref} {...rootProps} />;
});
const NavigationMenuList = NavigationMenuPrimitive.List;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const NavigationMenuSub = NavigationMenuPrimitive.Sub;

/**
 * Site header navigation with hover/click flyouts (Radix NavigationMenu).
 * Render the `NavigationMenuViewport` once after the list; content panels
 * animate into it.
 */
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        "inline-flex h-9 w-max items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[active=true]:bg-accent/50 data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="relative top-px size-3.5 transition-transform duration-(--dur-base) data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "left-0 top-0 w-full motion-safe:animate-fade-in md:absolute md:w-auto",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "inline-flex w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[active=true]:bg-accent/50",
        className
      )}
      {...props}
    />
  );
}

/** The animated dot under the active item. */
function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center transition-transform duration-(--dur-fast) ease-(--ease-out) data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div className="relative top-1/2 size-2 rotate-45 rounded-[2px] bg-border" />
    </NavigationMenuPrimitive.Indicator>
  );
}

/** The shared flyout panel — render once, next to the menu root. */
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-0 top-full flex w-full justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "surface relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top-center overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg transition-[width,height] duration-(--dur-base) ease-(--ease-out) data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 motion-reduce:transition-none",
          className
        )}
        {...props}
      />
    </div>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  NavigationMenuSub,
};
