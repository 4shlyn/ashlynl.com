"use client";

type Props = {
  targetId?: string;
  offset?: number;            // extra pixels to subtract (e.g., sticky header)
  containerSelector?: string; // if you scroll inside a custom container
};

export default function ScrollHint({
  targetId = "projects",
  offset = 72,
  containerSelector,
}: Props) {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const target = document.getElementById(targetId);
    if (!target) {
      console.warn(`[ScrollHint] No element with id="${targetId}"`);
      return;
    }

    const explicit =
      containerSelector
        ? (document.querySelector(containerSelector) as HTMLElement | null)
        : null;
    const container = explicit ?? getScrollParent(target) ?? window;

    const y =
      container === window
        ? window.scrollY + target.getBoundingClientRect().top - offset
        : target.offsetTop - offset;

    // Some environments (older iOS) need both element & window paths
    try {
      if ("scrollTo" in container) {
        (container as HTMLElement).scrollTo({ top: y, behavior: "smooth" });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } catch {
      // hard fallback
      (container === window ? window : (container as HTMLElement)).scrollTo(0, y);
    }
  };

  return (
    <button className="scroll-hint" onClick={onClick} aria-label="Scroll to content">
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
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* find nearest scrollable parent if you use nested scrolling */
function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = node?.parentElement ?? null;
  while (el) {
    const s = getComputedStyle(el);
    if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight) return el;
    el = el.parentElement;
  }
  return null;
}
