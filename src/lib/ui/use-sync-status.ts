"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";

export type SyncStatus = "synced" | "syncing" | "pending" | "error";

export function useSyncStatus() {
  const [pendingCount, setPendingCount] = useState(0);
  const [status, setStatus] = useState<SyncStatus>("synced");
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;

    let interval: number | undefined;

    const update = async () => {
      const count = await db.sync_outbox.count();
      const syncingFlag = window.sessionStorage.getItem("syncing") === "1";
      const error = window.sessionStorage.getItem("sync_error");

      setPendingCount(count);
      setLastError(error);

      if (syncingFlag) {
        setStatus("syncing");
      } else if (error) {
        setStatus("error");
      } else if (count > 0) {
        setStatus("pending");
      } else {
        setStatus("synced");
      }
    };

    update();
    interval = window.setInterval(update, 4000);

    return () => window.clearInterval(interval);
  }, []);

  return { pendingCount, status, lastError };
}
