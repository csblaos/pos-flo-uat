import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="grid gap-6">
      <Card className="glass-panel">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wave-500">Reports</p>
          <CardTitle className="font-display text-2xl text-ink-800">รายงานยอดขาย</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Total Sales</p>
              <p className="mt-2 text-2xl font-semibold text-ink-800">฿0.00</p>
              <p className="mt-1 text-xs text-ink-400">+0% จากเมื่อวาน</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">COGS</p>
              <p className="mt-2 text-2xl font-semibold text-ink-800">฿0.00</p>
              <p className="mt-1 text-xs text-ink-400">ล็อตล่าสุด</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Gross Profit</p>
              <p className="mt-2 text-2xl font-semibold text-ink-800">฿0.00</p>
              <p className="mt-1 text-xs text-ink-400">Margin 0%</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-ink-700">Sales Summary</p>
              <div className="mt-3 h-40 rounded-2xl border border-dashed border-ink-200 bg-ink-50" />
              <p className="mt-3 text-xs text-ink-400">เลือกช่วงวันที่ / ส่งออก CSV</p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-ink-700">Top Products</p>
              <div className="mt-3 space-y-3 text-xs text-ink-500">
                <div className="flex items-center justify-between">
                  <span>Americano</span>
                  <span>120 ชิ้น</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Latte</span>
                  <span>88 ชิ้น</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Matcha</span>
                  <span>64 ชิ้น</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-ink-200 p-4 text-sm text-ink-400">
            สรุปตามสินค้า/หมวดหมู่ + รายงาน Sync
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
