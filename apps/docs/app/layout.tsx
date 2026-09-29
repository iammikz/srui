import { RootProvider } from 'fumadocs-ui/provider/next';
import { UIProvider } from '@srui/react';
import { NoFlashScript } from '@/components/noflash-script';
import './global.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} data-style="flat" suppressHydrationWarning>
      <head>
        {/* Applies the persisted srui style/scheme before first paint (plan 2.1) */}
        <NoFlashScript />
      </head>
      <body className="flex min-h-screen flex-col">
        {/* srui owns data-style + the dark class; the next-themes provider
            inside RootProvider is disabled so the two never fight over html */}
        <UIProvider>
          <RootProvider theme={{ enabled: false, hotKey: false }}>
            {children}
          </RootProvider>
        </UIProvider>
      </body>
    </html>
  );
}
