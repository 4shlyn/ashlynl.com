'use client';

export default function FancyTitle({ text }: { text: string }) {
  return (
    <h1 className="brand-title" aria-label={text}>
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
