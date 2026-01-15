import Link from "next/link";
import { ArrowUpRight, Boxes, FileText, Plus, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quickActions = [
  { label: "New Sale", href: "/pos", icon: ShoppingCart },
  { label: "Add Product", href: "/stock", icon: Plus },
  { label: "Import Stock", href: "/stock", icon: Boxes },
  { label: "Reports", href: "/reports", icon: FileText }
];

const activity = [
  {
    id: "a1",
    title: "Sale #A-1042",
    detail: "4 items • Cash",
    time: "2 mins ago"
  },
  {
    id: "a2",
    title: "Stock import",
    detail: "20 units • Arabica Blend",
    time: "15 mins ago"
  },
  {
    id: "a3",
    title: "Price updated",
    detail: "Oat Milk 1L",
    time: "1 hour ago"
  }
];

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <section className="surface-card p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Dashboard</p>
            <h2 className="font-display text-2xl text-white">Good evening, Flo Market</h2>
            <p className="mt-2 text-sm text-white/60">
              Keep the line moving with quick actions and live sales signals.
            </p>
          </div>
          <Badge variant="secondary" className="hidden md:inline-flex">
            Live Shift
          </Badge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                asChild
                size="lg"
                className="h-auto justify-between rounded-2xl bg-white/10 px-4 py-4 text-left text-white hover:bg-white/15 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <Link href={action.href}>
                  <span className="flex items-center gap-3">
                    <span className="rounded-2xl bg-white/15 p-3">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold">{action.label}</span>
                      <span className="text-xs text-white/60">Tap to start</span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/50" />
                </Link>
              </Button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="surface-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70">Today Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-white">THB 24,580</p>
            <p className="mt-2 text-xs text-emerald-300">+12% vs yesterday</p>
          </CardContent>
        </Card>
        <Card className="surface-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-white">8 items</p>
            <p className="mt-2 text-xs text-amber-200">Restock suggested</p>
          </CardContent>
        </Card>
        <Card className="surface-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-white">412</p>
            <p className="mt-2 text-xs text-white/50">Across all categories</p>
          </CardContent>
        </Card>
      </div>

      <section className="surface-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-white">Recent Activity</h3>
          <Button variant="secondary" size="sm">
            View all
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {activity.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/60">{item.detail}</p>
              </div>
              <span className="text-xs text-white/40">{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
