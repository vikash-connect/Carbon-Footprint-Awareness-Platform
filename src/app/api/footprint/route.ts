import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Footprint, footprintSchema } from '@/lib/models/Footprint';

// Basic in-memory rate limiter logic (Use Redis for multi-instance production)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const isRateLimited = (ip: string) => {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  if (now - record.lastReset > 60000) { record.count = 0; record.lastReset = now; }
  record.count += 1;
  rateLimitMap.set(ip, record);
  return record.count > 10; // Max 10 req / minute
};

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Security
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const body = await request.json();

    // 2. Strict Input Validation via Zod (Prevents NoSQL injection / Prototype pollution)
    const validation = footprintSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data', details: validation.error.format() }, { status: 400 });
    }

    // 3. Centralized Database Connection
    await connectToDatabase();

    // 4. Save validated payload
    const newFootprint = await Footprint.create(validation.data);
    return NextResponse.json({ success: true, id: newFootprint._id }, { status: 201 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); // Obfuscated generic error for safety
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    await connectToDatabase();

    // Resource Optimization: .select() projects only necessary fields. .lean() skips Mongoose overhead.
    const footprints = await Footprint.find({ userId })
      .select('travel foodType energyUse date -_id')
      .sort({ date: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ data: footprints }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
