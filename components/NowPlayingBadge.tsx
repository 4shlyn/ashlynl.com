'use client';

import { useEffect, useState } from 'react';

export default function NowPlayingBadge() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch('/api/now-playing', { cache: 'no-store' });
        if (!mounted) return;
        setData(await res.json());
      } catch (e) {
        if (!mounted) return;
        setData({ isPlaying: false });
      }
    }

    load();
    const id = setInterval(load, 15000); //r15s
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const isPlaying = data?.isPlaying;
  const content = (
    <div className="np-tooltip">
      {data?.artwork ? <img src={data.artwork} alt="" /> : null}
      <div className="np-meta">
        <div className="np-title">{data?.title ?? 'nothing playing rn'}</div>
        {data?.artist ? <div className="np-artist">{data.artist}</div> : null}
      </div>
    </div>
  );

  const disc = (
    <span
      className={`np-disc ${isPlaying ? 'spin' : ''}`}
      aria-label={isPlaying ? `Listening to ${data?.title} by ${data?.artist}` : 'Not playing'}
    >
      💿
    </span>
  );

  return (
    <span className="nowplaying">
      {data?.url ? (
        <a href={data.url} target="_blank" rel="noreferrer" className="np-link">
          {disc}
        </a>
      ) : (
        disc
      )}
      {content}
    </span>
  );
}
