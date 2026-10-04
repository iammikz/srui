import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileUpload } from "./FileUpload";

const meta: Meta<typeof FileUpload> = {
  title: "Components/FileUpload",
  component: FileUpload,
};
export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onChange={setFiles}
        accept=".pdf,image/*"
        maxSizeBytes={2 * 1024 * 1024}
        className="w-80"
      />
    );
  },
};

export const SingleSmallFile: Story = {
  render: () => (
    <FileUpload multiple={false} maxSizeBytes={256 * 1024} prompt="Attach an avatar" className="w-80" />
  ),
};
