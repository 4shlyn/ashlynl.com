const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

async function refreshAccessToken() {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
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
  const accessToken = await refreshAccessToken();

  const res = await fetch(NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  // 204 = no content (not playing), 200 = playing
  if (res.status === 204 || res.status > 400) {
    return { isPlaying: false } as const;
  }

  const json = await res.json();

  const isPlaying = json?.is_playing ?? false;
  const item = json?.item ?? json; // sometimes nested
  const title = item?.name ?? null;
  const artist = item?.artists?.map((a: any) => a.name).join(", ") ?? null;
  const album = item?.album?.name ?? null;
  const albumImageUrl = item?.album?.images?.[0]?.url ?? null;
  const songUrl = item?.external_urls?.spotify ?? null;

  return {
    isPlaying,
    title,
    artist,
    album,
    albumImageUrl,
    songUrl,
  } as const;
}
