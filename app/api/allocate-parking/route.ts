import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";
import { ObjectId } from "mongodb";

interface Booking {
  _id: ObjectId;
  email: string;
  arrivalTime: string;
  departureTime: string;
  wantToCarPool: boolean;
  availableSeats: number;
  status: string;
}

interface User {
  email: string;
  used_tokens: number;
}

function selectIds(users: [string, number][], numToSelect: number): string[] {
  // Sort the array based on used_tokens

  users.sort((a, b) => a[1] - b[1]);

  // Group users by used_tokens
  const groups: { [key: number]: string[] } = {};
  for (const [id, tokens] of users) {
    if (!groups[tokens]) {
      groups[tokens] = [];
    }
    groups[tokens].push(id);
  }

  const selectedIds: string[] = [];
  const tokenCounts = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b);

  for (const tokenCount of tokenCounts) {
    const group = groups[tokenCount];
    console.log("Token count: ", tokenCount);
    if (group.length + selectedIds.length <= numToSelect) {
      selectedIds.push(...group);
    } else {
      const remaining = numToSelect - selectedIds.length;
      const shuffled = group.sort(() => 0.5 - Math.random());
      selectedIds.push(...shuffled.slice(0, remaining));
    }
    if (selectedIds.length === numToSelect) {
      break;
    }
  }
  return selectedIds;
}

export async function GET(request: NextRequest) {
  //   const { APP_KEY } = process.env;
  //   const authHeader = request.headers.get("authorization");

  //   if (authHeader !== APP_KEY) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  const { APP_KEY } = process.env;

  // Get the URL of the request and parse the search parameters
  const url = new URL(request.url);
  let secret = url.searchParams.get("secret"); // Accessing the query parameter 'secret'
  if (secret?.length !== 0 && secret !== undefined && secret !== null) {
    //remove last character
    secret = secret.slice(0, -1);
  }
  // Check if the secret in the query matches the one in the .env file
  if (!secret || secret !== APP_KEY) {
    return NextResponse.json(
      { error: `Unauthorized secret :${secret} and APP_KEY : ${APP_KEY}` },
      { status: 401 }
    );
  }

  try {
    const db = await getDatabase();
    const bookingsCollection = db.collection<Booking>("bookings");
    const usersCollection = db.collection<User>("users");

    // Fetch all pending bookings
    const pendingBookings = await bookingsCollection
      .find({ status: "pending" })
      .toArray();

    // Group bookings by user
    const bookingsByUser = pendingBookings.reduce((acc, booking) => {
      if (!acc[booking.email]) {
        acc[booking.email] = [];
      }
      acc[booking.email].push(booking);
      return acc;
    }, {} as { [email: string]: Booking[] });
    // Fetch users and their token counts
    const users = await usersCollection
      .find({ email: { $in: Object.keys(bookingsByUser) } })
      .toArray();

    // Prepare users array for selectIds function
    const usersForSelection: [string, number][] = users.map((user) => [
      user.email,
      user.used_tokens,
    ]);

    const numParkingSpots = 8; // Adjust this based on your parking capacity
    const selectedUserIds = selectIds(usersForSelection, numParkingSpots);

    // Select bookings based on selected user IDs
    const selectedBookings: Booking[] = [];
    for (const userId of selectedUserIds) {
      const userBookings = bookingsByUser[userId];
      if (userBookings && userBookings.length > 0) {
        selectedBookings.push(userBookings[0]);
      }
    }

    // Update selected bookings to 'approved' status
    const bookingUpdatePromises = selectedBookings.map((booking) =>
      bookingsCollection.updateOne(
        { _id: booking._id },
        { $set: { status: "approved" } }
      )
    );

    // Increment token count for users with approved bookings
    const userUpdatePromises = selectedBookings.map((booking) =>
      usersCollection.updateOne(
        { email: booking.email },
        { $inc: { used_tokens: 1 } }
      )
    );

    // Execute all updates
    await Promise.all([...bookingUpdatePromises, ...userUpdatePromises]);

    return NextResponse.json(
      {
        message: `Parking allocated for ${selectedBookings.length} bookings.`,
        allocatedBookings: selectedBookings.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in daily parking allocation:", error);
    return NextResponse.json(
      { message: "Error in parking allocation" },
      { status: 500 }
    );
  }
}
