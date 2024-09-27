import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parkingRequests = await db.collection('parkings')
      .aggregate([
        { $match: { date: today, status: 'pending' } },
        { $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $sort: { 'user.tokens': -1, 'user.distance': -1 } }
      ])
      .toArray();

    const availableSpots = 8;
    const allottedParkings = parkingRequests.slice(0, availableSpots);

    // Update allotted parkings
    await Promise.all(allottedParkings.map(parking => 
      db.collection('parkings').updateOne(
        { _id: parking._id },
        { $set: { status: 'approved' } }
      )
    ));

    // Reject remaining requests
    await db.collection('parkings').updateMany(
      { date: today, status: 'pending' },
      { $set: { status: 'rejected' } }
    );

    const allotments = allottedParkings.map(parking => ({
      userId: parking.user._id,
      userName: parking.user.name,
      area: parking.area,
      date: parking.date
    }));

    return NextResponse.json(allotments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while allocating parking' }, { status: 500 });
  }
}
