import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

const IQ_OPTION_API_URL = process.env.NEXT_PUBLIC_IQ_OPTION_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password, token } = body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", identifier)
      .single();

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (new Date(user.expired_at) < currentDate) {
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
      jsonResponse.cookies.set("ssid", data.ssid, {
        httpOnly: false, // Allow JavaScript access for client-side SDK
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 2, // 2 days to store access and refresh tokens
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
