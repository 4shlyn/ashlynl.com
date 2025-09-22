import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export const revalidate = 0; // always fresh (you can switch to caching if you like)

export async function GET() {
  try {
    const data = await getNowPlaying();
    return NextResponse.json(data, {
      headers: {
        // small client-side cache to avoid spamming while hovering
        "Cache-Control": "s-maxage=0, stale-while-revalidate=10",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ isPlaying: false, error: e.message }, { status: 200 });
  }
}
