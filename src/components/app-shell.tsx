"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Boxes, Home, Search, Settings, ShoppingBag, Wifi, WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/lib/ui/use-network";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import InstallAppButton from "../../components/InstallAppButton";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pos", label: "POS", icon: ShoppingBag },
  { href: "/stock", label: "Stock", icon: Boxes },
  { href: "/settings", label: "Settings", icon: Settings }
];

const merchants = [
  { id: "m-001", name: "Flo Market - Central" },
  { id: "m-002", name: "Flo Market - Riverside" },
  { id: "m-003", name: "Flo Market - Express" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const network = useNetworkStatus();
  const [merchantId, setMerchantId] = useState(merchants[0]?.id ?? "");
  const showSearch = pathname === "/pos" || pathname === "/stock";
  const searchPlaceholder = pathname === "/pos" ? "Search products or barcode" : "Search stock";

  if (isLanding) {
    return (
      <div className="app-shell text-white">
        <main className="mx-auto w-full max-w-6xl px-0">{children}</main>
      </div>
    );
  }

  return (
    <div className="app-shell text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500 text-sm font-semibold">
                FP
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                  POS + Stock
                </p>
                <h1 className="font-display text-lg font-semibold text-white">Flo POS Suite</h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={merchantId} onValueChange={setMerchantId} className="h-9">
                {merchants.map((merchant) => (
                  <SelectItem key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </SelectItem>
                ))}
              </Select>
              <Badge
                variant={network.online ? "secondary" : "destructive"}
                className="gap-2 rounded-full px-3 py-1 text-xs"
              >
                {network.online ? (
                  <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5 text-rose-200" />
                )}
                <span>{network.online ? "Online" : "Offline"}</span>
              </Badge>
              <Button variant="secondary" size="sm" disabled={!network.online}>
                Sync
              </Button>
              <div className="w-full sm:w-auto">
                <InstallAppButton />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {showSearch ? (
              <div className="relative flex w-full items-center md:max-w-md">
                <Search className="absolute left-3 h-4 w-4 text-white/40" />
                <Input
                  placeholder={searchPlaceholder}
                  className="h-11 border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                <Badge variant="secondary">Offline-ready</Badge>
                <span className="chip">Touch-first</span>
                <span className="chip">Fast checkout</span>
              </div>
            )}
            <nav className="hidden gap-2 md:flex">
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
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-28 md:px-8 md:pb-10 animate-in fade-in duration-500">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 backdrop-blur md:hidden safe-bottom">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold",
                  active ? "text-cyan-300" : "text-white/60"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[11px]">{item.label}</span>
                <span
                  className={cn(
                    "h-1 w-6 rounded-full",
                    active ? "bg-cyan-400" : "bg-white/10"
                  )}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
