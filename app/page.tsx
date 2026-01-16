"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Check,
  Cloud,
  Laptop,
  Menu,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Users2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tabs = [
  {
    id: "pos",
    label: "POS",
    title: "Checkout faster and serve more customers",
    description:
      "Quick sales, split bills, and smart discounts help your team move the line.",
    cards: [
      { title: "Fast sale", body: "One-tap checkout with auto totals." },
      { title: "Barcode", body: "Scan items for instant lookup." },
      { title: "Split pay", body: "Cash + card + vouchers in one bill." }
    ]
  },
  {
    id: "stock",
    label: "Stock",
    title: "Inventory that stays accurate in real time",
    description:
      "Live stock levels and reorder notes keep shelves full and waste low.",
    cards: [
      { title: "Live counts", body: "Stock updates on every sale." },
      { title: "Alerts", body: "Low stock warnings before you run out." },
      { title: "Suppliers", body: "Notes and reorder info on file." }
    ]
  },
  {
    id: "reports",
    label: "Reports",
    title: "Reports that sell more and save time",
    description:
      "Daily sales, profit snapshots, and best sellers in one view.",
    cards: [
      { title: "Daily totals", body: "Shift and store breakdowns." },
      { title: "Top items", body: "Know what sells best today." },
      { title: "Margins", body: "Profit clarity without spreadsheets." }
    ]
  },
  {
    id: "offline",
    label: "Offline PWA",
    title: "Keep selling when the internet drops",
    description:
      "Orders save offline and auto-sync to the cloud when you reconnect.",
    cards: [
      { title: "Offline mode", body: "No internet, no problem." },
      { title: "Auto sync", body: "Syncs the moment you reconnect." },
      { title: "Installable", body: "App-like experience on any device." }
    ]
  },
  {
    id: "roles",
    label: "Roles & Permissions",
    title: "Control staff access and accountability",
    description:
      "Give cashiers, managers, and owners the right permissions.",
    cards: [
      { title: "Role presets", body: "Cashier, manager, owner defaults." },
      { title: "Audit trail", body: "Track edits and approvals." },
      { title: "Secure access", body: "Lock sensitive actions." }
    ]
  }
];

const workflows = [
  {
    id: "checkout",
    label: "Checkout",
    icon: ShoppingBag,
    summary: "Complete a sale in seconds with fewer taps.",
    steps: [
      { title: "Open register", desc: "Start a new sale for the current shift." },
      { title: "Scan items", desc: "Add items via barcode or quick search." },
      { title: "Apply discounts", desc: "Use member pricing or promo rules." },
      { title: "Take payment", desc: "Cash, card, or split payment." },
      { title: "Print receipt", desc: "Send or print instantly." }
    ],
    metrics: [
      { label: "Avg time", value: "42 sec" },
      { label: "Items/order", value: "3.2" },
      { label: "Tip usage", value: "28%" },
      { label: "Success rate", value: "99.7%" }
    ]
  },
  {
    id: "barcode",
    label: "Barcode Scan",
    icon: ScanLine,
    summary: "Fast item lookup with live stock accuracy.",
    steps: [
      { title: "Scan barcode", desc: "Use any handheld scanner or camera." },
      { title: "Find product", desc: "Instant match with variant info." },
      { title: "Confirm quantity", desc: "Adjust qty without leaving the flow." },
      { title: "Add to cart", desc: "Items drop straight into the basket." },
      { title: "Update stock", desc: "Live decrement after sale." }
    ],
    metrics: [
      { label: "Scan speed", value: "0.4s" },
      { label: "Lookup", value: "99.9%" },
      { label: "Stock update", value: "1 step" },
      { label: "Errors cut", value: "35%" }
    ]
  },
  {
    id: "stock",
    label: "Stock Update",
    icon: Boxes,
    summary: "Update inventory quickly and prevent stockouts.",
    steps: [
      { title: "Open inventory", desc: "Filter by category or supplier." },
      { title: "Select item", desc: "Pick the exact variant to update." },
      { title: "Update count", desc: "Type new stock or add adjustment." },
      { title: "Add reason", desc: "Waste, delivery, or audit note." },
      { title: "Save & notify", desc: "Alerts trigger if levels are low." }
    ],
    metrics: [
      { label: "Update time", value: "25 sec" },
      { label: "Low-stock", value: "8/day" },
      { label: "Accuracy", value: "98.6%" },
      { label: "Reorders", value: "12/wk" }
    ]
  },
  {
    id: "offline",
    label: "Offline Sync",
    icon: Cloud,
    summary: "Offline sales sync to the cloud automatically.",
    steps: [
      { title: "Continue selling", desc: "Checkout works without internet." },
      { title: "Queue orders", desc: "Sales are stored on device." },
      { title: "Reconnect", desc: "Auto-detect network return." },
      { title: "Sync in background", desc: "Orders push to the cloud." },
      { title: "Resolve conflicts", desc: "Safe merge rules keep data clean." }
    ],
    metrics: [
      { label: "Orders saved", value: "32k" },
      { label: "Sync delay", value: "0.4s" },
      { label: "Auto-resolve", value: "92%" },
      { label: "Data loss", value: "0" }
    ]
  }
];

const deployments = [
  { label: "Mobile", icon: Smartphone },
  { label: "Tablet", icon: ScanLine },
  { label: "Desktop", icon: Laptop },
  { label: "PWA Offline", icon: Cloud },
  { label: "Cloud Sync", icon: ShieldCheck }
];

const testimonials = [
  {
    name: "Nana, Cafe Owner",
    quote:
      "We went live the same day. Staff learned Flo POS in under an hour."
  },
  {
    name: "Arthit, Mini‑mart Manager",
    quote:
      "Stock is finally accurate. The low‑stock alerts pay for the monthly fee."
  },
  {
    name: "Mali, Restaurant Lead",
    quote:
      "Offline sales synced as soon as the internet returned. No data loss."
  }
];

const resources = [
  { title: "Support", body: "Fast help from our onboarding team." },
  { title: "Training", body: "Short lessons for cashiers and managers." },
  { title: "Community", body: "Share POS tips and workflows." },
  { title: "Integrations", body: "Printers, scanners, and payments ready." }
];

type PeakWindow = { time: string; value: number };

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function generateDummyMetrics() {
  const now = new Date();
  const seed = now.getFullYear() * 1000 + now.getMonth() * 31 + now.getDate();
  const minuteSeed = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const hourly = now.getHours();
  let baseOrders = 180 + Math.floor(seededRandom(seed + minuteSeed) * 110);
  if (hourly >= 11 && hourly < 14) baseOrders = Math.round(baseOrders * 1.25);
  if (hourly >= 17 && hourly < 19) baseOrders = Math.round(baseOrders * 1.15);
  if (hourly >= 20 || hourly < 8) baseOrders = Math.round(baseOrders * 0.6);
  const surprisePeak = seededRandom(seed + minuteSeed * 3) > 0.92;
  if (surprisePeak) baseOrders = Math.round(baseOrders * 1.35);
  const hours = Array.from({ length: 13 }, (_, i) => 8 + i);
  const intensities = hours.map((hour) => {
    let base = 0.45;
    if (hour >= 10 && hour < 12) base = 0.7;
    if (hour >= 12 && hour < 14) base = 1.1;
    if (hour >= 14 && hour < 17) base = 0.65;
    if (hour >= 17 && hour < 19) base = 0.95;
    if (hour >= 19) base = 0.55;
    const noise = (seededRandom(seed + hour + minuteSeed) - 0.5) * 0.18;
    return Math.max(0.2, base + noise);
  });
  const intensitySum = intensities.reduce((acc, value) => acc + value, 0);
  const hourlyOrders = intensities.map((value) =>
    Math.max(1, Math.round((value / intensitySum) * baseOrders))
  );
  const totalOrdersToday = hourlyOrders.reduce((acc, value) => acc + value, 0);

  const windowRanges = [
    { label: "08:00–10:00", start: 8, end: 10 },
    { label: "11:00–13:00", start: 11, end: 13 },
    { label: "17:00–19:00", start: 17, end: 19 }
  ];
  const windowTotals = windowRanges.map((range) => {
    const indices = hours
      .map((hour, index) => ({ hour, index }))
      .filter((item) => item.hour >= range.start && item.hour <= range.end)
      .map((item) => item.index);
    const sum = indices.reduce((acc, index) => acc + hourlyOrders[index], 0);
    return { label: range.label, sum };
  });
  const maxWindow = Math.max(...windowTotals.map((window) => window.sum));
  const peakHours: PeakWindow[] = windowTotals.map((window) => ({
    time: window.label,
    value: Math.round((window.sum / maxWindow) * 100)
  }));

  const stockIn = 60 + Math.round(seededRandom(seed + minuteSeed + 11) * 25);
  const stockOut = Math.max(10, 100 - stockIn);
  const activeUsers = 6 + Math.floor(seededRandom(seed + minuteSeed + 21) * 9);
  const ordersProcessed = totalOrdersToday * (6 + Math.floor(seededRandom(seed + 5) * 3));
  const ordersPerDay = Math.round(ordersProcessed / 7);
  const ordersPerHour = Math.max(1, Math.round(ordersPerDay / 12));

  return {
    totalOrdersToday,
    ordersProcessed,
    activeUsers,
    peakHours,
    stockIn,
    stockOut,
    ordersPerDay,
    ordersPerHour
  };
}

function generateStaticMetrics() {
  return {
    totalOrdersToday: 280,
    ordersProcessed: 1240,
    activeUsers: 10,
    peakHours: [
      { time: "11:00–13:00", value: 85 },
      { time: "17:00–19:00", value: 72 },
      { time: "08:00–10:00", value: 48 }
    ],
    stockIn: 62,
    stockOut: 18,
    ordersPerDay: 265,
    ordersPerHour: 22
  };
}

export default function HomePage() {
  const navRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState("pos");
  const [activeFlow, setActiveFlow] = useState("checkout");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("#features");
  const [metrics, setMetrics] = useState(() => generateStaticMetrics());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      setMetrics(generateDummyMetrics());
      const nextMs = 15000 + Math.floor(Math.random() * 25000);
      timeoutId = setTimeout(() => {
        setMetrics(generateDummyMetrics());
        schedule();
      }, nextMs);
    };
    schedule();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  const tab = useMemo(
    () => tabs.find((item) => item.id === activeTab) ?? tabs[0],
    [activeTab]
  );

  const flow = useMemo(
    () => workflows.find((item) => item.id === activeFlow) ?? workflows[0],
    [activeFlow]
  );

  const plans = useMemo(
    () => [
      {
        name: "Starter",
        price: billing === "monthly" ? "฿290/mo" : "฿2,900/yr",
        note: "Best for new stores",
        features: [
          "1 location",
          "1 register",
          "Products + barcode",
          "Basic sales reports",
          "Offline mode"
        ],
        cta: "Start Starter"
      },
      {
        name: "Pro",
        price: billing === "monthly" ? "฿490/mo" : "฿4,900/yr",
        note: "Most popular",
        features: [
          "Up to 5 staff",
          "Unlimited products",
          "Advanced reports",
          "Inventory alerts",
          "Priority support"
        ],
        highlight: true,
        cta: "Start Pro"
      },
      {
        name: "Enterprise",
        price: billing === "monthly" ? "Custom" : "Custom",
        note: "Custom plan",
        features: [
          "Unlimited locations",
          "Custom roles + approvals",
          "Dedicated success",
          "Custom integrations",
          "SLA support"
        ],
        cta: "Talk to Sales"
      }
    ],
    [billing]
  );

  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    const navOffset = navRef.current?.getBoundingClientRect().height ?? 0;
    const top = window.scrollY + target.getBoundingClientRect().top - navOffset - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const handleNavClick = (event: React.MouseEvent<HTMLElement> | null, href: string) => {
    if (event) event.preventDefault();
    setActiveNav(href);
    if (isMenuOpen) {
      setIsMenuOpen(false);
      window.setTimeout(() => scrollToSection(href), 320);
      return;
    }
    scrollToSection(href);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0b0f1a] dark:text-slate-100">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-sky-100/60 blur-[140px] dark:bg-sky-500/10" />
          <div className="absolute right-0 top-16 h-96 w-96 rounded-full bg-slate-200/60 blur-[160px] dark:bg-slate-500/10" />
        </div>

        <nav
          ref={navRef}
          className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl dark:bg-[#0b0f1a]/70"
        >
          <div className="mx-auto w-full max-w-none px-4 py-4 md:px-10">
            <div className="flex items-center justify-between gap-4 rounded-[2.5rem] bg-white/85 px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:bg-[#121829]/80">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/flo-x-pos-logo.png"
                  alt="Flo POS logo"
                  width={120}
                  height={120}
                  className="h-10 w-auto object-contain sm:h-12 md:h-14"
                  priority
                />
                <span className="hidden text-xs font-semibold uppercase tracking-[0.45em] text-slate-500 dark:text-slate-400 md:inline">
                  Online POS
                </span>
              </div>
              <div className="hidden items-center gap-1 rounded-full bg-slate-100/80 px-2 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-500 dark:bg-white/5 dark:text-slate-400 md:flex">
                {[
                  { href: "#home", label: "Home" },
                  { href: "#features", label: "Features" },
                  { href: "#pricing", label: "Pricing" },
                  { href: "#contact", label: "Contact" }
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item.href)}
                    aria-current={activeNav === item.href ? "page" : undefined}
                    className={`rounded-full px-4 py-2 transition ${
                      activeNav === item.href
                        ? "bg-slate-900 text-white dark:bg-white/10 dark:text-white"
                        : "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" className="rounded-full">
                Sign in
              </Button>
              <Button className="rounded-full bg-red-600 text-white shadow-[0_14px_34px_rgba(239,68,68,0.35)] hover:bg-red-500">
                Start monthly plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-[0_10px_25px_rgba(15,23,42,0.12)] dark:bg-white/5 dark:text-slate-300 md:hidden"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation"
                aria-controls="mobile-nav"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div
            id="mobile-nav"
            className={`md:hidden transition-all duration-300 ease-out ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden px-4`}
          >
            <div className="mb-4 rounded-[2rem] bg-white/90 p-4 text-sm font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:bg-[#121829]/90 dark:text-slate-300">
              <div className="flex flex-col gap-3">
                {[
                  { href: "#home", label: "Home" },
                  { href: "#features", label: "Features" },
                  { href: "#pricing", label: "Pricing" },
                  { href: "#contact", label: "Contact" }
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item.href)}
                    aria-current={activeNav === item.href ? "page" : undefined}
                    className={`rounded-2xl px-4 py-3 shadow-sm transition ${
                      activeNav === item.href
                        ? "bg-slate-900 text-white dark:bg-white/10 dark:text-white"
                        : "bg-slate-50 hover:bg-slate-100 hover:text-slate-900 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="ghost"
                    className="rounded-2xl"
                    onClick={(event) => handleNavClick(event, "#home")}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="rounded-2xl bg-red-600 text-white hover:bg-red-500"
                    onClick={(event) => handleNavClick(event, "#pricing")}
                  >
                    Start monthly plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="relative mx-auto flex w-full max-w-none flex-col gap-24 px-0 py-14">
          <section id="home" className="scroll-mt-[120px] md:scroll-mt-28 mx-auto grid w-full max-w-6xl gap-12 px-4 md:grid-cols-[1.1fr_0.9fr] md:px-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                Online POS subscription
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
                  Online POS that keeps selling, even offline
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
                  Subscribe monthly to run checkout, inventory, and reports across all your
                  devices. When the internet drops, sales continue and sync automatically.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="rounded-2xl bg-red-600 text-white hover:bg-red-500"
                >
                  Start monthly plan
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  See pricing
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Cloud POS
                </span>
                <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                  <Users2 className="h-3.5 w-3.5" />
                  Monthly billing
                </span>
                <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                  <Cloud className="h-3.5 w-3.5" />
                  Offline mode
                </span>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-white/5">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
                  <span>Live store summary</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                  Online
                </span>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      label: "Total orders today",
                      value: formatNumber(metrics.totalOrdersToday)
                    },
                    {
                      label: "Orders processed",
                      value: formatNumber(metrics.ordersProcessed)
                    },
                    { label: "Active users", value: formatNumber(metrics.activeUsers) }
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <span className="text-slate-500 dark:text-slate-300">{row.label}</span>
                      <span className="font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    <p className="uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      Peak hours
                    </p>
                    <div className="mt-3 space-y-3 text-sm">
                      {metrics.peakHours.map((item) => (
                        <div key={item.time} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>{item.time}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {item.value}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10">
                            <div
                              className="h-2 rounded-full bg-red-500/80"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    <p className="uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      Stock-in vs stock-out
                    </p>
                    <div className="mt-3 space-y-3 text-sm">
                      {[
                        { label: "Stock-in", value: metrics.stockIn },
                        { label: "Stock-out", value: metrics.stockOut }
                      ].map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>{item.label}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {item.value}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10">
                            <div
                              className="h-2 rounded-full bg-red-500/80"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="features" className="scroll-mt-[120px] md:scroll-mt-28 mx-auto w-full max-w-6xl space-y-8 px-4 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  Features
                </p>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Everything you need to sell and track stock
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  One monthly plan covers POS, inventory, reporting, and offline sync.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                  Included modules
                </span>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] bg-white/70 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-white/5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {tabs.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`flex flex-col gap-2 rounded-[1.5rem] border px-5 py-4 text-left transition ${
                        activeTab === item.id
                        ? "border-slate-900 bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-white/10 dark:text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-400">
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      Active module
                    </p>
                    <h3 className="text-2xl font-semibold">{tab.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {tab.description}
                  </p>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {tab.cards.map((card) => (
                    <Card
                      key={card.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <CardContent className="space-y-2 p-5">
                        <p className="text-sm font-semibold">{card.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {card.body}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Faster checkout", value: "2x quicker" },
                    { label: "Fewer stockouts", value: "30% fewer" },
                    { label: "Reports ready", value: "5 min" }
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      <p className="uppercase tracking-[0.3em]">{stat.label}</p>
                      <p className="mt-2 text-lg font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <p className="uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Recent actions
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    {[
                      "Shift opened by Mali • 08:00",
                      "Inventory synced • 2 mins ago",
                      "Promo applied: Morning Set"
                    ].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <span>{item}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          Live
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="mx-auto w-full max-w-6xl space-y-6 px-4 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  Deployment
                </p>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Built for modern stores
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Flo POS works on mobile, tablet, desktop, and PWA. It runs in the cloud,
                  keeps selling offline, and auto-syncs when the internet is back.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                  Cloud + offline sync
                </span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-5">
              {deployments.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.label}
                    className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5"
                  >
                    <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                      <span className="rounded-2xl bg-slate-100 p-3 text-slate-700 dark:bg-white/10 dark:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ready on launch
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <CardContent className="space-y-3 p-0 text-sm text-slate-600 dark:text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Devices supported
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {["iPad 10th Gen+", "Android 9+", "Windows 10+", "macOS 12+"].map(
                      (device) => (
                        <span
                          key={device}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                        >
                          {device}
                        </span>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <CardContent className="space-y-3 p-0 text-sm text-slate-600 dark:text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Offline flow
                  </p>
                  <div className="space-y-2 text-sm">
                    {[
                      "Sell offline",
                      "Orders stored locally",
                      "Auto‑sync on reconnect"
                    ].map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <CardContent className="space-y-3 p-0 text-sm text-slate-600 dark:text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Security
                  </p>
                  <div className="space-y-2 text-sm">
                    {[
                      "Encrypted data in transit",
                      "Role‑based access",
                      "Daily backups"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mx-auto w-full max-w-6xl space-y-8 px-4 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  Workflow
                </p>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Your daily workflow, simplified
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Tap a scenario to preview how Flo POS guides your team.
                </p>
              </div>
              <div
                role="tablist"
                aria-label="Workflow scenarios"
                className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center rounded-[2rem] bg-slate-100/80 p-2 shadow-sm dark:bg-white/5"
              >
                {workflows.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveFlow(item.id)}
                    role="tab"
                    aria-selected={activeFlow === item.id}
                    aria-controls="workflow-panel"
                    className={`group flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] transition ${
                      activeFlow === item.id
                        ? "bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.25)] dark:bg-white dark:text-slate-900"
                        : "bg-white text-slate-500 shadow-sm hover:text-slate-900 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        activeFlow === item.id
                          ? "bg-white/15 text-white dark:bg-slate-900 dark:text-white"
                          : "bg-slate-100 text-slate-500 group-hover:text-slate-900 dark:bg-white/10 dark:text-slate-200"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div
                id="workflow-panel"
                key={flow.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                  <span>Current flow</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                    {flow.label}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {flow.steps.map((step, index) => (
                    <div
                      key={step.title}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  POS flow preview
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Summary
                  </p>
                  <p className="mt-2 font-medium text-slate-900 dark:text-white">
                    {flow.summary}
                  </p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {flow.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      <p className="uppercase tracking-[0.3em]">{metric.label}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["iPad Counter", "Kitchen Display", "Back Office"].map((device) => (
                    <span
                      key={device}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      {device}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="pricing" className="scroll-mt-0 md:scroll-mt-28 mx-auto w-full max-w-6xl space-y-8 px-4 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  Pricing
                </p>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Simple monthly pricing for every store
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Cancel anytime. All plans include cloud sync and offline mode.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100/80 p-1 shadow-sm dark:bg-white/5">
                {(["monthly", "yearly"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setBilling(option)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                      billing === option
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`rounded-[2rem] border ${
                    plan.highlight
                      ? "border-slate-300 bg-slate-900 text-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-white/90 dark:text-slate-900"
                      : "border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <CardContent className="space-y-5 p-6">
                    <div className="space-y-2">
                      {plan.highlight ? (
                        <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
                          Best value
                        </span>
                      ) : null}
                      <p className="text-xs uppercase tracking-[0.3em] opacity-70">
                        {plan.note}
                      </p>
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <p className="text-3xl font-semibold">{plan.price}</p>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                        Includes
                      </li>
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full rounded-2xl ${
                        plan.highlight
                          ? "bg-red-600 text-white hover:bg-red-500"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                      }`}
                      variant="default"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-6xl space-y-6 px-4 md:px-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                Testimonials
              </p>
              <h2 className="text-3xl font-semibold md:text-4xl">
                Trusted by shops and cafes
              </h2>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
              <div className="testimonial-marquee flex w-max gap-4 px-4 py-4">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <Card
                    key={`${testimonial.name}-${index}`}
                    className="w-80 rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                        <span>Store review</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                          5.0
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-red-500">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star key={starIndex} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                          {testimonial.name}
                        </p>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          Monthly plan
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="resources" className="mx-auto w-full max-w-6xl space-y-6 px-4 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  Community
                </p>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Help, training, and integrations in one place
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Everything you need to launch fast and keep staff confident.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                  New guides weekly
                </span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {resources.map((resource) => (
                <Card
                  key={resource.title}
                  className="rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{resource.title}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:bg-white/10 dark:text-slate-200">
                        Updated
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {resource.body}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      <span>Read more</span>
                      <Link
                        href="#"
                        className="text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                      >
                        Open
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="contact" className="scroll-mt-[120px] md:scroll-mt-28 mx-auto w-full max-w-6xl space-y-6 px-4 md:px-8">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  <span>Contact</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                    Response in 1 day
                  </span>
                </div>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  Talk to a Flo POS specialist
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  We will recommend the right monthly plan, devices, and onboarding path.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button className="rounded-2xl bg-red-600 text-white hover:bg-red-500">
                    Book a demo
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    Get pricing
                  </Button>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Setup", value: "1 day" },
                    { label: "Training", value: "30 min" },
                    { label: "Support", value: "7 days" }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      <p className="uppercase tracking-[0.3em]">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
                <CardContent className="space-y-4 p-6 text-sm text-slate-600 dark:text-slate-300">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      Email
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      hello@flopos.app
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      Phone
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      +66 82 555 9988
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      Location
                    </p>
                    <p>Bangkok • Remote onboarding available</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      Hours
                    </p>
                    <p>Mon–Fri • 9:00–18:00</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-200 bg-white py-10 text-sm text-slate-500 dark:border-white/10 dark:bg-[#0b0f1a] dark:text-slate-400">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Flo POS</p>
              <p className="text-xs">© 2025 Flo POS. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em]">
              <a href="#features" className="transition hover:text-slate-900 dark:hover:text-white">
                Features
              </a>
              <a href="#pricing" className="transition hover:text-slate-900 dark:hover:text-white">
                Pricing
              </a>
              <a href="#resources" className="transition hover:text-slate-900 dark:hover:text-white">
                Support
              </a>
              <a href="#contact" className="transition hover:text-slate-900 dark:hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
