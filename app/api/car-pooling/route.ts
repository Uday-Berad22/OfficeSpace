import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function POST(req: Request) {
  const { userId, date, isDriver, route } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ _id:(userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.collection('carpools').insertOne({
      driver: isDriver ? (userId) : null,
      passengers: isDriver ? [] : [(userId)],
      date: new Date(date),
      route,
    });

    return NextResponse.json({ message: 'Car pooling request submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while submitting car pooling request' }, { status: 500 });
  }
}
