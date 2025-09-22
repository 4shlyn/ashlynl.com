import { NextResponse } from 'next/server';
import { SCOPES } from '@/lib/spotify';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  });
  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
