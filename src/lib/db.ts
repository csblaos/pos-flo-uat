import Dexie, { type Table } from "dexie";

export type UUID = string;

export interface Merchant {
  id: UUID;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: UUID;
  merchant_id: UUID;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: UUID;
  merchant_id: UUID;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: UUID;
  code: string;
  feature: string;
  action: "view" | "create" | "update" | "delete";
}

export interface RolePermission {
  id: UUID;
  role_id: UUID;
  permission_id: UUID;
}

export interface UserRole {
  id: UUID;
  user_id: UUID;
  role_id: UUID;
}

export interface Category {
  id: UUID;
  merchant_id: UUID;
  name: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Product {
  id: UUID;
  merchant_id: UUID;
  name: string;
  barcode?: string | null;
  current_sell_price: number;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ProductLot {
  id: UUID;
  product_id: UUID;
  qty_in: number;
  qty_remaining: number;
  cost_product: number;
  cost_logistic: number;
  cost_other: number;
  tax: number;
  vat: number;
  unit_cost: number;
  received_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Sale {
  id: UUID;
  merchant_id: UUID;
  created_at: string;
  total: number;
  payment_method: "cash" | "transfer";
  paid_amount: number;
  change_amount: number;
  updated_at: string;
}

export interface SaleItem {
  id: UUID;
  sale_id: UUID;
  product_id: UUID;
  name_snapshot: string;
  barcode_snapshot?: string | null;
  sell_price_snapshot: number;
  qty: number;
  line_total: number;
}

export interface SaleItemLot {
  id: UUID;
  sale_item_id: UUID;
  product_lot_id: UUID;
  qty_from_lot: number;
  unit_cost_snapshot: number;
  cogs_total: number;
}

export interface SyncOutbox {
  id: UUID;
  merchant_id: UUID;
  entity: string;
  action: "create" | "update" | "delete";
  payload_json: string;
  created_at: string;
  retry_count: number;
  last_error?: string | null;
  request_id: string;
}

export interface SyncLog {
  id: UUID;
  merchant_id: UUID;
  status: "success" | "fail";
  message: string;
  created_at: string;
}

export interface SyncState {
  id: "sync_state";
  last_pull_at?: string | null;
  last_push_at?: string | null;
}

class PosDexie extends Dexie {
  merchants!: Table<Merchant>;
  users!: Table<User>;
  roles!: Table<Role>;
  permissions!: Table<Permission>;
  role_permissions!: Table<RolePermission>;
  user_roles!: Table<UserRole>;
  categories!: Table<Category>;
  products!: Table<Product>;
  product_lots!: Table<ProductLot>;
  sales!: Table<Sale>;
  sale_items!: Table<SaleItem>;
  sale_item_lots!: Table<SaleItemLot>;
  sync_outbox!: Table<SyncOutbox>;
  sync_logs!: Table<SyncLog>;
  sync_state!: Table<SyncState>;

  constructor() {
    super("pos_flo");
    this.version(1).stores({
      merchants: "id",
      users: "id, merchant_id",
      roles: "id, merchant_id",
      permissions: "id, feature, action",
      role_permissions: "id, role_id, permission_id",
      user_roles: "id, user_id, role_id",
      categories: "id, merchant_id, updated_at, deleted_at",
      products: "id, merchant_id, barcode, updated_at, deleted_at",
      product_lots: "id, product_id, received_at, updated_at, deleted_at",
      sales: "id, merchant_id, created_at, updated_at",
      sale_items: "id, sale_id, product_id",
      sale_item_lots: "id, sale_item_id, product_lot_id",
      sync_outbox: "id, merchant_id, entity, created_at, retry_count",
      sync_logs: "id, merchant_id, created_at, status",
      sync_state: "id"
    });
  }
}

export const db = typeof window === "undefined" ? null : new PosDexie();
