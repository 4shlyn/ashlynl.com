// lib/spotify.ts
import { cookies } from 'next/headers';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;
const PREFIX = process.env.SPOTIFY_COOKIE_PREFIX ?? 'sp';

const COOKIE_REFRESH = `${PREFIX}_refresh`;
const COOKIE_ACCESS  = `${PREFIX}_access`;
const COOKIE_EXP     = `${PREFIX}_exp`; // epoch seconds

function b64(x: string) {
  return Buffer.from(x).toString('base64');
}

export function setTokens({
  access_token,
  refresh_token,
  expires_in,
}: {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}) {
  const c = cookies();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + Math.max(1, Math.floor(expires_in * 0.9)); // renew a little early
const secure = process.env.NODE_ENV === 'production';

c.set(COOKIE_ACCESS, access_token, {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure,
});

c.set(COOKIE_EXP, String(exp), {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure,
});

if (refresh_token) {
  c.set(COOKIE_REFRESH, refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
    maxAge: 60 * 60 * 24 * 30,
  });
}
}

export function clearTokens() {
  const c = cookies();
  c.delete(COOKIE_ACCESS);
  c.delete(COOKIE_REFRESH);
  c.delete(COOKIE_EXP);
}

function getCookie(name: string) {
  return cookies().get(name)?.value;
}

export function getRefreshToken() {
  return getCookie(COOKIE_REFRESH) || '';
}

export function tokenExpired() {
  const exp = Number(getCookie(COOKIE_EXP) || 0);
  const now = Math.floor(Date.now() / 1000);
  return !exp || now >= exp;
}

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

export async function ensureAccessToken(): Promise<string | null> {
  const c = cookies();
  let access = getCookie(COOKIE_ACCESS);
  const refresh = getRefreshToken();

  if (!refresh) return null;

  if (!access || tokenExpired()) {
    const refreshed = await refreshAccessToken(refresh);
    setTokens({
      access_token: refreshed.access_token,
      // refresh_token may be omitted on refresh; keep the old one
      expires_in: refreshed.expires_in ?? 3600,
    });
    access = refreshed.access_token;
  }
  return access || null;
}

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

export const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
].join(' ');
