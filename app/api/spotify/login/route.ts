import { NextResponse } from "next/server";

const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
].join(" ");

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: SCOPES,
  });
  const url = `https://accounts.spotify.com/authorize?${params.toString()}`;
  return NextResponse.redirect(url);
}
