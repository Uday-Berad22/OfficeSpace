import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, User } from '@/lib/database';
import { currentUser } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const temp = await currentUser();
    
    if(!temp) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = await db.collection<User>('users').findOne({ email: temp.emailAddresses[0].emailAddress });

    if(!user) {
      // If user is not found, create a new user
      await db.collection<User>('users').insertOne({
        email: temp.emailAddresses[0].emailAddress,
        user_id: temp.id,
        access_level: 'user',
        name: temp.fullName || "User",
        used_tokens: 0,
      });

    }
    const { arrivalTime, departureTime,  wantToCarPool, availableSeats } = await req.json();


    // Get user from database based on Clerk userId
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create booking
    const bookingResult = await db.collection('bookings').insertOne({
      email: temp.emailAddresses[0].emailAddress,
      arrivalTime,
      departureTime,
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
      { email: temp.emailAddresses[0].emailAddress },
      {
        $inc: {
          used_tokens: 1,
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
      used_tokens: user.used_tokens + 1,
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating booking' }, { status: 500 });
  }
}