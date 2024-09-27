import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function POST(req: Request) {
  const { userId, subject, description } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ _id:(userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.collection('complaints').insertOne({
      user:(userId),
      subject,
      description,
      date: new Date(),
      status: 'open'
    });

    return NextResponse.json({ message: 'Complaint submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while submitting the complaint' }, { status: 500 });
  }
}