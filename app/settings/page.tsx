import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <Card className="glass-panel">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wave-500">Settings</p>
          <CardTitle className="font-display text-2xl text-ink-800">Merchant & Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Active Users</p>
              <p className="mt-2 text-2xl font-semibold text-ink-800">4</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Roles</p>
              <p className="mt-2 text-2xl font-semibold text-ink-800">3</p>
            </div>
            <div className="stat-card">
              <p className="text-xs font-semibold text-ink-400">Devices</p>
              <p className="mt-2 text-2xl font-semibold text-ink-800">2</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-ink-700">Merchant Profile</p>
              <p className="mt-2 text-xs text-ink-400">ชื่อร้าน / ภาษี / ที่อยู่ / ใบเสร็จ</p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-ink-700">Roles & Permissions</p>
              <p className="mt-2 text-xs text-ink-400">กำหนดสิทธิแบบ Tab/Action</p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-ink-700">Payment Methods</p>
              <p className="mt-2 text-xs text-ink-400">Cash / Bank Transfer / PromptPay</p>
            </div>
            <div className="rounded-2xl border border-dashed border-ink-200 p-5">
              <p className="text-sm font-semibold text-ink-500">Categories</p>
              <p className="mt-2 text-xs text-ink-400">จัดหมวดสินค้า + สีป้าย</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
