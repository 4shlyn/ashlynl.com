// app/api/spotify/login/route.ts
import { NextResponse } from 'next/server';
import { SCOPES } from '@/lib/spotify';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI, // <-- must be EXACT
    scope: SCOPES,
  });
  const authorizeURL =
    `https://accounts.spotify.com/authorize?${params.toString()}`;

  if (q.get('debug') === '1') {
    return new NextResponse(
      JSON.stringify({ REDIRECT_URI, authorizeURL }, null, 2),
      { headers: { 'content-type': 'application/json' } }
    );
  }

  return NextResponse.redirect(authorizeURL);
}

