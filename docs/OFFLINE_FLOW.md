# Offline-first flow

## Core rule
- Always write to IndexedDB first.
- Every mutation creates an outbox item (create/update/delete).
- Sync runs in background when online or on manual trigger.

## Outbox item
```
{
  id,
  entity,
  action,
  payload,
  created_at,
  retry_count,
  last_error,
  request_id
}
```

## Scenario A: Create product while offline
1) User creates product.
2) Write to IndexedDB `products` with `updated_at` and `version`.
3) Add outbox { entity: "product", action: "create", payload }.
4) UI updates immediately.
5) When online, push batch and mark as synced.

## Scenario B: Stock in (new lot) while offline
1) Create `product_lots` record with computed `unit_cost`.
2) Write to IndexedDB.
3) Add outbox { entity: "product_lot", action: "create" }.
4) When online, sync to Turso and update server-side FIFO view.

## Scenario C: POS sale while offline (FIFO)
1) Create `sales` and `sale_items` in IndexedDB.
2) Deduct `product_lots.qty_remaining` locally using FIFO.
3) Create `sale_item_lots` with per-lot COGS snapshot.
4) Add outbox ops:
   - create sale
   - create sale_items
   - create sale_item_lots
   - update product_lots (qty_remaining)
5) Sync batch to server with idempotency key (request_id).

## Idempotency
- Client generates `request_id` per sale.
- Server stores `request_id` in `sync_requests`.
- If request_id exists, server returns success without re-applying operations.

## Conflict strategy
- Use `updated_at` and optional `version`.
- Default: Last-write-wins.
- If server version newer and conflicts, keep server version and log conflict in `sync_logs`.
