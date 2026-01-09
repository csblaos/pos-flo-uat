"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useNetworkStatus } from "@/lib/ui/use-network";
import { useSyncStatus } from "@/lib/ui/use-sync-status";
import { bindAutoSync, processOutbox } from "@/lib/sync/sync-engine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/pos", label: "POS", short: "ขาย" },
  { href: "/stock", label: "Stock", short: "สต็อก" },
  { href: "/reports", label: "Reports", short: "รายงาน" },
  { href: "/settings", label: "Settings", short: "ตั้งค่า" },
  { href: "/sync", label: "Sync", short: "Sync" }
];

function NetworkBars({ grade }: { grade: "great" | "ok" | "poor" | "offline" }) {
  const active = grade === "great" ? 3 : grade === "ok" ? 2 : grade === "poor" ? 1 : 0;
  const heights = ["h-2", "h-4", "h-6"];
  return (
    <div className="flex items-end gap-1">
      {[1, 2, 3].map((bar, index) => (
        <span
          key={bar}
          className={`${heights[index]} w-1 rounded-full ${
            bar <= active ? "bg-emerald-500" : "bg-ink-200"
          }`}
        />
      ))}
    </div>
  );
}

function SyncBadge({ status, count }: { status: string; count: number }) {
  if (status === "syncing") return <Badge>Syncing…</Badge>;
  if (status === "pending") return <Badge>Pending ({count})</Badge>;
  if (status === "error") return <Badge variant="destructive">Sync Error</Badge>;
  return <Badge variant="secondary">Synced</Badge>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const network = useNetworkStatus();
  const sync = useSyncStatus();

  useEffect(() => bindAutoSync(), []);

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wave-500">
                POS + Stock + Report
              </p>
              <h1 className="font-display text-lg font-semibold text-ink-800">
                Smart Offline Store
              </h1>
              <div className="mt-2 hidden items-center gap-2 text-xs text-ink-400 md:flex">
                <span className="chip">Offline-first</span>
                <span className="chip">FIFO Lot</span>
                <span className="chip">RBAC</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-ink-100 bg-white px-3 py-1 shadow-sm">
                <NetworkBars grade={network.grade} />
                <span className="text-xs font-semibold text-ink-500">{network.label}</span>
              </div>
              <SyncBadge status={sync.status} count={sync.pendingCount} />
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => processOutbox()}
              >
                Sync now
              </Button>
            </div>
          </div>
          <nav className="hidden gap-2 overflow-x-auto pb-2 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={active ? "default" : "secondary"}
                  className="rounded-full"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-28 md:px-8 md:pb-10">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink-100 bg-white/95 backdrop-blur md:hidden safe-bottom">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold ${
                  active ? "text-wave-700" : "text-ink-400"
                }`}
              >
                <span className="text-[11px]">{item.short}</span>
                <span className={`h-1 w-6 rounded-full ${active ? "bg-wave-500" : "bg-ink-100"}`} />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
