import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function POST(req: Request) {
  const { userId, date, area } = await req.json();
    console.log(date);
  // Check if the current time is between 8 PM and 12 AM
  const now = new Date();
  const currentHour = now.getHours();
  if (currentHour < 20 || currentHour >= 24) {
    return NextResponse.json({ error: 'Booking is only allowed between 8 PM and 12 AM' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("parking");

    const user = await db.collection('users').findOne({ _id: (userId) });
    console.log(user);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.tokens <= 0) {
      return NextResponse.json({ error: 'No tokens available' }, { status: 400 });
    }

    await db.collection('parkings').insertOne({
        user: (userId),
      date: new Date(date),
      area: parseInt(area),
      status: 'pending',
      createdAt: new Date()
    });

    await db.collection('users').updateOne(
      { _id: (userId) },
      { $inc: { tokens: -1 } }
    );

    return NextResponse.json({ message: 'Parking booked successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while booking parking' }, { status: 500 });
  }
}
