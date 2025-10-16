import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import { createJWT } from "@/utils/jwt";
import { COOKIES } from "@/constants/cookies";

const IQ_OPTION_API_URL = process.env.NEXT_PUBLIC_IQ_OPTION_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password, token } = body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", identifier.toLowerCase())
      .single();

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const expires = new Date(user.expired_at);

    if (expires < currentDate) {
      return NextResponse.json({ error: "User expired" }, { status: 404 });
    }

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Identifier and password are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${IQ_OPTION_API_URL}/v2/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
        token,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: "Authentication failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Create response with JSON data
    const jsonResponse = NextResponse.json(data);

    // Set secure cookie with ssid if available
    if (data.ssid) {
      const cookieExpires = new Date(user.expired_at);
      cookieExpires.setHours(23, 59, 59, 999);

      jsonResponse.cookies.set(COOKIES.ssid, data.ssid, {
        httpOnly: false, // Allow JavaScript access for client-side SDK
        secure: true,
        sameSite: "strict",
        expires: cookieExpires, // Use absolute date instead of maxAge
        path: "/", // Set path to root for all pages
      });

      // Create JWT token from user data with custom expiration
      const jwtToken = createJWT({
        email: user.email,
        iq_option_id: user.iq_option_id,
        expired_at: user.expired_at,
      });

      jsonResponse.cookies.set(COOKIES.accessToken, jwtToken, {
        httpOnly: true, // Allow JavaScript access for client-side SDK
        secure: true,
        sameSite: "strict",
        expires: cookieExpires, // Use absolute date instead of maxAge
        path: "/", // Set path to root for all pages
      });
    }

    return jsonResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
