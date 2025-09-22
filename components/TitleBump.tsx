'use client';

import { useEffect, useRef } from 'react';

type Props = {
  text: string;
  startDelay?: number; // ms before the sequence starts
  stagger?: number;    // ms between letters
};

export default function TitleBump({ text, startDelay = 150, stagger = 60 }: Props) {
  const h1Ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const root = h1Ref.current;
    if (!root) return;

    const chars = Array.from(root.querySelectorAll<HTMLElement>('.char'))
      .filter(el => !el.classList.contains('space')); // skip spaces

    const timers: number[] = [];

    chars.forEach((el, i) => {
      const t = window.setTimeout(() => {
        el.classList.add('bump');
        // clean up the class when the animation finishes
        const onEnd = () => el.classList.remove('bump');
        el.addEventListener('animationend', onEnd, { once: true });
      }, startDelay + i * stagger);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [startDelay, stagger]);

  return (
    <h1 ref={h1Ref} className="brand-title" aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className={`char${ch === ' ' ? ' space' : ''}`}
          aria-hidden="true"
        >
          {ch}
        </span>
      ))}
    </h1>
  );
}
