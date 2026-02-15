import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, desc, getUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");

    if (!contactId) {
      return NextResponse.json({ error: "contactId query param required" }, { status: 400 });
    }

    // Verify contact ownership
    const contact = await database
      .select()
      .from(schema.contacts)
      .where(eq(schema.contacts.id, contactId))
      .then((r) => r[0]);

    if (!contact || contact.userId !== userId) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const activities = await database
      .select()
      .from(schema.contactActivities)
      .where(eq(schema.contactActivities.contactId, contactId))
      .orderBy(desc(schema.contactActivities.createdAt));

    return NextResponse.json({ activities });
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

    const { contactId, type, subject, content, metadata, scheduledAt } = body;

    if (!contactId) {
      return NextResponse.json({ error: "contactId required" }, { status: 400 });
    }

    // Verify contact ownership
    const contact = await database
      .select()
      .from(schema.contacts)
      .where(eq(schema.contacts.id, contactId))
      .then((r) => r[0]);

    if (!contact || contact.userId !== userId) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const activity = await database
      .insert(schema.contactActivities)
      .values({
        contactId,
        userId,
        type,
        subject,
        content,
        metadata,
        scheduledAt,
      })
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
