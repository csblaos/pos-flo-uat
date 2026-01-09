"use client";

import { useEffect, useRef, useState } from "react";
import { db, type Product } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CartLine {
  product: Product;
  qty: number;
}

export default function PosPage() {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addToCart = (product: Product) => {
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

  const handleScan = async () => {
    if (!barcode.trim() || !db) return;
    const product = await db.products.where("barcode").equals(barcode.trim()).first();
    if (product) {
      addToCart(product);
    }
    setBarcode("");
    inputRef.current?.focus();
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <Card className="glass-panel">
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wave-500">POS</p>
              <CardTitle className="font-display text-2xl text-ink-800">ขายสินค้าเร็ว ๆ</CardTitle>
            </div>
            <Badge variant="secondary">Quick Scan</Badge>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-ink-400">
            <span className="chip">Offline-ready</span>
            <span className="chip">FIFO Lots</span>
            <span className="chip">Auto sync</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-ink-600">สแกนบาร์โค้ด</label>
            <Input
              ref={inputRef}
              className="h-12 text-lg"
              placeholder="ยิงบาร์โค้ดหรือพิมพ์รหัสสินค้าแล้ว Enter"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleScan();
                }
              }}
            />
            <div className="flex flex-wrap gap-2 text-xs text-ink-400">
              <Badge variant="secondary">HID Keyboard</Badge>
              <span>ยิงบาร์โค้ดแล้ว Enter เพื่อเพิ่มเข้าตะกร้า</span>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="stat-card border-dashed">
              <p className="text-xs font-semibold text-ink-500">สินค้าแนะนำ</p>
              <p className="mt-2 text-sm font-semibold text-ink-700">ขายดีวันนี้</p>
              <p className="mt-1 text-xs text-ink-400">แสดงรายการขายดี/ล่าสุดที่ sync แล้ว</p>
            </div>
            <div className="stat-card border-dashed">
              <p className="text-xs font-semibold text-ink-500">คีย์ลัด</p>
              <p className="mt-2 text-sm font-semibold text-ink-700">ยิงแล้วขึ้นทันที</p>
              <p className="mt-1 text-xs text-ink-400">รองรับ HID Keyboard: ยิงบาร์โค้ดแล้ว Enter</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="glass-panel">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wave-500">Cart</p>
            <CardTitle className="font-display text-xl text-ink-800">ตะกร้าสินค้า</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{cart.length} รายการ</Badge>
            <Button className="rounded-full">Checkout</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-400">
              ยังไม่มีสินค้าในตะกร้า
            </div>
          ) : (
            cart.map((line) => (
              <div key={line.product.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-700">{line.product.name}</p>
                  <p className="text-xs text-ink-400">฿{line.product.current_sell_price}</p>
                </div>
                <Badge variant="secondary">x{line.qty}</Badge>
              </div>
            ))
          )}
          <div className="stat-card">
            <div className="flex items-center justify-between text-sm font-semibold text-ink-700">
              <span>รวมสุทธิ</span>
              <span>฿0.00</span>
            </div>
            <p className="mt-1 text-xs text-ink-400">อัปเดตทันทีแม้ Offline</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
