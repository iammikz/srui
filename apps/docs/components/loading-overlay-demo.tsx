"use client";

import * as React from "react";
import { Button, LoadingOverlay } from "@srui/react";

/** Interactive LoadingOverlay demo for the Loader docs page. */
export function LoadingOverlayDemo() {
  const [busy, setBusy] = React.useState(false);

  return (
    <>
      <LoadingOverlay active={busy} label="Fetching data…" />
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setBusy(true);
          window.setTimeout(() => setBusy(false), 1800);
        }}
      >
        Trigger overlay
      </Button>
    </>
  );
}
