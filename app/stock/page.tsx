"use client";

import { useMemo, useState } from "react";
import { Edit3, PackagePlus, RefreshCw, Search, TriangleAlert } from "lucide-react";
import { useNetworkStatus } from "@/lib/ui/use-network";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Merchant = { id: string; name: string };
type Category = { id: string; name: string; merchantId: string };
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

const merchants: Merchant[] = [
  { id: "m-001", name: "Flo Market - Central" },
  { id: "m-002", name: "Flo Market - Riverside" }
];

const categories: Category[] = [
  { id: "c-001", name: "Coffee", merchantId: "m-001" },
  { id: "c-002", name: "Ready Drinks", merchantId: "m-001" },
  { id: "c-003", name: "Dairy", merchantId: "m-001" }
];

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
    stockQty: 6,
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
    stockQty: 3,
    updatedAt: "2024-05-19"
  },
  {
    id: "p-004",
    name: "Butter Croissant",
    barcode: "8859001004",
    merchantId: "m-001",
    categoryId: "c-002",
    price: 65,
    cost: 32,
    stockQty: 22,
    updatedAt: "2024-05-19"
  }
];

export default function StockPage() {
  const network = useNetworkStatus();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (item) => item.name.toLowerCase().includes(query) || item.barcode.includes(query)
    );
  }, [search]);

  return (
    <div className="grid gap-6">
      <Card className="surface-card">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Stock</p>
            <CardTitle className="font-display text-2xl text-white">Inventory & Lots</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled={!network.online}>
              <RefreshCw className="h-4 w-4" />
              Sync
            </Button>
            <Button size="sm">
              <PackagePlus className="h-4 w-4" />
              Import CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="surface-muted p-4">
              <p className="text-xs font-semibold text-white/50">Total Products</p>
              <p className="mt-2 text-2xl font-semibold text-white">412</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-xs font-semibold text-white/50">Low Stock</p>
              <p className="mt-2 text-2xl font-semibold text-white">8</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-xs font-semibold text-white/50">Stock Value</p>
              <p className="mt-2 text-2xl font-semibold text-white">THB 182,000</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-white">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                className="h-11 pl-9"
                placeholder="Search name or barcode"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 md:hidden">
            {filteredProducts.map((product) => {
              const lowStock = product.stockQty <= 5;
              return (
                <button
                  key={product.id}
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                  onClick={() => setDetailProduct(product)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{product.name}</p>
                      <p className="text-xs text-white/50">{product.barcode}</p>
                    </div>
                    <Badge variant={lowStock ? "destructive" : "secondary"}>
                      {product.stockQty} pcs
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                    <span>THB {product.price}</span>
                    {lowStock ? (
                      <span className="flex items-center gap-1 text-amber-200">
                        <TriangleAlert className="h-3 w-3" />
                        Low stock
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const lowStock = product.stockQty <= 5;
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-semibold text-white">{product.name}</TableCell>
                      <TableCell>{product.barcode}</TableCell>
                      <TableCell>
                        <Badge variant={lowStock ? "destructive" : "secondary"}>
                          {product.stockQty} pcs
                        </Badge>
                      </TableCell>
                      <TableCell>THB {product.price}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setDetailProduct(product)}
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="fixed bottom-24 right-4 z-40 rounded-full shadow-lg md:bottom-8 md:right-8"
        onClick={() => setAddOpen(true)}
      >
        + Add Product
      </Button>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <label className="text-sm font-semibold text-white">Name</label>
              <Input placeholder="Required" />
              <p className="mt-1 text-xs text-white/50">Required</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-white">Barcode</label>
              <Input placeholder="Required" />
              <p className="mt-1 text-xs text-white/50">Required</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-white">Merchant</label>
              <Select defaultValue={merchants[0]?.id ?? ""}>
                {merchants.map((merchant) => (
                  <SelectItem key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </SelectItem>
                ))}
              </Select>
              <p className="mt-1 text-xs text-white/50">Required</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-white">Category</label>
              <Select defaultValue={categories[0]?.id ?? ""}>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-white">Price</label>
                <Input placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-semibold text-white">Cost</label>
                <Input placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-white">Stock Qty</label>
              <Input placeholder="0" />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(detailProduct)}
        onOpenChange={(open) => {
          if (!open) setDetailProduct(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Detail</DialogTitle>
          </DialogHeader>
          {detailProduct ? (
            <div className="grid gap-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-white">Name</label>
                  <Input defaultValue={detailProduct.name} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-white">Barcode</label>
                  <Input defaultValue={detailProduct.barcode} />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-white">Price</label>
                  <Input defaultValue={String(detailProduct.price)} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-white">Cost (Product)</label>
                  <Input defaultValue={String(detailProduct.cost)} />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-white">Logistic Cost</label>
                  <Input placeholder="Optional" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-white">Other Cost</label>
                  <Input placeholder="Optional" />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Adjust Stock</p>
                <div className="mt-3 grid gap-2 md:grid-cols-[1fr_1fr]">
                  <Button variant="secondary">Import</Button>
                  <Button variant="secondary">Export</Button>
                </div>
                <div className="mt-3">
                  <label className="text-sm font-semibold text-white">Qty</label>
                  <Input placeholder="0" />
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter className="mt-6">
            <Button variant="secondary" onClick={() => setDetailProduct(null)}>
              Close
            </Button>
            <Button>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
