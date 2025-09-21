import { NextResponse } from 'next/server';
import { exchangeCodeForTokens, applyTokensToResponse } from '@/lib/spotify';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new NextResponse(`Spotify error: ${error}`, { status: 400 });
  }
  if (!code) {
    return new NextResponse('Missing authorization code.', { status: 400 });
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    // redirect home
    const dest = new URL('/?authed=1', url);
    const res = NextResponse.redirect(dest, { status: 302 });

    // **set cookies on the response we return**
    applyTokensToResponse(res, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
    });

    return res;
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e), { status: 500 });
  }
}
