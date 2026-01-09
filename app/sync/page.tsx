"use client";

import { useSyncStatus } from "@/lib/ui/use-sync-status";
import { processOutbox } from "@/lib/sync/sync-engine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SyncPage() {
  const sync = useSyncStatus();

  return (
    <div className="grid gap-6">
      <Card className="glass-panel">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wave-500">
              Sync Center
            </p>
            <CardTitle className="font-display text-2xl text-ink-800">สถานะการ Sync</CardTitle>
          </div>
          <Button className="rounded-full" onClick={() => processOutbox()}>
            Sync now
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Status</p>
              <p className="mt-2 text-lg font-semibold text-ink-800">{sync.status}</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Pending Queue</p>
              <p className="mt-2 text-lg font-semibold text-ink-800">{sync.pendingCount}</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Last Error</p>
              <p className="mt-2 text-xs text-ink-500">{sync.lastError ?? "-"}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-ink-700">Pending Queue</p>
              <div className="mt-4 space-y-3 text-xs text-ink-500">
                <div className="flex items-center justify-between">
                  <span>product:create</span>
                  <span>2 รายการ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>sale:create</span>
                  <span>1 รายการ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>lot:update</span>
                  <span>4 รายการ</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-ink-200 p-5">
              <p className="text-sm font-semibold text-ink-500">Sync Log</p>
              <p className="mt-2 text-xs text-ink-400">แสดงคิวงานที่รอส่ง + log error แบบละเอียดที่นี่</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
