import { NextRequest, NextResponse } from "next/server";
import { COOKIES } from "@/constants/cookies";

export async function POST(request: NextRequest) {
  try {
    // Get the SSID from cookies
    const ssid = request.cookies.get(COOKIES.ssid)?.value;

    // Call IQ Option logout API if SSID exists
    if (ssid) {
      try {
        await fetch("https://auth.iqoption.com/api/v1.0/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `ssid=${ssid}`,
          },
        });
      } catch (apiError) {
        console.error("IQ Option logout API error:", apiError);
        // Continue with local logout even if API call fails
      }
    }

    // Create response
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear the SSID cookie
    response.cookies.set(COOKIES.ssid, "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0), // Set to past date to delete
    });

    // Clear the JWT cookie
    response.cookies.set(COOKIES.accessToken, "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0), // Set to past date to delete
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
