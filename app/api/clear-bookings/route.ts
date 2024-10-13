import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";

export async function GET(request: NextRequest) {
  // const { APP_KEY } = process.env;
  // const authHeader = request.headers.get("authorization");

  // if (authHeader !== APP_KEY) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  const { APP_KEY } = process.env;

  // Get the URL of the request and parse the search parameters
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret"); // Accessing the query parameter 'secret'

  // Check if the secret in the query matches the one in the .env file
  if (!secret || secret !== APP_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDatabase();

    // Clear all entries from the bookings collection
    const result = await db.collection("bookings").deleteMany({});

    console.log(`Cleared ${result.deletedCount} bookings`); // Added for logging

    return NextResponse.json(
      {
        message: "All bookings cleared successfully",
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing bookings:", error);
    return NextResponse.json(
      { error: "Failed to clear bookings" },
      { status: 500 }
    );
  }
}
