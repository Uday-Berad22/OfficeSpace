import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const { user_id, ...bookingData } = await req.json();

    // Check if the user has available tokens
    const user = await db.collection('users').findOne({ user_id });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check weekly token limit
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weeklyBookings = await db.collection('bookings').countDocuments({
      user_id,
      created_at: { $gte: weekStart }
    });

    if (weeklyBookings >= 2) {
      return NextResponse.json({ message: 'Weekly token limit reached' }, { status: 400 });
    }

    // Check monthly token limit
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthlyBookings = await db.collection('bookings').countDocuments({
      user_id,
      created_at: { $gte: monthStart }
    });

    if (monthlyBookings >= 5) {
      return NextResponse.json({ message: 'Monthly token limit reached' }, { status: 400 });
    }

    // Create booking
    const booking = {
      user_id,
      ...bookingData,
      created_at: new Date(),
      status: 'pending'
    };
    await db.collection('bookings').insertOne(booking);

    // Decrement token count
    await db.collection('users').updateOne(
      { user_id },
      { 
        $inc: { 
          weekly_token: -1,
          monthly_token: -1
        }
      }
    );

    return NextResponse.json({ message: 'Booking created successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating booking' }, { status: 500 });
  }
}