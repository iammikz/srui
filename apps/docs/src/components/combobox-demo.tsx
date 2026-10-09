"use client";

import * as React from "react";
import { Combobox } from "@iammikz/srui";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "angular", label: "Angular" },
  { value: "preact", label: "Preact" },
];

/** Interactive Combobox demo for the docs page. */
export function ComboboxDemo({ disabled }: { disabled?: boolean }) {
  const [value, setValue] = React.useState("react");

  return (
    <div className="my-6">
      <Combobox
        options={options}
        value={value}
        onChange={setValue}
        placeholder="Framework…"
        emptyText="No framework matches."
        className="w-56"
        disabled={disabled}
      />
    </div>
  );
}

/** Multi-select: items toggle with checks and the popover stays open. */
export function ComboboxMultipleDemo() {
  const [values, setValues] = React.useState(["react", "svelte"]);

  return (
    <div className="my-6 flex flex-col gap-3">
      <Combobox
        options={options}
        multiple
        values={values}
        onValuesChange={setValues}
        placeholder="Frameworks…"
        className="w-72"
      />
      <p className="text-xs text-muted-foreground">
        Selected: {values.length ? values.join(", ") : "none"}
      </p>
    </div>
  );
}

/** Uncontrolled: pick a default and let the combobox own the state. */
export function ComboboxUncontrolledDemo() {
  return (
    <div className="my-6">
      <Combobox
        options={options}
        defaultValue="vue"
        placeholder="Framework…"
        className="w-56"
      />
    </div>
  );
}
