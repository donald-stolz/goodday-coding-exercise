-- CreateTable
CREATE TABLE "items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parent_item_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    CONSTRAINT "items_parent_item_id_fkey" FOREIGN KEY ("parent_item_id") REFERENCES "parent_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parent_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "purchase_order_line_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "purchase_order_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_cost" DECIMAL NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    CONSTRAINT "purchase_order_line_items_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendor_name" TEXT NOT NULL,
    "order_date" DATETIME NOT NULL,
    "expected_delivery_date" DATETIME NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME
);
