import { Metadata } from "next";
import InventoryTable from "@/components/dashboard/inventory/InventoryTable";

export const metadata: Metadata = {
  title: "Inventory Management",
  description: "Manage your store's inventory items",
};

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Inventory Management</h1>
        <p className="text-muted-foreground">
          Manage your inventory items, add new products, update prices, and
          track stock levels.
        </p>
      </div>
      <InventoryTable />
    </div>
  );
}
