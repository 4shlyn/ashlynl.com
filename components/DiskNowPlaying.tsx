"use client";

import { useEffect, useRef, useState } from "react";

type NowPlaying = {
  isPlaying: boolean;
  title?: string | null;
  artist?: string | null;
  albumImageUrl?: string | null;
  songUrl?: string | null;
  error?: string;
};

const POLL_MS = 15000; // background refresh

export default function DiskNowPlaying() {
  const [hovered, setHovered] = useState(false);
  const [data, setData] = useState<NowPlaying | null>(null);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<number | null>(null);

  async function fetchNowPlaying() {
    try {
      // ✅ route name: now-playing (with a hyphen)
      const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as NowPlaying;
      setData(json);
    } catch {
      // keep last known state (optional: setData({ isPlaying:false }))
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    fetchNowPlaying();
    timerRef.current = window.setInterval(fetchNowPlaying, POLL_MS);
    const onVis = () => document.visibilityState === "visible" && fetchNowPlaying();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const isPlaying = !!data?.isPlaying;
  const label =
    !loaded
      ? "Loading…"
      : isPlaying && data?.title
      ? `${data.title} — ${data.artist ?? ""}`.trim()
      : "Not playing";

  return (
    <span
      className="np-rel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-live="polite"
    >
      {/* Disk spins whenever music is playing */}
      <span
        className="disk"
        style={{ animation: isPlaying ? "np-spin 3s linear infinite" : "none" }}
        aria-hidden
      >
        💿
      </span>

      {/* ABSOLUTE popover so layout never shifts */}
      {hovered && (
        <span className="popover">
          {/* show image ONLY when playing */}
          {isPlaying && data?.albumImageUrl ? (
            <>
            {/* <p>I'm listening to...</p> */}
                        <img className="thumb" src={data.albumImageUrl} alt="" />

            </>
          ) : null}

          {isPlaying && data?.songUrl ? (
            <>
            <a className="title" href={data.songUrl} target="_blank" rel="noreferrer">
              {label}
            </a>
            </>

          ) : (
            <span className="muted">{label}</span>
          )}
        </span>
      )}

      <style jsx>{`
        .np-rel {
          position: relative;
          display: inline-block;
          line-height: 1;
        }
        .disk {
          display: inline-block;
          font-size: 18px;
          transform-origin: 50% 50%;
        }
        .popover {
          position: absolute;
          left: 26px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          max-width: 60ch;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          z-index: 50;
          font-size: 0.9rem;
          color: rgba(0,0,0,0.72);
          pointer-events: auto;
        }
        .thumb {
          width: 16px; 
          height: 16px;
          border-radius: 2px;
          object-fit: cover;
          display: block;
          flex: 0 0 auto;
        }
        .title {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid rgba(0,0,0,0.15);
          padding-bottom: 1px;
        }
        .title:hover { border-bottom-color: rgba(0,0,0,0.35); }
        .muted { color: rgba(0,0,0,0.45); }

        @keyframes np-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .disk { animation: none !important; } }
      `}</style>
    </span>
  );
}
