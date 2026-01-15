import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="grid gap-6">
      <Card className="surface-card">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Reports</p>
          <CardTitle className="font-display text-2xl text-white">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs font-semibold text-white/50">Total Sales</p>
              <p className="mt-2 text-2xl font-semibold text-white">THB 0.00</p>
              <p className="mt-1 text-xs text-white/50">+0% vs yesterday</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-white/50">COGS</p>
              <p className="mt-2 text-2xl font-semibold text-white">THB 0.00</p>
              <p className="mt-1 text-xs text-white/50">Latest lot data</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-white/50">Gross Profit</p>
              <p className="mt-2 text-2xl font-semibold text-white">THB 0.00</p>
              <p className="mt-1 text-xs text-white/50">Margin 0%</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Sales Summary</p>
              <div className="mt-3 h-40 rounded-2xl border border-dashed border-white/10 bg-white/5" />
              <p className="mt-3 text-xs text-white/50">Select date range or export CSV.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Top Products</p>
              <div className="mt-3 space-y-3 text-xs text-white/60">
                <div className="flex items-center justify-between">
                  <span>Americano</span>
                  <span>120 units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Latte</span>
                  <span>88 units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Matcha</span>
                  <span>64 units</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/50">
            Placeholder reports UI. Hook up analytics later.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
