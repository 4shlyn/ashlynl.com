// app/api/spotify/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { buildAuthorizeURL } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  const host  = req.headers.get('x-forwarded-host') ?? req.headers.get('host')!;
  const origin = `${proto}://${host}`;

  const redirectUri = `${origin}/api/spotify/callback`;   // EXACT we’ll use
  const authorizeURL = buildAuthorizeURL(redirectUri);

  const res = NextResponse.redirect(authorizeURL, { status: 302 });
  // remember which redirect we used, so callback uses the exact same
  res.cookies.set('sp_cb', redirectUri, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 300, // 5 minutes is plenty
  });
  return res;
}
