const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('No ?code in callback URL', { status: 400 });
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://localhost:3000/api/spotify/callback',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });

  const json = await res.json();

  // Shows tokens right in the browser — copy refresh_token!
  return new Response(
    `<pre>${JSON.stringify(json, null, 2)}</pre><p>Copy "refresh_token" and put it in your .env.local</p>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
