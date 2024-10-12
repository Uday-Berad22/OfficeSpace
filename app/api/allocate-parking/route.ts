import {  NextResponse } from 'next/server';
import { getDatabase, User } from '@/lib/database';
import { ObjectId } from 'mongodb';

interface Booking {
  _id: ObjectId;
  email: string;
  arrivalTime: string;
  departureTime: string;
  wantToCarPool: boolean;
  availableSeats: number;
  status: string;
}

export async function GET() {
  try {
    const db = await getDatabase();
    const bookingsCollection = db.collection<Booking>('bookings');
    const usersCollection = db.collection<User>('users');

    // Fetch all pending bookings
    const pendingBookings = await bookingsCollection.find({ status: 'pending' }).toArray();

    // Group bookings by user
    const bookingsByUser = pendingBookings.reduce((acc, booking) => {
      if (!acc[booking.email]) {
        acc[booking.email] = [];
      }
      acc[booking.email].push(booking);
      return acc;
    }, {} as { [email: string]: Booking[] });

    // Fetch users and their token counts
    const users = await usersCollection.find({
      email: { $in: Object.keys(bookingsByUser) }
    }).toArray();

    // Sort users by token count
    users.sort((a, b) => a.used_tokens - b.used_tokens);

    const selectedBookings: Booking[] = [];
    const numParkingSpots = 8; // Adjust this based on your parking capacity

    // Select bookings based on token count
    for (const user of users) {
      if (selectedBookings.length >= numParkingSpots) break;

      const userBookings = bookingsByUser[user.email];
      if (userBookings && userBookings.length > 0) {
        // For simplicity, we're selecting the first booking for each user
        selectedBookings.push(userBookings[0]);
      }
    }

    // Update selected bookings to 'approved' status
    const bookingUpdatePromises = selectedBookings.map(booking =>
      bookingsCollection.updateOne(
        { _id: booking._id },
        { $set: { status: 'approved' } }
      )
    );

    // Increment token count for users with approved bookings
    const userUpdatePromises = selectedBookings.map(booking =>
      usersCollection.updateOne(
        { email: booking.email },
        { $inc: { used_tokens: 1 } }
      )
    );

    // Execute all updates
    await Promise.all([...bookingUpdatePromises, ...userUpdatePromises]);

    return NextResponse.json({ 
      message: `Parking allocated for ${selectedBookings.length} bookings.`,
      allocatedBookings: selectedBookings.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error in daily parking allocation:', error);
    return NextResponse.json({ message: 'Error in parking allocation' }, { status: 500 });
  }
}