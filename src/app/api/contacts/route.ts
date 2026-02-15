import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, desc, and, or, ilike, getUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let conditions = [eq(schema.contacts.userId, userId)];

    if (status) {
      conditions.push(eq(schema.contacts.status, status));
    }

    if (search) {
      conditions.push(
        or(ilike(schema.contacts.name, `%${search}%`), ilike(schema.contacts.email, `%${search}%`))
      );
    }

    const contacts = await database
      .select()
      .from(schema.contacts)
      .where(and(...conditions))
      .orderBy(desc(schema.contacts.createdAt));

    return NextResponse.json({ contacts });
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

    const { name, email, phone, company, status, source, tags } = body;

    const contact = await database
      .insert(schema.contacts)
      .values({
        userId,
        name,
        email,
        phone,
        company,
        status: status || "lead",
        source,
        tags,
      })
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ contact }, { status: 201 });
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

    const { id, name, email, phone, company, status, source, tags, totalSpent, lastVisit, notes } =
      body;

    if (!id) {
      return NextResponse.json({ error: "Contact id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.contacts)
      .where(eq(schema.contacts.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contact = await database
      .update(schema.contacts)
      .set({
        name,
        email,
        phone,
        company,
        status,
        source,
        tags,
        totalSpent,
        lastVisit,
        notes,
        updatedAt: new Date(),
      })
      .where(eq(schema.contacts.id, id))
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ contact });
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
      return NextResponse.json({ error: "Contact id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.contacts)
      .where(eq(schema.contacts.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await database.delete(schema.contacts).where(eq(schema.contacts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
