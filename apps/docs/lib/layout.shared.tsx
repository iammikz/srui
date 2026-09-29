import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { StyleSwitcher } from '@/components/style-switcher';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
      children: <StyleSwitcher compact />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    // srui's switcher (in nav.children) owns dark mode; disable the built-in
    // toggle since next-themes is disabled in app/layout.tsx.
    themeSwitch: { enabled: false },
  };
}
