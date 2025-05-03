"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Category } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, PlusCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
  CommandList,
} from "@/components/ui/command";

const formSchema = z.object({
  itemCode: z.string().min(1, "Item code is required"),
  barcode: z.string().optional(),
  itemDesc: z.string().min(1, "Description is required"),
  salePrice: z.coerce.number().positive("Sale price must be positive"),
  costPrice: z.coerce.number().positive("Cost price must be positive"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  categoryId: z.string().optional(),
  supplier: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InventoryCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function InventoryCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: InventoryCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemCode: "",
      barcode: "",
      itemDesc: "",
      salePrice: 0,
      costPrice: 0,
      stock: 0,
      categoryId: "",
      supplier: "",
    },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);

      // If there's a new category name, create the category first
      if (newCategoryName) {
        const categoryResponse = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: newCategoryName,
          }),
        });

        if (categoryResponse.ok) {
          const newCategory = await categoryResponse.json();
          data.categoryId = newCategory.id;
          setNewCategoryName("");
          setShowNewCategoryInput(false);
        } else {
          const error = await categoryResponse.json();
          throw new Error(error.message || "Failed to create category");
        }
      }

      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create inventory item");
      }

      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newCategoryName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create category");
      }

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      form.setValue("categoryId", newCategory.id);
      setNewCategoryName("");
      setShowNewCategoryInput(false);
      setPopoverOpen(false);

      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Create a new inventory item with the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="itemCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="ITM001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="itemDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Item description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category Selection with Create New Option */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={() => setPopoverOpen(true)}
                        >
                          {field.value
                            ? categories.find(
                                (category) => category.id === field.value
                              )?.name
                            : "Select category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      {/* Search Input */}
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Search categories..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      {/* Categories List */}
                      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        {/* No Results */}
                        {categories.filter((category) =>
                          category.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                          <div className="py-6 text-center text-sm">
                            No category found.
                            <div className="mt-2 px-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => {
                                  setNewCategoryName(searchTerm);
                                  setShowNewCategoryInput(true);
                                  setPopoverOpen(false);
                                }}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create "{searchTerm}"
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Categories */}
                        <div className="overflow-hidden p-1 text-foreground">
                          {categories.filter((category) =>
                            category.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ).length > 0 && (
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                              Categories
                            </div>
                          )}
                          {categories
                            .filter((category) =>
                              category.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            )
                            .map((category) => (
                              <div
                                key={category.id}
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                  category.id === field.value &&
                                    "bg-accent text-accent-foreground"
                                )}
                                onClick={() => {
                                  field.onChange(category.id);
                                  setPopoverOpen(false);
                                }}
                              >
                                {category.name}
                                {category.id === field.value && (
                                  <Check className="h-4 w-4" />
                                )}
                              </div>
                            ))}
                        </div>

                        {/* Create New Option */}
                        {categories.filter((category) =>
                          category.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        ).length > 0 && (
                          <>
                            <div className="-mx-1 h-px bg-border my-1"></div>
                            <div
                              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground mx-1"
                              onClick={() => {
                                setNewCategoryName(searchTerm);
                                setShowNewCategoryInput(true);
                                setPopoverOpen(false);
                              }}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Create new category
                            </div>
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Category Input */}
            {showNewCategoryInput && (
              <div className="flex flex-col gap-2">
                <FormLabel>New Category Name</FormLabel>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter new category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCreateNewCategory}
                    disabled={!newCategoryName || isLoading}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategoryName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
