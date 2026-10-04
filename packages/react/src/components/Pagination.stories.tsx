import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  usePaginationRange,
} from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
};
export default meta;

type Story = StoryObj<typeof Pagination>;

function Demo({ total = 12 }: { total?: number }) {
  const [page, setPage] = useState(5);
  const range = usePaginationRange(page, total);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
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
          <PaginationNext onClick={() => setPage((p) => Math.min(total, p + 1))} disabled={page === total} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};

export const FewPages: Story = {
  render: () => <Demo total={5} />,
};
