'use client';
// WOOOOO IT WORKS
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* not JSON */ }
  return { ok: res.ok, status: res.status, statusText: res.statusText, data: json ?? text };
};

export default function DiskNowPlaying() {
  const [endpoint, setEndpoint] = useState<string | null>(null);

  //ABS URL 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEndpoint(`${window.location.origin}/api/spotify/nowplaying`);
    }
  }, []);

  const { data, isLoading, mutate } = useSWR(endpoint, fetcher, {
    refreshInterval: 10_000,
    revalidateOnFocus: false,
    dedupingInterval: 0,
  });

  //derived states
  const apiOk = data?.ok === true;
  const api404 = data?.status === 404;
  const notAuthed = apiOk && data?.data?.error === 'not_authed';
  const playing = apiOk && data?.data?.playing === true;

  let tooltip = 'Loading…';
  if (api404) {
    tooltip =
      'API 404: /api/spotify/nowplaying not found.\n' +
      'Check file path: app/api/spotify/nowplaying/route.ts\n' +
      'Then restart `npm run dev`.';
  } else if (!apiOk && data) {
    tooltip = `Spotify error: ${data.status} ${data.statusText}`;
  } else if (notAuthed) {
    tooltip = 'Connect Spotify';
  } else if (apiOk && !playing) {
    tooltip = 'Not playing';
  } else if (apiOk && playing) {
    const t = data?.data?.title ?? '—';
    const a = data?.data?.artist ?? '';
    tooltip = a ? `${t} — ${a}` : t;
  }

  const href = notAuthed ? '/api/spotify/login' : (data?.data?.url ?? '#');

  return (
    <div className="np-wrap" aria-label="Now Playing" title="">
      <a
        href={href}
        target={notAuthed ? '_self' : '_blank'}
        rel={notAuthed ? undefined : 'noreferrer'}
        className={`disk ${playing ? 'spin' : ''} ${isLoading ? 'dim' : ''}`}
        onClick={(e) => {
          if (!notAuthed && !data?.data?.url) e.preventDefault();
        }}
      >
        <span role="img" aria-label="disc">💿</span>
      </a>

      <div className="tooltip">
        {tooltip.split('\n').map((line, i) => <div key={i}>{line}</div>)}
      </div>

      <style jsx>{`
        .np-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-left: 10px;
        }
        .disk {
          display: inline-grid;
          place-items: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          text-decoration: none;
          user-select: none;
          will-change: transform;
          transition: transform 200ms ease, opacity 200ms ease;
        }
        .disk.dim { opacity: 0.65; }
        .disk:hover { transform: scale(1.08); }
        .spin { animation: spin 2.4s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .tooltip {
          position: absolute;
          left: 28px;
          top: 50%;
          transform: translateY(-50%);
          padding: 6px 8px;
          font: 600 11px/1.2 "IBM Plex Mono", monospace;
          letter-spacing: .04em;
          color: #222;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(0,0,0,.1);
          border-radius: 6px;
          white-space: pre;
          pointer-events: none;
          opacity: 0;
          transition: opacity 160ms ease, transform 160ms ease;
          backdrop-filter: blur(6px);
        }
        .np-wrap:hover .tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(2px);
        }
      `}</style>
    </div>
  );
}
