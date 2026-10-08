import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};
export default meta;

type Story = StoryObj<typeof Table>;

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Admin", status: "active" },
  { id: 2, name: "Grace Hopper", role: "Editor", status: "active" },
  { id: 3, name: "Alan Turing", role: "Viewer", status: "invited" },
];

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Table>
        <TableCaption>A list of recent members.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.role}</TableCell>
              <TableCell>{r.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>{rows.length} members</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};
