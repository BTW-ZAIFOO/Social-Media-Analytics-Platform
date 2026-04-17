import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json(
        { error: "Missing url query parameter" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `http://localhost:5001/api/social/preview?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ error: "Preview request failed" }));
      return NextResponse.json(errorBody, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching preview:", error);
    return NextResponse.json(
      { error: "Failed to fetch preview" },
      { status: 500 },
    );
  }
}
