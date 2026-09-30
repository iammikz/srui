import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NotificationCenter } from "./NotificationCenter";

const meta: Meta<typeof NotificationCenter> = {
  title: "Super-components/NotificationCenter",
  component: NotificationCenter,
};
export default meta;

type Story = StoryObj<typeof NotificationCenter>;

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState([
      {
        id: "1",
        title: "Deploy finished",
        read: false,
        timestamp: new Date(Date.now() - 5 * 60000),
      },
      {
        id: "2",
        title: "New comment on #482",
        read: false,
        timestamp: new Date(Date.now() - 42 * 60000),
      },
      {
        id: "3",
        title: "Weekly report ready",
        read: true,
        timestamp: new Date(Date.now() - 26 * 3600000),
      },
    ]);
    return (
      <NotificationCenter
        notifications={items}
        onMarkRead={(id) =>
          setItems((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)))
        }
      />
    );
  },
};
