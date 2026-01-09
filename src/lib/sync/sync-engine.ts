"use client";

import { db, type SyncOutbox, type UUID } from "@/lib/db";

const BASE_BACKOFF_MS = 1500;
const MAX_BACKOFF_MS = 30000;

export type OutboxAction = "create" | "update" | "delete";

export async function enqueueOperation(params: {
  merchantId: UUID;
  entity: string;
  action: OutboxAction;
  payload: Record<string, unknown>;
  requestId?: string;
}) {
  if (!db) return;
  const now = new Date().toISOString();
  const requestId = params.requestId ?? crypto.randomUUID();
  const outbox: SyncOutbox = {
    id: crypto.randomUUID(),
    merchant_id: params.merchantId,
    entity: params.entity,
    action: params.action,
    payload_json: JSON.stringify(params.payload),
    created_at: now,
    retry_count: 0,
    last_error: null,
    request_id: requestId
  };
  await db.sync_outbox.add(outbox);
}

export async function processOutbox() {
  if (!db) return;
  const localDb = db;
  if (!navigator.onLine) return;

  window.sessionStorage.setItem("syncing", "1");
  window.sessionStorage.removeItem("sync_error");

  try {
    const items = await localDb.sync_outbox.orderBy("created_at").limit(50).toArray();
    if (items.length === 0) return;

    const payload = items.map((item) => ({
      id: item.id,
      request_id: item.request_id,
      entity: item.entity,
      action: item.action,
      payload: JSON.parse(item.payload_json),
      created_at: item.created_at
    }));

    const res = await fetch("/api/sync/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operations: payload })
    });

    if (!res.ok) {
      throw new Error(`Push failed: ${res.status}`);
    }

    const result: { processedIds: string[]; failed?: Array<{ id: string; error: string }> } =
      await res.json();

    if (result.processedIds?.length) {
      await localDb.sync_outbox.bulkDelete(result.processedIds);
    }

    if (result.failed?.length) {
      await Promise.all(
        result.failed.map(async (failure) => {
          const item = await localDb.sync_outbox.get(failure.id);
          if (!item) return;
          const retry = item.retry_count + 1;
          await localDb.sync_outbox.update(failure.id, {
            retry_count: retry,
            last_error: failure.error
          });
        })
      );
    }

    await localDb.sync_state.put({ id: "sync_state", last_push_at: new Date().toISOString() });
  } catch (error) {
    window.sessionStorage.setItem(
      "sync_error",
      error instanceof Error ? error.message : "Unknown sync error"
    );

    const items = await localDb.sync_outbox.orderBy("created_at").limit(50).toArray();
    await Promise.all(
      items.map((item) => {
        const retry = item.retry_count + 1;
        return localDb.sync_outbox.update(item.id, {
          retry_count: retry,
          last_error: error instanceof Error ? error.message : "Unknown sync error"
        });
      })
    );

    const backoff = Math.min(BASE_BACKOFF_MS * 2 ** (items[0]?.retry_count ?? 0), MAX_BACKOFF_MS);
    await new Promise((resolve) => setTimeout(resolve, backoff));
  } finally {
    window.sessionStorage.removeItem("syncing");
  }
}

export async function pullUpdates(lastUpdatedAt?: string) {
  if (!navigator.onLine) return;
  const res = await fetch(`/api/sync/pull?since=${encodeURIComponent(lastUpdatedAt ?? "")}`);
  if (!res.ok) return;
  const data = (await res.json()) as Record<string, unknown>;
  await db?.sync_state.put({ id: "sync_state", last_pull_at: new Date().toISOString() });
  return data;
}

export function bindAutoSync() {
  if (typeof window === "undefined") return;
  const handler = () => void processOutbox();
  window.addEventListener("online", handler);
  return () => window.removeEventListener("online", handler);
}
