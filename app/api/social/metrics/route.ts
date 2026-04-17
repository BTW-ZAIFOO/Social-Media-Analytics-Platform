import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:5001/api/social/metrics', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      {
        totalFollowers: 0,
        totalEngagement: 0,
        totalAccounts: 0,
        platformMetrics: [],
      },
      { status: 200 }
    );
  }
}
