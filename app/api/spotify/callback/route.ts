import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  if (error) return new NextResponse(`Spotify error: ${error}`, { status: 400 });
  if (!code) return new NextResponse("Missing code", { status: 400 });

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
  });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    // Node fetch; no need for cache here
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    return new NextResponse(`Token exchange failed: ${txt}`, { status: 400 });
  }
  const tokenJson = await tokenRes.json();

  // You’ll get access_token (short-lived) and refresh_token (long-lived).
  // Copy refresh_token into SPOTIFY_REFRESH_TOKEN in your .env.local.
  const refresh = tokenJson.refresh_token;

  // Show it plainly so you can copy it once.
  return new NextResponse(
    `Copy this refresh token into your .env.local as SPOTIFY_REFRESH_TOKEN:\n\n${refresh}\n\n(Then remove /api/spotify/login and /api/spotify/callback if you like.)`,
    { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
