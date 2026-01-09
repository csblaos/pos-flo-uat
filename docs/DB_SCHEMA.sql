-- Turso (SQLite) schema for POS Flo

PRAGMA foreign_keys = ON;

CREATE TABLE merchants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE permissions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  feature TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ("view", "create", "update", "delete"))
);

CREATE TABLE role_permissions (
  id TEXT PRIMARY KEY,
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  barcode TEXT,
  current_sell_price REAL NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE product_lots (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  qty_in REAL NOT NULL,
  qty_remaining REAL NOT NULL,
  cost_product REAL NOT NULL,
  cost_logistic REAL NOT NULL,
  cost_other REAL NOT NULL,
  tax REAL NOT NULL,
  vat REAL NOT NULL,
  unit_cost REAL NOT NULL,
  received_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  total REAL NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ("cash", "transfer")),
  paid_amount REAL NOT NULL,
  change_amount REAL NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE sale_items (
  id TEXT PRIMARY KEY,
  sale_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  name_snapshot TEXT NOT NULL,
  barcode_snapshot TEXT,
  sell_price_snapshot REAL NOT NULL,
  qty REAL NOT NULL,
  line_total REAL NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE sale_item_lots (
  id TEXT PRIMARY KEY,
  sale_item_id TEXT NOT NULL,
  product_lot_id TEXT NOT NULL,
  qty_from_lot REAL NOT NULL,
  unit_cost_snapshot REAL NOT NULL,
  cogs_total REAL NOT NULL,
  FOREIGN KEY (sale_item_id) REFERENCES sale_items(id),
  FOREIGN KEY (product_lot_id) REFERENCES product_lots(id)
);

CREATE TABLE sync_requests (
  request_id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE sync_logs (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ("success", "fail")),
  message TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE INDEX idx_products_merchant_updated ON products(merchant_id, updated_at);
CREATE INDEX idx_product_lots_product_received ON product_lots(product_id, received_at);
CREATE INDEX idx_sales_merchant_created ON sales(merchant_id, created_at);
