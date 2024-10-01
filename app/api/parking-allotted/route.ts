import {  NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { Db, ObjectId } from 'mongodb';

interface Booking {
  _id: ObjectId;
  user_id: string;
  created_at: Date;
  status: string;
}

interface User {
  user_id: string;
  weekly_token: number;
  monthly_token: number;
  distance: number;
}

interface Allocation {
  user_id: string;
  parking_spot: string;
  booking_id: ObjectId;
}

export async function POST() {
  try {
    const db = await getDatabase();

    // Get all pending bookings
    const pendingBookings: Booking[] = await db.collection('bookings')
      .find({ status: 'pending' })
      .toArray() as Booking[];

    // Get available parking spots
    const availableSpots = 8; // Assuming 8 spots are available

    // Sort bookings by priority
    const sortedBookings = await sortBookingsByPriority(db, pendingBookings);

    // Allocate parking spots
    const allocations: Allocation[] = sortedBookings.slice(0, availableSpots).map((booking, index) => ({
      user_id: booking.user_id,
      parking_spot: `Spot ${index + 1}`,
      booking_id: booking._id
    }));

    // Update bookings and create allocations
    await Promise.all([
      ...allocations.map((allocation: Allocation) => 
        db.collection('bookings').updateOne(
          { _id: allocation.booking_id },
          { $set: { status: 'allocated' } }
        )
      ),
      db.collection('allocations').insertMany(allocations)
    ]);

    return NextResponse.json({ message: 'Parking allocated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error allocating parking' }, { status: 500 });
  }
}

async function sortBookingsByPriority(db: Db, bookings: Booking[]): Promise<Booking[]> {
  const userIds = bookings.map(booking => booking.user_id);
  const users: User[] = await db.collection('users')
    .find({ user_id: { $in: userIds } })
    .toArray() as unknown as User[];

  const userMap: { [key: string]: User } = users.reduce((map: { [key: string]: User }, user: User) => {
    map[user.user_id] = user;
    return map;
  }, {});

  return bookings.sort((a: Booking, b: Booking) => {
    const userA = userMap[a.user_id];
    const userB = userMap[b.user_id];

    // Priority 1: Token availability
    if (userA.weekly_token > 0 || userA.monthly_token > 0) {
      if (userB.weekly_token === 0 && userB.monthly_token === 0) {
        return -1;
      }
    } else if (userB.weekly_token > 0 || userB.monthly_token > 0) {
      return 1;
    }

    // Priority 2: Distance
    return userB.distance - userA.distance;
  });
}