import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get pagination parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    // Get total count
    const totalCount = await db.inventory.count();

    // Get paginated inventory items with creator info
    const inventory = await db.inventory.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: pageSize,
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

    return NextResponse.json({
      items: inventory,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    // Check if item code already exists
    const existingItem = await db.inventory.findUnique({
      where: { itemCode },
    });

    if (existingItem) {
      return NextResponse.json(
        { message: "Item code already exists" },
        { status: 400 }
      );
    }

    // Create with user info
    const newItem = await db.inventory.create({
      data: {
        itemCode,
        barcode,
        itemDesc,
        salePrice,
        costPrice,
        stock,
        supplier,
        createdById: session.user.id,
        categoryId,
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

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
