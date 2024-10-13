import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      {
        message: `Success dummy`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in dummy:", error);
    return NextResponse.json({ message: "Error in dummy" }, { status: 500 });
  }
}
