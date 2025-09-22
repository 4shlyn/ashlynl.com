"use client";

import { useEffect, useState } from "react";

export default function ScrollHint({ targetId = "projects" }: { targetId?: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero) return;


    // hide when hero off screen
    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        const isLeavingHero = ratio < 0.4 && entry.boundingClientRect.top < 0;
        setHidden(isLeavingHero);
      },
      {
        root: null,
        threshold: [0, 0.4, 1],
        // start hiding only after we pass ~30% of the hero
        rootMargin: "-30% 0px -30% 0px",
      }
    );

    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const onClick = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    // respect sticky header via css scroll-padding
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`scroll-hint ${hidden ? "scroll-hint--hidden" : ""}`}
      aria-label="Scroll to content"
    >
      <span className="scroll-hint__label">Scroll</span>
      <div className="scroll-hint__arrows">
        <ChevronDown className="scroll-hint__chev" />
        <ChevronDown className="scroll-hint__chev" />
        <ChevronDown className="scroll-hint__chev" />
      </div>
    </button>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
