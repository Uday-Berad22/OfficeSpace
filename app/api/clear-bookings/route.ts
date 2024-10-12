// File: app/api/clear-bookings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(req: NextRequest) {
  try {
    // Check for a secret key to ensure this route is only called by authorized services
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const db = await getDatabase();
    
    // Clear all entries from the bookings collection
    const result = await db.collection('bookings').deleteMany({});

    return NextResponse.json({ 
      message: 'All bookings cleared successfully',
      deletedCount: result.deletedCount
    }, { status: 200 });

  } catch (error) {
    console.error('Error clearing bookings:', error);
    return NextResponse.json({ error: 'Failed to clear bookings' }, { status: 500 });
  }
}