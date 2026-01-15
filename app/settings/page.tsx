"use client";

import { useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const merchants = [
  { id: "m-001", name: "Flo Market - Central" },
  { id: "m-002", name: "Flo Market - Riverside" }
];

const categories = [
  { id: "c-001", name: "Coffee", merchantId: "m-001" },
  { id: "c-002", name: "Ready Drinks", merchantId: "m-001" },
  { id: "c-003", name: "Bakery", merchantId: "m-002" }
];

const permissions = [
  { menu: "POS", rights: ["View", "Create", "Update", "Delete"] },
  { menu: "Stock", rights: ["View", "Create", "Update", "Delete"] },
  { menu: "Settings", rights: ["View", "Update"] },
  { menu: "Reports", rights: ["View"] }
];

export default function SettingsPage() {
  const [merchantDialog, setMerchantDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);

  return (
    <div className="grid gap-6">
      <Card className="surface-card">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Settings</p>
          <CardTitle className="font-display text-2xl text-white">Access & Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="merchants">
            <TabsList>
              <TabsTrigger value="merchants">Merchants</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

            <TabsContent value="merchants">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Merchant List</p>
                  <p className="text-xs text-white/50">Add or update storefront profiles.</p>
                </div>
                <Button size="sm" onClick={() => setMerchantDialog(true)}>
                  <Plus className="h-4 w-4" />
                  Add Merchant
                </Button>
              </div>
              <div className="mt-4 grid gap-3">
                {merchants.map((merchant) => (
                  <div
                    key={merchant.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{merchant.name}</p>
                      <p className="text-xs text-white/50">ID: {merchant.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary">
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Product Categories</p>
                  <p className="text-xs text-white/50">Organize by merchant and shelf.</p>
                </div>
                <Button size="sm" onClick={() => setCategoryDialog(true)}>
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
              <div className="mt-4 grid gap-3">
                {categories.map((category) => {
                  const merchantName =
                    merchants.find((merchant) => merchant.id === category.merchantId)?.name ??
                    "Unknown";
                  return (
                    <div
                      key={category.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{category.name}</p>
                        <p className="text-xs text-white/50">{merchantName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary">
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="roles">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Roles & Permissions</p>
                  <p className="text-xs text-white/50">Matrix for view/create/update/delete.</p>
                </div>
                <Badge variant="secondary">UI Placeholder</Badge>
              </div>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Menu</TableHead>
                      <TableHead>View</TableHead>
                      <TableHead>Create</TableHead>
                      <TableHead>Update</TableHead>
                      <TableHead>Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((row) => (
                      <TableRow key={row.menu}>
                        <TableCell className="font-semibold text-white">{row.menu}</TableCell>
                        {["View", "Create", "Update", "Delete"].map((right) => (
                          <TableCell key={right}>
                            <Badge variant={row.rights.includes(right) ? "secondary" : "outline"}>
                              {row.rights.includes(right) ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={merchantDialog} onOpenChange={setMerchantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Merchant</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <label className="text-sm font-semibold text-white">Merchant Name</label>
              <Input placeholder="Required" />
              <p className="mt-1 text-xs text-white/50">Required</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-white">Branch Tag</label>
              <Input placeholder="Optional" />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="secondary" onClick={() => setMerchantDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setMerchantDialog(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <label className="text-sm font-semibold text-white">Category Name</label>
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
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="secondary" onClick={() => setCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCategoryDialog(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
