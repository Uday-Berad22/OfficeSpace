import { NextRequest, NextResponse } from "next/server";
import { getDatabase, User } from "@/lib/database";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const db = await getDatabase();
    const temp = await currentUser();

    if (!temp) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = temp.emailAddresses[0].emailAddress;
    const user = await db
      .collection<User>("users")
      .findOne({ email: userEmail });

    if (!user) {
      // If user is not found, create a new user
      await db.collection<User>("users").insertOne({
        email: temp.emailAddresses[0].emailAddress,
        user_id: temp.id,
        access_level: "user",
        name: temp.fullName || "User",
        used_tokens: 0,
      });
    }

    // Check if the user has an existing booking
    const existingBooking = await db.collection("bookings").findOne({
      email: userEmail,
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          error:
            "You already have an active booking. You cannot submit a new booking at this time.",
        },
        { status: 400 }
      );
    }

    const { arrivalTime, departureTime, wantToCarPool, availableSeats } =
      await req.json();

    // Create booking
    const bookingResult = await db.collection("bookings").insertOne({
      email: userEmail,
      arrivalTime,
      departureTime,
      wantToCarPool,
      availableSeats,
      createdAt: new Date(),
      status: "pending",
    });

    if (!bookingResult.insertedId) {
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        bookingId: bookingResult.insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating booking" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const temp = await currentUser();

    if (!temp) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = temp.emailAddresses[0].emailAddress;

    // Check if the user has an existing booking
    const existingBooking = await db.collection("bookings").findOne({
      email: userEmail,
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          hasActiveBooking: true,
          message:
            "You already have an active booking. You cannot submit a new booking at this time.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          hasActiveBooking: false,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error checking booking status" },
      { status: 500 }
    );
  }
}
