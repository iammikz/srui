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
import sruiLogo from "@iammikz/srui/logo.svg?url";
import sruiIcon from "@iammikz/srui/icon.svg?url";

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
      aria-label="SRUI home"
      className="flex shrink-0 items-center no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <img src={sruiLogo} alt="" width={1600} height={420} className="hidden h-9 w-auto rounded-sm sm:block" />
      <img src={sruiIcon} alt="" width={512} height={512} className="size-9 rounded-sm sm:hidden" />
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
