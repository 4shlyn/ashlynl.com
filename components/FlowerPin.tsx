"use client";

import { useEffect, useRef, useState } from "react";

// micro flower (no stem)
function MicroFlower({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <radialGradient id="pf" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fff6fc" />
          <stop offset="55%" stopColor="#ff78b8" />
          <stop offset="100%" stopColor="#c24fff" />
        </radialGradient>
        <radialGradient id="cf" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff3a6" />
          <stop offset="100%" stopColor="#ffb300" />
        </radialGradient>
        <path id="petal" d="M50,18 C43,21 39,32 40,40 C41,50 46,57 50,60 C54,57 59,50 60,40 C61,32 57,21 50,18 Z" />
      </defs>
      <g className="g" style={{ transformOrigin: "50% 50%" }}>
        {[0,72,144,216,288].map((a,i)=>(
          <use key={i} href="#petal" fill="url(#pf)" opacity="0"
               style={{ animation: `petal 420ms ease-out forwards`, animationDelay: `${160 + i*60}ms` }}
               transform={`rotate(${a+(i%2?-2:2)} 50 50) scale(.96)`}/>
        ))}
        <circle cx="50" cy="50" r="10" fill="url(#cf)" opacity="0"
                style={{ animation: "center 300ms 520ms cubic-bezier(.16,.9,.2,1.1) forwards" }}/>
      </g>
      <style>{`
        .g{opacity:0;transform:scale(.6);animation:f 360ms cubic-bezier(.2,.9,.2,1.1) forwards}
        @keyframes f{to{opacity:1;transform:scale(1)}}
        @keyframes petal{0%{opacity:0;transform:scale(.05)}70%{opacity:1;transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
        @keyframes center{0%{opacity:0;transform:scale(.1)}100%{opacity:1;transform:scale(1)}}
        @media (prefers-reduced-motion: reduce){
          .g{animation:none;opacity:1;transform:none}
          use,circle{animation:none!important;opacity:1}
        }
      `}</style>
    </svg>
  );
}

type Props = {
  /** A wrapper element that contains your TitleBump (we’ll measure inside it) */
  containerSelector?: string;       // default: [data-title-bump]
  /** Pixel nudges to sit perfectly on the e */
  nudgeX?: number;                  // default: 0
  nudgeY?: number;                  // default: -2
  /** Flower size as fraction of the target letter’s font-size */
  sizeFactor?: number;              // default: 0.32
  /** Show a small red dot for debugging the anchor position */
  debugDot?: boolean;               // default: false
};

export default function FlowerPin({
  containerSelector = "[data-title-bump]",
  nudgeX = 0,
  nudgeY = -2,
  sizeFactor = 0.32,
  debugDot = false,
}: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; px: number } | null>(null);

  useEffect(() => {
    const container = document.querySelector(containerSelector) as HTMLElement | null;
    if (!container) return;

    // ensure positioning context
    if (getComputedStyle(container).position === "static") container.style.position = "relative";

    function measure() {
      // find a heading inside, otherwise use the container itself
      const heading = (container.querySelector("h1,h2,[role='heading']") as HTMLElement) || container;

      // Build all text nodes
      const tw = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (tw.nextNode()) nodes.push(tw.currentNode as Text);
      const text = nodes.map(n => n.nodeValue ?? "").join("");
      if (!text.length) return;

      // Last visible character (don’t rely on it being 'e')
      let globalEnd = text.length;
      // make a range for the last character
      let idx = globalEnd - 1;
      for (const n of nodes) {
        const s = n.nodeValue ?? "";
        if (idx < s.length) {
          const range = document.createRange();
          range.setStart(n, idx);
          range.setEnd(n, idx + 1);
          const rect = range.getBoundingClientRect();
          const cRect = container.getBoundingClientRect();
          // derive font-size from the node’s parent or heading
          const fontSize = parseFloat(getComputedStyle((n.parentElement ?? heading) as Element).fontSize);
          setPos({
            left: rect.left - cRect.left + nudgeX,
            top: rect.top - cRect.top + nudgeY,
            px: Math.max(8, fontSize * sizeFactor),
          });
          return;
        } else {
          idx -= s.length;
        }
      }
    }

    // Observe mutations (TitleBump may split letters/animate in), resize, and first paint
    const mo = new MutationObserver(measure);
    mo.observe(container, { childList: true, subtree: true, characterData: true });
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 60); // after first paint
    measure();

    return () => {
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [containerSelector, nudgeX, nudgeY, sizeFactor]);

  if (!pos) return null;

  return (
    <div
      ref={elRef}
      style={{
        position: "absolute",
        left: pos.left,
        top: pos.top,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {debugDot && (
        <div style={{
          width: 4, height: 4, borderRadius: 9999,
          background: "red", position: "absolute", left: -2, top: -2
        }}/>
      )}
      <MicroFlower size={pos.px} />
    </div>
  );
}
