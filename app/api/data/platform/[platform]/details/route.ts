import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ platform: string }> },
) {
  const { platform } = await context.params;
  try {
    const response = await fetch(
      `http://localhost:5001/api/data/platform/${platform}/details`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error proxying platform detail request:", error);
    return NextResponse.json(
      {
        posts: [],
        metrics: {
          platform,
          totalFollowers: 0,
          averageEngagement: 0,
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          totalViews: 0,
          trend: [],
        },
      },
      { status: 502 },
    );
  }
}
