"use client";

import { useEffect, useRef, useState } from "react";
import MicroFlower from "./MicroFlower";

export default function AttachFlowerToLastChar({
  wrapperSelector = ".hero-title",
  sizeFactor = 0.10,  // really small base size (≈10% of letter size)
  nudgeX = 100,         // fine-tune after the corner math below
  nudgeY = 0,
  debugDot = false,
}: {
  wrapperSelector?: string;
  sizeFactor?: number;
  nudgeX?: number;
  nudgeY?: number;
  debugDot?: boolean;
}) {
  const [pos, setPos] = useState<{ left: number; top: number; px: number } | null>(null);
  const flowerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = document.querySelector(wrapperSelector) as HTMLElement | null;
    if (!wrapper) return;

    if (getComputedStyle(wrapper).position === "static") wrapper.style.position = "relative";

    const heading =
      (wrapper.querySelector("h1,h2,[role='heading']") as HTMLElement | null) || wrapper;
    if (!heading) return;

    // Wrap last visible char if not yet wrapped
    if (!heading.querySelector(".last-char-wrap")) {
      const tw = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (tw.nextNode()) nodes.push(tw.currentNode as Text);
      if (!nodes.length) return;

      let targetNode: Text | null = null;
      let charIndex = -1;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const s = nodes[i].nodeValue ?? "";
        const m = /.*(\S)\s*$/.exec(s);
        if (m) {
          targetNode = nodes[i];
          charIndex = s.lastIndexOf(m[1]);
          break;
        }
      }
      if (!targetNode || charIndex < 0) return;

      const range = document.createRange();
      range.setStart(targetNode, charIndex);
      range.setEnd(targetNode, charIndex + 1);

      const span = document.createElement("span");
      span.className = "last-char-wrap";
      span.style.position = "relative";
      span.style.display = "inline-block";
      range.surroundContents(span);
    }

    const lastWrap = heading.querySelector(".last-char-wrap") as HTMLElement | null;
    if (!lastWrap) return;

    function measure() {
      const r = lastWrap.getBoundingClientRect();
      const w = wrapper.getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(lastWrap).fontSize);
      const px = Math.max(6, fs * sizeFactor); // flower pixel size

      // 👇 Anchor to TOP-RIGHT corner of the 'e'
      // - Start from wrapper's origin
      // - Add the span's left + width to reach its right edge
      // - Pull back a bit so the flower sits *on* the corner, not past it
      const CORNER_PULL = 0.5; // 0..1, how much of the flower size to pull inward
      const left = (r.left - w.left) + r.width - px * CORNER_PULL + nudgeX;
      const top  = (r.top  - w.top)  - px * CORNER_PULL + nudgeY;

      setPos({ left, top, px });
    }

    const t = setTimeout(measure, 50);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapper);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [wrapperSelector, sizeFactor, nudgeX, nudgeY]); // ✅ changing these now repositions

  if (!pos) return null;

  return (
    <div
      ref={flowerRef}
      className="pointer-events-none"
      style={{
        position: "absolute",
        left: pos.left,
        top: pos.top,
        zIndex: 1,
      }}
    >
      <MicroFlower size={pos.px} delayMs={800} />
      {debugDot && (
        <div
          style={{
            position: "absolute",
            left: -2,
            top: -2,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "red",
          }}
        />
      )}
    </div>
  );
}
