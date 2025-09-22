export default function ScrollHint({ targetId = "projects" }: { targetId?: string }) {
  return (
    <a href={`#${targetId}`} className="scroll-hint" aria-label="Scroll to content">
      <span className="scroll-hint__label">Scroll</span>
      <div className="scroll-hint__arrows">
        <ChevronDown className="scroll-hint__chev" />
        <ChevronDown className="scroll-hint__chev" />
        <ChevronDown className="scroll-hint__chev" />
      </div>
    </a>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
