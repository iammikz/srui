import type { Meta, StoryObj } from "@storybook/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "./DataTable";
import { Badge } from "./Badge";

const meta: Meta<typeof DataTable> = {
  title: "Super-components/DataTable",
  component: DataTable,
};
export default meta;

type Story = StoryObj<typeof DataTable>;

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

export const FullFeatured: Story = {
  name: "Sortable + filterable + selectable + paged + pinned",
  render: () => {
    const [selected, setSelected] = useState<Person[]>([]);
    return (
      <div className="flex w-full max-w-3xl flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          {selected.length} rows selected
        </span>
        <DataTable
          columns={columns}
          data={people}
          selectable
          filterable
          pageSize={5}
          pinColumns
          onRowSelectionChange={setSelected}
          slots={{ empty: "No people match your filters." }}
        />
      </div>
    );
  },
};

export const Virtualized10k: Story = {
  name: "10,000 rows (virtualized)",
  render: () => (
    <div className="w-full max-w-3xl">
      <DataTable
        columns={columns}
        filterable
        pinColumns
        data={Array.from({ length: 10000 }, (_, i) => ({
          id: i + 1,
          name: `Person ${i + 1}`,
          email: `person${i + 1}@example.com`,
          role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
          status: i % 5 === 0 ? "inactive" : "active",
        }))}
      />
    </div>
  ),
};
