import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, desc, getUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const vouchers = await database
      .select()
      .from(schema.vouchers)
      .where(eq(schema.vouchers.userId, userId))
      .orderBy(desc(schema.vouchers.createdAt));

    return NextResponse.json({ vouchers });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);
    const body = await request.json();

    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      minOrderValue,
      expiresAt,
      isActive,
      targetAudience,
      targetEmails,
    } = body;

    const voucher = await database
      .insert(schema.vouchers)
      .values({
        userId,
        code,
        description,
        discountType: discountType || "percentage",
        discountValue,
        maxUses: maxUses || 100,
        minOrderValue: minOrderValue || 0,
        expiresAt,
        isActive: isActive !== false,
        targetAudience: targetAudience || "all",
        targetEmails,
      })
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ voucher }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);
    const body = await request.json();

    const {
      id,
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      minOrderValue,
      expiresAt,
      isActive,
      targetAudience,
      targetEmails,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Voucher id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.vouchers)
      .where(eq(schema.vouchers.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const voucher = await database
      .update(schema.vouchers)
      .set({
        code,
        description,
        discountType,
        discountValue,
        maxUses,
        minOrderValue,
        expiresAt,
        isActive,
        targetAudience,
        targetEmails,
      })
      .where(eq(schema.vouchers.id, id))
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ voucher });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Voucher id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.vouchers)
      .where(eq(schema.vouchers.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Deactivate instead of delete
    const voucher = await database
      .update(schema.vouchers)
      .set({ isActive: false })
      .where(eq(schema.vouchers.id, id))
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ voucher });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
