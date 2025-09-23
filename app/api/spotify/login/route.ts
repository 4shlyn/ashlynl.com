import { NextResponse } from "next/server";

const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
].join(" ");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!, // must match prod domain
    scope: SCOPES,
    show_dialog: "true", // forces Spotify to return a refresh token
  });
  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
