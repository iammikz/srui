import { Github } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  AppShell,
  Button,
  NavigationMenu,
  Separator,
  ToastProvider,
  TooltipProvider,
  UIProvider,
} from "@iammikz/srui";
import { sidebarNav } from "./nav";
import { SiteSearch } from "./components/site-search";
import { StyleSwitcher } from "./components/style-switcher";

/**
 * The shared page shell — built from AppShell (dogfooding: the site's own
 * chrome is srui components). Wraps everything in <UIProvider> so every
 * live example on every page flips between presets and light/dark through
 * one shared switcher. Three-level NavigationMenu items come from nav.ts.
 */
function SidebarNav() {
  const { pathname } = useLocation();
  return (
    <NavigationMenu
      variant="sidebar"
      aria-label="Documentation"
      items={sidebarNav}
      activeHref={pathname.replace(/\/$/, "") || "/"}
      renderLink={(item, { href: _href, ...props }) => (
        <Link {...props} to={item.href} />
      )}
    />
  );
}

function Wordmark() {
  return (
    <Link
      to="/"
      className="flex items-baseline gap-2 no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="text-lg font-bold tracking-tight text-foreground">
        srui
      </span>
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
                      window.open(
                        "https://github.com/iammikz/srui",
                        "_blank",
                        "noopener"
                      )
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
