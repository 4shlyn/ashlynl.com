import { NextResponse } from 'next/server';
import { ensureAccessToken, getNowPlaying } from '@/lib/spotify';

export const dynamic = 'force-dynamic'; // avoid caching in dev & prod

export async function GET() {
  try {
    const token = await ensureAccessToken();
    if (!token) {
      return NextResponse.json({ playing: false, error: 'not_authed' }, { status: 200 });
    }
    const data = await getNowPlaying(token);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
