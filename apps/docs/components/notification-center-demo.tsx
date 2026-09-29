"use client";

import * as React from "react";
import { NotificationCenter } from "@srui/react";

/** Interactive NotificationCenter demo for the docs page. */
export function NotificationCenterDemo() {
  const [items, setItems] = React.useState([
    { id: "1", title: "Deploy finished", read: false, timestamp: new Date(Date.now() - 5 * 60000) },
    { id: "2", title: "New comment on #482", read: false, timestamp: new Date(Date.now() - 42 * 60000) },
    { id: "3", title: "Weekly report ready", read: true, timestamp: new Date(Date.now() - 26 * 3600000) },
  ]);

  return (
    <div className="not-prose my-6">
      <NotificationCenter
        notifications={items}
        onMarkRead={(id) =>
          setItems((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)))
        }
      />
    </div>
  );
}
