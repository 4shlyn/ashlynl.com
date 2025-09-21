import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// === CONFIG ===
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!; // must match Spotify dashboard
const IS_PROD = process.env.NODE_ENV === 'production';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined; // e.g. ".ashlynl.com"

const PREFIX = process.env.SPOTIFY_COOKIE_PREFIX ?? 'sp';

export const COOKIE_REFRESH = `${PREFIX}_refresh`;
export const COOKIE_ACCESS = `${PREFIX}_access`;
export const COOKIE_EXP = `${PREFIX}_exp`; // epoch seconds

// === HELPERS ===
function b64(x: string) {
  return Buffer.from(x).toString('base64');
}

function getCookie(name: string) {
  return cookies().get(name)?.value;
}

// === COOKIE MANAGEMENT ===
export function applyTokensToResponse(
  res: NextResponse,
  {
    access_token,
    refresh_token,
    expires_in,
  }: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  }
) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + Math.max(1, Math.floor(expires_in * 0.9));

  const base = {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    path: '/',
    secure: IS_PROD,
    ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
  };

  // access + exp
  res.cookies.set(COOKIE_ACCESS, access_token, base);
  res.cookies.set(COOKIE_EXP, String(exp), base);

  if (refresh_token) {
    res.cookies.set(COOKIE_REFRESH, refresh_token, {
      ...base,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // Optional debug cookie (non-httpOnly, visible in browser)
  res.cookies.set('sp_probe', '1', { path: '/', secure: IS_PROD });
}

export function clearTokens(res: NextResponse) {
  res.cookies.set(COOKIE_ACCESS, '', { path: '/', maxAge: 0 });
  res.cookies.set(COOKIE_REFRESH, '', { path: '/', maxAge: 0 });
  res.cookies.set(COOKIE_EXP, '', { path: '/', maxAge: 0 });
}

export function getRefreshToken() {
  return getCookie(COOKIE_REFRESH) || '';
}

export function tokenExpired() {
  const exp = Number(getCookie(COOKIE_EXP) || 0);
  const now = Math.floor(Date.now() / 1000);
  return !exp || now >= exp;
}

// === SPOTIFY TOKEN CALLS ===
export async function exchangeCodeForTokens(code: string) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${b64(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function refreshAccessToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${b64(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Refresh failed: ${res.status} ${txt}`);
  }
  return res.json();
}

// === TOKEN ENSURER ===
export async function ensureAccessToken(): Promise<string | null> {
  let access = getCookie(COOKIE_ACCESS);
  const refresh = getRefreshToken();

  if (!refresh) return null;

  if (!access || tokenExpired()) {
    const refreshed = await refreshAccessToken(refresh);
    access = refreshed.access_token;
  }
  return access || null;
}

// === API CALLS ===
export async function getNowPlaying(accessToken: string) {
  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (res.status === 204) {
    return { playing: false };
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`now playing failed: ${res.status} ${txt}`);
  }

  const json = await res.json();
  return {
    playing: json.is_playing,
    title: json.item?.name,
    artist: json.item?.artists?.map((a: any) => a.name).join(', '),
    album: json.item?.album?.name,
    url: json.item?.external_urls?.spotify,
  };
}

// === SCOPES ===
export const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
].join(' ');
