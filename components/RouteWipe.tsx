'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function RouteWipe(){
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<'idle'|'cover'|'reveal'>('idle');
  const hrefRef = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const onGo = (e: Event) => {
      const href = (e as CustomEvent).detail?.href as string;
      if (!href || phase !== 'idle') return;
      hrefRef.current = href;
      setPhase('cover');
      timers.current.push(window.setTimeout(() => {
        const before = pathname;
        router.push(href);
        //failsafe
        timers.current.push(window.setTimeout(() => {
          if (before === pathname) window.location.href = href;
        }, 900));
      }, 320));
    };
    window.addEventListener('route:go', onGo as EventListener);
    return () => window.removeEventListener('route:go', onGo as EventListener);
  }, [phase, router, pathname]);

  useEffect(() => {
    if (phase === 'cover' && hrefRef.current) {
      timers.current.push(window.setTimeout(() => {
        setPhase('reveal');
        timers.current.push(window.setTimeout(() => {
          setPhase('idle');
          hrefRef.current = null;
        }, 650));
      }, 120));
    }
    return () => { timers.current.forEach(t => window.clearTimeout(t)); };
  }, [pathname]); //reveal when url changes

  const active = phase !== 'idle';
  return (
    <div className={`route-wipe ${active ? 'active' : ''} ${phase}`} aria-hidden>
      <div className="sheet" />
    </div>
  );
}
