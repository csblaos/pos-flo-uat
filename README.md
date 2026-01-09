# POS Flo (POS + Stock + Report)

Offline-first PWA for small businesses, optimized for mobile and iPad.

## What is included
- Next.js App Router + TypeScript scaffold
- Tailwind CSS with mobile-first layout
- PWA manifest + next-pwa caching strategy
- Dexie IndexedDB schema for local-first data
- Sync engine with outbox queue + retry/backoff
- API route stubs for auth + sync + health
- Turso SQL schema in `docs/DB_SCHEMA.sql`
- Offline flow notes in `docs/OFFLINE_FLOW.md`

## Key routes
- `/pos`
- `/stock`
- `/reports`
- `/settings`
- `/sync`

## Local-first rules
- Always write to IndexedDB first
- Add outbox operation per mutation
- Sync on network recovery or manual trigger

## Next steps
- Wire NextAuth providers + RBAC checks
- Connect Turso via libSQL client
- Implement sync push/pull handlers with idempotency
- Add CSV export to reports
