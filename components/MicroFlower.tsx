"use client";
import React from "react";

type TinyRosetteProps = {
  size?: number;                    // pixel size of the SVG
  style?: React.CSSProperties;      // forwarded to <svg>
  className?: string;               // optional CSS class
  delayMs?: number;                 // start animations after this delay
};

export default function MicroFlower({
  size = 14,
  style,
  className,
  delayMs = 0,
}: TinyRosetteProps) {
  const leaves = [
    { d: "M50,18 C45,20 40,27 39,34 C38,42 42,51 48,57 C51,59 55,59 58,56 C62,52 64,45 63,37 C62,30 57,21 50,18 Z", rot:   0 },
    { d: "M52,20 C48,22 44,28 43,35 C42,42 45,50 51,55 C55,58 59,58 62,54 C65,50 66,44 65,37 C64,30 59,23 52,20 Z", rot:  72 },
    { d: "M48,21 C43,23 39,30 38,36 C37,44 40,52 46,56 C49,58 53,58 56,55 C60,51 62,45 61,38 C60,31 55,24 48,21 Z", rot: 144 },
    { d: "M49,19 C44,22 40,29 39,36 C38,43 41,50 47,55 C50,57 54,57 57,54 C60,51 62,45 61,38 C60,31 55,23 49,19 Z", rot: 216 },
    { d: "M51,19 C47,21 42,27 41,34 C40,41 43,49 49,54 C52,56 56,56 59,53 C62,50 64,44 63,37 C62,30 57,23 51,19 Z", rot: 288 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      className={className}
      style={{
        // expose the delay as a CSS variable so inner animations can read it
        ...(style || {}),
        ["--delay" as any]: `${delayMs}ms`,
      }}
    >
      <defs>
        <linearGradient id="leafFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#6fbf80" />
          <stop offset="100%" stopColor="#2f7b4d" />
        </linearGradient>
        <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="0.8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* whole rosette intro */}
      <g className="rosette" style={{ transformOrigin: "50% 50%" }}>
        {leaves.map((leaf, i) => (
          // rotation stays on the attribute so CSS transforms won't override it
          <g key={i} transform={`rotate(${leaf.rot} 50 50)`}>
            {/* animate ONLY scale/opacity here */}
            <g
              className="leafAnim"
              style={{ animationDelay: `calc(var(--delay, 0ms) + ${100 + i * 70}ms)` }}
            >
              <path
                d={leaf.d}
                fill="url(#leafFill)"
                stroke="#245a3a"
                strokeWidth="1"
                filter="url(#rough)"
              />
            </g>
          </g>
        ))}
      </g>

      <style>{`
        .rosette {
          opacity: 0;
          transform: scale(.9);
          animation: pop 200ms ease-out forwards;
          animation-delay: var(--delay, 0ms);
        }
        .leafAnim {
          opacity: 0;
          transform: scale(.7);
          transform-origin: 50% 50%;
          animation: unfurl 300ms ease-out forwards;
        }
        @keyframes pop   { to { opacity: 1; transform: scale(1); } }
        @keyframes unfurl{ to { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .rosette, .leafAnim { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </svg>
  );
}
