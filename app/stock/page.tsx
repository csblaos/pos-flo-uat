import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StockPage() {
  return (
    <div className="grid gap-6">
      <Card className="glass-panel">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wave-500">Stock</p>
            <CardTitle className="font-display text-2xl text-ink-800">จัดการล็อตสินค้า</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="rounded-full">
              Import CSV
            </Button>
            <Button className="rounded-full">เพิ่มล็อตใหม่</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Total SKUs</p>
              <p className="mt-2 text-2xl font-semibold text-ink-800">128</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Lots Active</p>
              <p className="mt-2 text-2xl font-semibold text-ink-800">56</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Low Stock</p>
              <p className="mt-2 text-2xl font-semibold text-ink-800">6</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-700">Lot #A-2024-09</p>
                  <p className="mt-1 text-xs text-ink-400">Received 2 days ago</p>
                </div>
                <span className="chip">FIFO</span>
              </div>
              <div className="mt-4 grid gap-2 text-xs text-ink-500 md:grid-cols-3">
                <div>
                  <p className="font-semibold text-ink-700">Qty remaining</p>
                  <p className="mt-1">120</p>
                </div>
                <div>
                  <p className="font-semibold text-ink-700">Unit cost</p>
                  <p className="mt-1">฿18.35</p>
                </div>
                <div>
                  <p className="font-semibold text-ink-700">Last updated</p>
                  <p className="mt-1">10:40</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-ink-200 p-4">
              <p className="text-sm font-semibold text-ink-500">FIFO Queue</p>
              <p className="mt-2 text-xs text-ink-400">ล็อตที่ถูกตัดก่อนอยู่ด้านบน</p>
              <div className="mt-4 space-y-2 text-xs text-ink-500">
                <div className="flex items-center justify-between">
                  <span>Lot #A-2024-09</span>
                  <span>120</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lot #A-2024-08</span>
                  <span>40</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lot #A-2024-07</span>
                  <span>12</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
