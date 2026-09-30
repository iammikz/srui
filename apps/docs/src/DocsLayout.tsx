import { Github } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppShell,
  Button,
  Separator,
  ToastProvider,
  TooltipProvider,
  UIProvider,
  cn,
} from "@srui/react";
import { nav } from "./nav";
import { SiteSearch } from "./components/site-search";
import { StyleSwitcher } from "./components/style-switcher";

/**
 * The shared page shell — built from AppShell (dogfooding: the site's own
 * chrome is srui components). Wraps everything in <UIProvider> so every
 * live example on every page flips between presets and light/dark through
 * one shared switcher. Sidebar items are `Button`s (ghost, or secondary
 * for the active route) sourced entirely from nav.ts.
 */
function SidebarNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <div className="grid gap-4">
      {nav.map((group) => (
        <div key={group.section} className="grid gap-1">
          <span className="px-3 text-xs font-semibold tracking-wide text-sidebar-foreground/60 uppercase">
            {group.section}
          </span>
          {group.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start px-3 font-normal",
                  active && "font-medium",
                )}
                onClick={() => {
                  if (!active) navigate(item.href);
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Wordmark() {
  return (
    <Link
      to="/"
      className="flex items-baseline gap-2 no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="text-lg font-bold tracking-tight text-foreground">srui</span>
      <span className="hidden text-xs text-muted-foreground sm:inline">
        Supercomponent React UI
      </span>
    </Link>
  );
}

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <ToastProvider>
        <TooltipProvider delayDuration={200}>
          <AppShell
            sidebar={<SidebarNav />}
            topbar={<Wordmark />}
            slots={{
              topbarEnd: (
                <div className="flex items-center gap-2">
                  <SiteSearch />
                  <StyleSwitcher />
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="GitHub repository"
                    onClick={() =>
                      window.open("https://github.com/srui-ui/srui", "_blank", "noopener")
                    }
                  >
                    <Github />
                  </Button>
                </div>
              ),
            }}
          >
            {children}
          </AppShell>
        </TooltipProvider>
      </ToastProvider>
    </UIProvider>
  );
}
