import { NextRequest, NextResponse } from 'next/server';
import { database, schema, eq } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .then(r => r[0] || null);

    if (existing) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // In production, hash the password with bcrypt
    const user = await database
      .insert(schema.users)
      .values({
        name,
        email,
        password, // TODO: hash with bcrypt in production
        tier: 'basic',
      })
      .returning()
      .then(r => r[0]);

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
