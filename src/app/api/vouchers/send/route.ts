import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, getUserId } from "@/lib/db";
import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return null;
    _resend = new Resend(key);
  }
  return _resend;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);
    const body = await request.json();

    const { voucherId, emails } = body;

    if (!voucherId || !emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: "voucherId and emails array required" },
        { status: 400 }
      );
    }

    // Verify voucher ownership
    const voucher = await database
      .select()
      .from(schema.vouchers)
      .where(eq(schema.vouchers.id, voucherId))
      .then((r) => r[0]);

    if (!voucher || voucher.userId !== userId) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    const resend = getResend();

    if (resend) {
      // Send via Resend
      const results = [];

      for (const email of emails) {
        try {
          const response = await resend.emails.send({
            from: "noreply@marketing-os.com",
            to: email,
            subject: `Your exclusive discount code: ${voucher.code}`,
            html: `
              <h2>Special Offer for You!</h2>
              <p>You've received an exclusive discount code.</p>
              <p><strong>Code:</strong> <code style="background: #f0f0f0; padding: 8px; font-size: 18px;">${voucher.code}</code></p>
              <p>${voucher.description || "Apply this code at checkout for your discount."}</p>
              <p style="color: #666; font-size: 12px;">This offer expires on ${new Date(voucher.expiresAt || "").toLocaleDateString()}</p>
            `,
          });

          results.push({ email, success: true, messageId: response.id });
        } catch (err) {
          console.error(`Failed to send to ${email}:`, err);
          results.push({ email, success: false, error: String(err) });
        }
      }

      return NextResponse.json({ results }, { status: 200 });
    } else {
      // Mock response when no API key
      const results = emails.map((email: string) => ({
        email,
        success: true,
        messageId: `mock-${Date.now()}-${Math.random()}`,
      }));

      return NextResponse.json(
        { results, message: "Mock mode: Resend API key not configured" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
