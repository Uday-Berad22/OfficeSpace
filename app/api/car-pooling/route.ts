import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    const db = await getDatabase();
    const offers = await db.collection('car_pool_offers').find().toArray();
    return NextResponse.json(offers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching car pool offers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const { user_id, route, departure_time } = await req.json();

    const offer = {
      user_id,
      route,
      departure_time,
      created_at: new Date()
    };

    await db.collection('car_pool_offers').insertOne(offer);
    return NextResponse.json({ message: 'Car pool offer created successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating car pool offer' }, { status: 500 });
  }
}