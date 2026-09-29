'use client';

import { noFlashScript } from '@srui/react';

/**
 * Client wrapper so the server layout can render the srui no-flash script.
 * The whole @srui/react dist carries a "use client" banner (plan §1.5), so
 * noFlashScript() itself cannot be invoked from a Server Component.
 */
export function NoFlashScript() {
  return <script dangerouslySetInnerHTML={{ __html: noFlashScript() }} />;
}
