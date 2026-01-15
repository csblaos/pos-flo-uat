"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Minus, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

type Product = {
  id: string;
  name: string;
  barcode: string;
  merchantId: string;
  categoryId: string;
  price: number;
  cost: number;
  stockQty: number;
  updatedAt: string;
};

type CartLine = {
  product: Product;
  qty: number;
};

const products: Product[] = [
  {
    id: "p-001",
    name: "Arabica Blend 250g",
    barcode: "8859001001",
    merchantId: "m-001",
    categoryId: "c-001",
    price: 190,
    cost: 110,
    stockQty: 28,
    updatedAt: "2024-05-20"
  },
  {
    id: "p-002",
    name: "Cold Brew Bottle",
    barcode: "8859001002",
    merchantId: "m-001",
    categoryId: "c-002",
    price: 120,
    cost: 68,
    stockQty: 16,
    updatedAt: "2024-05-20"
  },
  {
    id: "p-003",
    name: "Oat Milk 1L",
    barcode: "8859001003",
    merchantId: "m-001",
    categoryId: "c-003",
    price: 95,
    cost: 52,
    stockQty: 42,
    updatedAt: "2024-05-19"
  },
  {
    id: "p-004",
    name: "Butter Croissant",
    barcode: "8859001004",
    merchantId: "m-001",
    categoryId: "c-004",
    price: 65,
    cost: 32,
    stockQty: 14,
    updatedAt: "2024-05-19"
  }
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);

export default function PosPage() {
  const [barcode, setBarcode] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.product.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id ? { ...line, qty: line.qty + 1 } : line
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleScan = () => {
    if (!barcode.trim()) return;
    const product = products.find((item) => item.barcode === barcode.trim());
    if (product) {
      handleAddToCart(product);
    }
    setBarcode("");
    inputRef.current?.focus();
  };

  const adjustQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) =>
          line.product.id === id ? { ...line, qty: Math.max(1, line.qty + delta) } : line
        )
        .filter((line) => line.qty > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((line) => line.product.id !== id));
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.product.price * line.qty, 0),
    [cart]
  );

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const query = search.toLowerCase();
    return products.filter(
      (item) => item.name.toLowerCase().includes(query) || item.barcode.includes(query)
    );
  }, [search]);

  const confirmSale = () => {
    setCart([]);
    setIsCheckoutOpen(false);
    setToast("Sale completed. Receipt sent to queue.");
    window.setTimeout(() => setToast(null), 2400);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="surface-card">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">POS</p>
              <CardTitle className="font-display text-2xl text-white">Fast Checkout</CardTitle>
            </div>
            <Badge variant="secondary">Live Scan</Badge>
          </div>
          <p className="text-sm text-white/60">
            Always-on barcode entry with a touch-friendly fallback search.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Scan Barcode</label>
            <Input
              ref={inputRef}
              className="h-12 text-lg"
              placeholder="Scan or type barcode, then press Enter"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleScan();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Search Product</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                className="h-11 pl-9"
                placeholder="Find by name or barcode"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {filteredProducts.slice(0, 4).map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                  onClick={() => handleAddToCart(product)}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{product.name}</p>
                    <p className="text-xs text-white/50">{product.barcode}</p>
                  </div>
                  <span className="text-sm font-semibold text-cyan-300">
                    {formatCurrency(product.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="surface-muted border-dashed p-4">
              <p className="text-xs font-semibold text-white/50">Scanner tips</p>
              <p className="mt-2 text-sm text-white">HID barcode + Enter works best.</p>
            </div>
            <div className="surface-muted border-dashed p-4">
              <p className="text-xs font-semibold text-white/50">Shift status</p>
              <p className="mt-2 text-sm text-white">2 terminals active now.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="surface-card">
        <CardHeader className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Cart</p>
            <CardTitle className="font-display text-xl text-white">Current Sale</CardTitle>
          </div>
          <Badge variant="secondary">{cart.length} items</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/50">
              Scan a product to start a sale.
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((line) => (
                <div
                  key={line.product.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{line.product.name}</p>
                    <p className="text-xs text-white/50">
                      {formatCurrency(line.product.price)} • {line.product.barcode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => adjustQty(line.product.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center text-sm font-semibold text-white">
                      {line.qty}
                    </span>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => adjustQty(line.product.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(line.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm font-semibold text-white">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-white/50">Taxes included. Auto-updates offline.</p>
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
          >
            Checkout
          </Button>
        </CardContent>
      </Card>

      <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Checkout</SheetTitle>
            <SheetDescription>Select payment method and confirm sale.</SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </Select>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-white/50">Receipt will be queued for sync.</p>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="secondary" onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSale}>
              <CheckCircle2 className="h-4 w-4" />
              Confirm Sale
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-4 py-2 text-xs text-emerald-200">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
