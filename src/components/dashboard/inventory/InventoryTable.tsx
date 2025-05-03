"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Inventory } from "@/lib/types";
import { ChevronLeft, ChevronRight, PlusIcon, SearchIcon } from "lucide-react";
import InventoryCreateDialog from "./InventoryCreateDialog";
import InventoryEditDialog from "./InventoryEditDialog";
import InventoryDeleteDialog from "./InventoryDeleteDialog";

// Extended interface to include creator
interface InventoryWithCreator extends Inventory {
  creator?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
}

interface PaginatedInventory {
  items: InventoryWithCreator[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function InventoryTable() {
  const [inventoryData, setInventoryData] = useState<PaginatedInventory>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [inventory, setInventory] = useState<InventoryWithCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryWithCreator | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  // Fetch inventory data
  const fetchInventory = async (page = 1, pageSize = 10) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/inventory?page=${page}&pageSize=${pageSize}`,
        {
          credentials: "include", // This includes cookies with the request
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }
      const data = await response.json();
      setInventoryData(data);
      setInventory(data.items);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(currentPage);
  }, [currentPage]);

  // Filter inventory based on search term
  const filteredInventory = inventory.filter(
    (item) =>
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.barcode &&
        item.barcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category?.name &&
        item.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.supplier &&
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.creator?.name &&
        item.creator.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handlers for dialogs
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchInventory(currentPage);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    fetchInventory(currentPage);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    fetchInventory(currentPage);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleNextPage = () => {
    if (currentPage < inventoryData.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>Manage your inventory items here</CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        <div className="flex items-center mt-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading inventory...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{item.barcode || "-"}</TableCell>
                      <TableCell>{item.itemDesc}</TableCell>
                      <TableCell>{formatCurrency(item.salePrice)}</TableCell>
                      <TableCell>{formatCurrency(item.costPrice)}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.category?.name || "-"}</TableCell>
                      <TableCell>{item.supplier || "-"}</TableCell>
                      <TableCell>{item.creator?.name || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {searchTerm
            ? `${filteredInventory.length} result${
                filteredInventory.length === 1 ? "" : "s"
              }`
            : `Showing ${
                (currentPage - 1) * inventoryData.pageSize + 1
              }-${Math.min(
                currentPage * inventoryData.pageSize,
                inventoryData.totalCount
              )} of ${inventoryData.totalCount} items`}
        </div>
        {!searchTerm && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {inventoryData.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === inventoryData.totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>

      {/* Create Dialog */}
      <InventoryCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Dialog */}
      {selectedItem && (
        <InventoryEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
          inventory={selectedItem}
        />
      )}

      {/* Delete Dialog */}
      {selectedItem && (
        <InventoryDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
          inventory={selectedItem}
        />
      )}
    </Card>
  );
}
