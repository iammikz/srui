"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge, Button, DataTable } from "@srui/react";

type Person = { id: number; name: string; email: string; role: string; status: string };

const people: Person[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com", role: "Admin", status: "active" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com", role: "Editor", status: "active" },
  { id: 3, name: "Alan Turing", email: "alan@example.com", role: "Viewer", status: "invited" },
  { id: 4, name: "Katherine Johnson", email: "kj@example.com", role: "Editor", status: "active" },
  { id: 5, name: "Margaret Hamilton", email: "mh@example.com", role: "Admin", status: "inactive" },
  { id: 6, name: "Linus Torvalds", email: "linus@example.com", role: "Viewer", status: "active" },
  { id: 7, name: "Barbara Liskov", email: "bl@example.com", role: "Editor", status: "active" },
  { id: 8, name: "Donald Knuth", email: "don@example.com", role: "Viewer", status: "invited" },
];

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "success" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
];

/** Interactive DataTable demo: paged mode and a 10k-row virtualized mode. */
export function DataTableDemo() {
  const [big, setBig] = React.useState(false);

  return (
    <div className="my-6">
      <div className="mb-3">
        <Button size="sm" variant={big ? "default" : "outline"} onClick={() => setBig((v) => !v)}>
          {big ? "Back to 8 rows (paged)" : "Load 10,000 rows (virtualized)"}
        </Button>
      </div>
      {big ? (
        <DataTable
          columns={columns}
          data={Array.from({ length: 10000 }, (_, i) => ({
            id: i + 1,
            name: `Person ${i + 1}`,
            email: `person${i + 1}@example.com`,
            role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
            status: i % 5 === 0 ? "inactive" : "active",
          }))}
          filterable
          pinColumns
        />
      ) : (
        <DataTable
          columns={columns}
          data={people}
          selectable
          filterable
          pageSize={5}
          pinColumns
        />
      )}
    </div>
  );
}
