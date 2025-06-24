/*
  Warnings:

  - Made the column `vendor_email` on table `purchase_orders` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_purchase_orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendor_name" TEXT NOT NULL,
    "vendor_email" TEXT NOT NULL,
    "order_date" DATETIME NOT NULL,
    "expected_delivery_date" DATETIME NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'new'
);
INSERT INTO "new_purchase_orders" ("created_at", "expected_delivery_date", "id", "order_date", "updated_at", "vendor_email", "vendor_name") SELECT "created_at", "expected_delivery_date", "id", "order_date", "updated_at", "vendor_email", "vendor_name" FROM "purchase_orders";
DROP TABLE "purchase_orders";
ALTER TABLE "new_purchase_orders" RENAME TO "purchase_orders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
