import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const { user_id, subject, description } = await req.json();

    const complaint = {
      user_id,
      subject,
      description,
      created_at: new Date(),
      status: 'open'
    };

    await db.collection('complaints').insertOne(complaint);
    return NextResponse.json({ message: 'Complaint submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error submitting complaint' }, { status: 500 });
  }
}