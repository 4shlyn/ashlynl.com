const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const OWNER_REFRESH = process.env.SPOTIFY_REFRESH_TOKEN!;

type Cached = { token: string; exp: number };
let cache: Cached | null = null;

async function refreshAccessToken() {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: OWNER_REFRESH,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization:
        `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(`Refresh failed: ${res.status} ${JSON.stringify(json)}`);
  }

  const expiresIn = Number(json.expires_in ?? 3600);
  const exp = Math.floor(Date.now() / 1000) + Math.floor(expiresIn * 0.9);

  cache = { token: json.access_token, exp };
  return cache.token;
}

export async function getOwnerAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cache?.token && cache.exp > now) return cache.token;
  return refreshAccessToken();
}

export async function getNowPlayingForOwner() {
  const token = await getOwnerAccessToken();

  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (res.status === 204) return { playing: false };

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
