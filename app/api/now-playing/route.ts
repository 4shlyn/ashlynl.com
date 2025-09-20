export const runtime = 'edge'; 
export const dynamic = 'force-dynamic';  // always fetch fresh
export const revalidate = 0;

// CHECK AGAIN W CLOUDFARE
const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

async function getAccessToken() {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) throw new Error('token refresh failed');
  return res.json() as Promise<{ access_token: string }>;
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    const playingRes = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (playingRes.status === 204 || playingRes.status === 202) {
      // nothing is playing
      return new Response(JSON.stringify({ playing: false }), {
        headers: { 'content-type': 'application/json' },
      });
    }

    if (!playingRes.ok) throw new Error('spotify now playing failed');

    const data = await playingRes.json();

    const payload = {
      playing: data?.is_playing ?? false,
      progress_ms: data?.progress_ms ?? 0,
      duration_ms: data?.item?.duration_ms ?? 0,
      title: data?.item?.name ?? '',
      artist: data?.item?.artists?.map((a: any) => a.name).join(', ') ?? '',
      album: data?.item?.album?.name ?? '',
      artwork: data?.item?.album?.images?.[1]?.url ?? '',
      url: data?.item?.external_urls?.spotify ?? '',
    };

    return new Response(JSON.stringify(payload), {
      headers: {
        'content-type': 'application/json',
        // prevent caching
        'cache-control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ playing: false }), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  }
}
