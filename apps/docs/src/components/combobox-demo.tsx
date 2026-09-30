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
