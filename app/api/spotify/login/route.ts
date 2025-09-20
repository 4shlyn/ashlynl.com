export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/api/spotify/callback',
    scope: [
      'user-read-currently-playing',
      'user-read-playback-state'
    ].join(' '),
    show_dialog: 'true',
  });

  return Response.redirect('https://accounts.spotify.com/authorize?' + params.toString(), 302);
}
