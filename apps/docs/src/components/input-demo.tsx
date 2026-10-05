"use client";

import * as React from "react";
import {
  Button,
  ColorPicker,
  ConfirmDialog,
  FileUpload,
  Input,
  Modal,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Slider,
  TagInput,
  TreeView,
  usePaginationRange,
  type TreeItemData,
} from "@iammikz/srui";

export function SliderDemo() {
  const [value, setValue] = React.useState([50]);
  return (
    <div className="flex w-64 flex-col gap-2">
      <Slider value={value} onValueChange={setValue} aria-label="Opacity" />
      <span className="text-right text-xs text-muted-foreground">{value[0]}%</span>
    </div>
  );
}

export function SliderRangeDemo() {
  const [value, setValue] = React.useState([25, 75]);
  return (
    <div className="flex w-64 flex-col gap-2">
      <Slider value={value} onValueChange={setValue} min={0} max={100} step={5} aria-label="Price span" />
      <span className="text-right text-xs text-muted-foreground">
        ${value[0]} – ${value[1]}
      </span>
    </div>
  );
}

export function ColorPickerDemo() {
  const [color, setColor] = React.useState("#2563EB");
  return <ColorPicker value={color} onChange={setColor} ariaLabel="Brand color" className="w-44" />;
}

export function ColorPickerAlphaDemo() {
  const [color, setColor] = React.useState("#10B981CC");
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      alpha
      presets={["#000000", "#64748B", "#DC2626", "#F59E0B", "#10B981", "#2563EB", "#7C3AED"]}
      ariaLabel="Overlay tint"
      className="w-44"
    />
  );
}

export function ConfirmDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this account?"
        description="This permanently removes the account and all of its data. This action cannot be undone."
        confirmLabel="Delete"
        tone="destructive"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export function PaginationDemo({ total = 12, initial = 5 }: { total?: number; initial?: number }) {
  const [page, setPage] = React.useState(initial);
  const range = usePaginationRange(page, total);
  return (
    <Pagination className="w-full">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          />
        </PaginationItem>
        {range.map((item) => (
          <PaginationItem key={item}>
            {item === "ellipsis-start" || item === "ellipsis-end" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink isActive={item === page} onClick={() => setPage(item)}>
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => setPage((p) => Math.min(total, p + 1))}
            disabled={page === total}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function TagInputDemo() {
  const [tags, setTags] = React.useState(["react", "typescript"]);
  return <TagInput value={tags} onChange={setTags} placeholder="Add tag…" className="w-80" />;
}

export function FileUploadDemo() {
  const [files, setFiles] = React.useState<File[]>([]);
  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      accept=".pdf,image/*"
      maxSizeBytes={2 * 1024 * 1024}
      className="w-full max-w-sm"
    />
  );
}

const TREE: TreeItemData[] = [
  {
    id: "src",
    label: "src",
    defaultExpanded: true,
    children: [
      { id: "components", label: "components", children: [{ id: "button", label: "Button.tsx" }] },
      { id: "lib", label: "lib", children: [{ id: "date", label: "date.ts" }] },
    ],
  },
  { id: "tests", label: "tests", children: [{ id: "visual", label: "visual.spec.ts" }] },
  { id: "package", label: "package.json" },
];

export function TreeViewDemo() {
  const [selected, setSelected] = React.useState("button");
  return (
    <TreeView items={TREE} selectedId={selected} onSelect={setSelected} aria-label="Project files" />
  );
}

export function ModalDemo() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState<string | null>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite teammate</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Invite a teammate"
        description="They'll receive an email with a join link that expires in 7 days."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!email.trim()}
              onClick={() => {
                setSent(email.trim());
                setEmail("");
                setOpen(false);
              }}
            >
              Send invite
            </Button>
          </>
        }
      >
        <Input
          type="email"
          placeholder="teammate@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
      {sent ? (
        <span className="text-xs text-muted-foreground">Invite sent to {sent}</span>
      ) : null}
    </>
  );
}

export function ModalInfoDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        What's new
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        size="sm"
        title="Release 1.3.0"
        description="New: Slider, ColorPicker, and the date/time picker family."
        footer={<Button onClick={() => setOpen(false)}>Got it</Button>}
      />
    </>
  );
}
