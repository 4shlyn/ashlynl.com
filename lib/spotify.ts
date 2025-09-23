const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

function env(key: string) {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v.trim();
}

async function refreshAccessToken() {
  const basic = Buffer.from(`${env("SPOTIFY_CLIENT_ID")}:${env("SPOTIFY_CLIENT_SECRET")}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env("SPOTIFY_REFRESH_TOKEN"),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to refresh Spotify token: ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function getNowPlaying() {
  const token = await refreshAccessToken();

  const res = await fetch(NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 204 || res.status > 400) return { isPlaying: false } as const;

  const json = await res.json();
  const item = json?.item ?? json;
  return {
    isPlaying: Boolean(json?.is_playing),
    title: item?.name ?? null,
    artist: item?.artists?.map((a: any) => a.name).join(", ") ?? null,
    albumImageUrl: item?.album?.images?.[0]?.url ?? null,
    songUrl: item?.external_urls?.spotify ?? null,
  } as const;
}
