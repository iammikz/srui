"use client";

import * as React from "react";
import { Checkbox } from "@srui/react";

/** Controlled checkbox demo. */
export function CheckboxDemo() {
  const [ok, setOk] = React.useState(true);
  return (
    <>
      <Checkbox checked={ok} onCheckedChange={(v) => setOk(v === true)} />
      Controlled: {ok ? "on" : "off"}
    </>
  );
}
