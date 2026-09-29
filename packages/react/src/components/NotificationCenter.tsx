"use client";

import * as React from "react";
import { Bell, Check } from "lucide-react";
import { cn } from "../lib/cn";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

export interface NotificationItem {
  id: string;
  title: string;
  read: boolean;
  timestamp: Date;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  /** Tier 2 — per-part classNames. */
  classNames?: {
    trigger?: string;
    list?: string;
    item?: string;
  };
  slots?: {
    /** Shown when there are no notifications. */
    empty?: React.ReactNode;
  };
}

/**
 * Tier 3 headless hook — notification state math with zero JSX: unread
 * count, newest-first ordering, and mark-read helpers.
 */
export function useNotificationCenter(
  notifications: NotificationItem[],
  onMarkRead: (id: string) => void,
) {
  const sorted = React.useMemo(
    () => [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [notifications],
  );
  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );
  return {
    notifications: sorted,
    unreadCount,
    markRead: onMarkRead,
    markAllRead: React.useCallback(() => {
      notifications.filter((n) => !n.read).forEach((n) => onMarkRead(n.id));
    }, [notifications, onMarkRead]),
  };
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/**
 * A bell trigger (Popover, Phase 3) opening a scrollable list of
 * notification cards with unread badge and mark-read controls.
 */
export function NotificationCenter({
  notifications,
  onMarkRead,
  classNames,
  slots,
}: NotificationCenterProps) {
  const { notifications: sorted, unreadCount, markAllRead } = useNotificationCenter(
    notifications,
    onMarkRead,
  );

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "surface relative grid size-9 place-items-center rounded-full bg-card text-foreground outline-none transition-shadow duration-(--dur-fast) hover:shadow-(--surface-shadow-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          classNames?.trigger,
        )}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5">
            <Badge variant="destructive" aria-hidden="true">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-88 p-2">
        <div className="mb-1 flex items-center justify-between px-2 py-1">
          <span className="text-xs font-medium text-muted-foreground">
            Notifications
          </span>
          {unreadCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <Check aria-hidden="true" /> Mark all read
            </Button>
          ) : null}
        </div>
        <div
          role="feed"
          aria-label="Notification list"
          className={cn("flex max-h-72 flex-col gap-2 overflow-y-auto p-1", classNames?.list)}
        >
          {sorted.length === 0
            ? (slots?.empty ?? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              ))
            : sorted.map((n) => (
                <Card
                  key={n.id}
                  data-read={n.read || undefined}
                  className={cn(
                    "gap-1.5 rounded-lg py-3",
                    !n.read && "border-primary/40",
                    classNames?.item,
                  )}
                >
                  <CardContent className="flex items-start justify-between gap-2 px-3">
                    <div className="grid gap-0.5">
                      <span className={cn("text-sm", !n.read && "font-medium")}>
                        {n.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <time dateTime={n.timestamp.toISOString()}>
                          {relativeTime(n.timestamp)}
                        </time>
                      </span>
                    </div>
                    {!n.read ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkRead(n.id)}
                        aria-label={`Mark "${n.title}" as read`}
                      >
                        <Check aria-hidden="true" />
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
