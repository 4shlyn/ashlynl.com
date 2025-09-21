import { NextResponse } from 'next/server';
import { exchangeCodeForTokens, applyTokensToResponse } from '@/lib/spotify';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) return new NextResponse(`Spotify error: ${error}`, { status: 400 });
  if (!code) return new NextResponse('Missing authorization code.', { status: 400 });

  try {
    const tokens = await exchangeCodeForTokens(code);
    const res = NextResponse.redirect(new URL('/?authed=1', url), { status: 302 });
    applyTokensToResponse(res, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token, // may be undefined on refresh (but here it's initial)
      expires_in: tokens.expires_in,
    });
    return res;
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e), { status: 500 });
  }
}
