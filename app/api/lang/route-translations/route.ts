import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Convert searchParams to URL string
  const queryString = searchParams.toString();
  const apiUrl = `https://iqoption.com/api/lang/route-translations${
    queryString ? `?${queryString}` : ""
  }`;

  console.log("📤 apiUrl:", apiUrl);
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  // Create response with JSON data
  const jsonResponse = NextResponse.json(data);
  return jsonResponse;
}
