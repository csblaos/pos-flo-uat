import { z } from "zod";
import { turso } from "@/lib/turso";

const OperationSchema = z.object({
  id: z.string(),
  request_id: z.string(),
  entity: z.string(),
  action: z.enum(["create", "update", "delete"]),
  payload: z.record(z.unknown()),
  created_at: z.string()
});

const PushSchema = z.object({
  operations: z.array(OperationSchema).min(1)
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = PushSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  // TODO: Wrap in transaction + idempotency check by request_id.
  // For Turso, store request_id in a sync_requests table to guarantee dedupe.

  const processedIds: string[] = [];
  const failed: Array<{ id: string; error: string }> = [];

  for (const op of parsed.data.operations) {
    try {
      const existing = await turso.execute({
        sql: "SELECT request_id FROM sync_requests WHERE request_id = ?",
        args: [op.request_id]
      });

      if (existing.rows.length === 0) {
        await turso.execute({
          sql: "INSERT INTO sync_requests (request_id, merchant_id, created_at) VALUES (?, ?, ?)",
          args: [op.request_id, op.payload.merchant_id ?? "", new Date().toISOString()]
        });
      }

      // TODO: map entity/action to UPSERT/DELETE per table with full validation.
      await turso.execute({
        sql: "INSERT INTO sync_logs (id, merchant_id, status, message, created_at) VALUES (?, ?, ?, ?, ?)",
        args: [
          crypto.randomUUID(),
          op.payload.merchant_id ?? "",
          "success",
          `Received ${op.entity}:${op.action}`,
          new Date().toISOString()
        ]
      });

      processedIds.push(op.id);
    } catch (error) {
      failed.push({
        id: op.id,
        error: error instanceof Error ? error.message : "unknown"
      });
    }
  }

  return Response.json({ processedIds, failed });
}
