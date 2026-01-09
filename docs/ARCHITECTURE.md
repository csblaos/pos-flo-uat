# POS Flo architecture

## Modules
- POS: barcode scan, cart, checkout, FIFO deduction.
- Stock: lot-based costing, stock in, remaining qty.
- Reports: sales, COGS, gross profit, category summary, CSV export.
- Settings: merchants, users, roles, permissions, categories, payment methods.
- Sync Center: status, pending queue, errors.

## Multi-tenant
- Every record includes `merchant_id`.
- Server enforces `merchant_id` filter on every query.

## RBAC
- Tables: roles, permissions, role_permissions, user_roles.
- Permission granularity: feature + action (view/create/update/delete).
- UI hides tabs and buttons if permission missing.
- API validates permissions on every endpoint.

## PWA
- Service worker caches UI/asset shells.
- Offline mode reads and writes from IndexedDB.
- Online mode uses write-through: local write -> async sync.

## Sync flow
- Push: outbox batch to `/api/sync/push`.
- Pull: `/api/sync/pull?since=...` for updates.
- Retry with exponential backoff.
- Idempotency via `request_id`.

## Tables for offline data
- `products`, `categories`, `product_lots`, `sales`, `sale_items`, `sale_item_lots`
- `sync_outbox`, `sync_logs`, `sync_state`
