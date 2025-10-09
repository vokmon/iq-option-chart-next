import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/utils/jwt";
import { COOKIES } from "@/constants/cookies";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  try {
    // Get the access token from cookies
    const accessToken = request.cookies.get(COOKIES.accessToken)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const userData = verifyJWT(accessToken);

    if (!userData) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", userData.email)
      .single();

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user profile data
    return NextResponse.json({
      email: user.email,
      iqOptionId: user.iq_option_id,
      expiredAt: user.expired_at,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
