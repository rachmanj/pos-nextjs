import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface Params {
  params: {
    id: string;
  };
}

// Get a single inventory item
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await Promise.resolve(params.id);
    const item = await db.inventory.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update an inventory item
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await Promise.resolve(params.id);
    const body = await req.json();
    const {
      itemCode,
      barcode,
      itemDesc,
      salePrice,
      costPrice,
      stock,
      categoryId,
      supplier,
    } = body;

    // Check if item exists
    const existingItem = await db.inventory.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Check if the new itemCode already exists (and it's not the current item)
    if (itemCode !== existingItem.itemCode) {
      const duplicateItem = await db.inventory.findUnique({
        where: { itemCode },
      });

      if (duplicateItem) {
        return NextResponse.json(
          { message: "Item code already exists" },
          { status: 400 }
        );
      }
    }

    const updatedItem = await db.inventory.update({
      where: { id },
      data: {
        itemCode,
        barcode,
        itemDesc,
        salePrice,
        costPrice,
        stock,
        categoryId,
        supplier,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete an inventory item
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await Promise.resolve(params.id);

    // Check if item exists
    const existingItem = await db.inventory.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    await db.inventory.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Inventory item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
