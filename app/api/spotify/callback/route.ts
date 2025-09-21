// app/api/spotify/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, applyTokensToResponse } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) return new NextResponse(`Spotify error: ${error}`, { status: 400 });
  if (!code) return new NextResponse('Missing authorization code.', { status: 400 });

  const redirectUri = req.cookies.get('sp_cb')?.value;
  if (!redirectUri) return new NextResponse('Missing redirect cookie', { status: 400 });

  const tokens = await exchangeCodeForTokens(code, redirectUri);

  const res = NextResponse.redirect(new URL('/?authed=1', url), { status: 302 });
  applyTokensToResponse(res, {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: tokens.expires_in,
  });
  res.cookies.delete('sp_cb'); // clean up
  return res;
}
