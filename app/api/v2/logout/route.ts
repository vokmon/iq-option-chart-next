import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear the SSID cookie
    response.cookies.set("ssid", "", {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      expires: new Date(0), // Set to past date to delete
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
