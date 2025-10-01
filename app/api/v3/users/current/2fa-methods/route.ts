import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(
    "https://api.iqoption.com/v3/users/current/2fa-methods",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Verification data fetch failed" },
      { status: 400 }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
