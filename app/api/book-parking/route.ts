import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, User } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const { arrivalTime, departureTime, specificReason, wantToCarPool, availableSeats,email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database based on Clerk userId
    const user = await db.collection<User>('users').findOne({ email: email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check weekly token limit
    if (user.weekly_token < 1) {
      return NextResponse.json({ message: 'No weekly tokens available' }, { status: 403 });
    }

    // Check monthly token limit
    if (user.monthly_token < 1) {
      return NextResponse.json({ message: 'No monthly tokens available' }, { status: 403 });
    }

    // Create booking
    const bookingResult = await db.collection('bookings').insertOne({
      email,
      arrivalTime,
      departureTime,
      specificReason,
      wantToCarPool,
      availableSeats,
      createdAt: new Date(),
      status: 'pending', // You can use this to track the booking status
    });

    if (!bookingResult.insertedId) {
      return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
    }

    // Decrement token count
    const updateResult = await db.collection<User>('users').updateOne(
      { email: email },
      {
        $inc: {
          weekly_token: -1,
          monthly_token: -1,
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      // If update fails, we should roll back the booking creation
      await db.collection('bookings').deleteOne({ _id: bookingResult.insertedId });
      return NextResponse.json({ message: 'Failed to update token count' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Booking created successfully',
      bookingId: bookingResult.insertedId,
      remainingWeeklyTokens: user.weekly_token - 1,
      remainingMonthlyTokens: user.monthly_token - 1,
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating booking' }, { status: 500 });
  }
}