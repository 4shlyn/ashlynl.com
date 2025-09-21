import { NextResponse } from 'next/server';
import { getNowPlayingForOwner } from '@/lib/spotify-owner';

export async function GET() {
  try {
    const data = await getNowPlayingForOwner();
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ playing: false, error: String(e?.message ?? e) }, { status: 200 });
  }
}
