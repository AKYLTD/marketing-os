import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, desc, or, gte, lte, and, getUserId, SPECIAL_DATES_2026 } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    // Get user events
    let conditions = [eq(schema.calendarEvents.userId, userId)];

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);

      conditions.push(and(gte(schema.calendarEvents.date, startDate), lte(schema.calendarEvents.date, endDate)));
    }

    const userEvents = await database
      .select()
      .from(schema.calendarEvents)
      .where(and(...conditions))
      .orderBy(desc(schema.calendarEvents.date));

    // Add special dates (no userId filter)
    let events = userEvents.map((e) => ({
      ...e,
      isSpecialDate: false,
    }));

    // Add special dates if filtering by month/year
    if (month && year) {
      const specialDatesForMonth = SPECIAL_DATES_2026.filter((d) => {
        const dateObj = new Date(d.date);
        return dateObj.getMonth() === Number(month) - 1 && dateObj.getFullYear() === Number(year);
      }).map((d) => ({
        id: `special-${d.title}`,
        userId: null,
        title: d.title,
        description: null,
        type: d.type,
        date: new Date(d.date),
        endDate: null,
        allDay: true,
        color: d.color,
        linkedPostId: null,
        linkedCampaignId: null,
        isRecurring: false,
        recurringPattern: null,
        createdAt: new Date(),
        isSpecialDate: true,
      }));

      events = [...events, ...specialDatesForMonth];
    }

    return NextResponse.json({ events });
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

    const { title, description, type, date, endDate, allDay, color, linkedPostId, linkedCampaignId } =
      body;

    const event = await database
      .insert(schema.calendarEvents)
      .values({
        userId,
        title,
        description,
        type: type || "custom",
        date,
        endDate,
        allDay: allDay !== false,
        color,
        linkedPostId,
        linkedCampaignId,
      })
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ event }, { status: 201 });
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

    const { id, title, description, type, date, endDate, allDay, color, linkedPostId, linkedCampaignId } =
      body;

    if (!id) {
      return NextResponse.json({ error: "Event id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.calendarEvents)
      .where(eq(schema.calendarEvents.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const event = await database
      .update(schema.calendarEvents)
      .set({
        title,
        description,
        type,
        date,
        endDate,
        allDay,
        color,
        linkedPostId,
        linkedCampaignId,
      })
      .where(eq(schema.calendarEvents.id, id))
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ event });
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
      return NextResponse.json({ error: "Event id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.calendarEvents)
      .where(eq(schema.calendarEvents.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await database.delete(schema.calendarEvents).where(eq(schema.calendarEvents.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
